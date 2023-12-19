import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { CycleEditor } from '../CycleEditor'
import { NewTimer, RunningTimer } from '../Timer'
import { DescriptionEditor } from '../DescriptionEditor'
import { FinishedCyclesList } from '../FinishedCyclesList'
import {
  bindUpdaters, compose, composeUpdaters,
  shallowMerger, updateIn, updateKey,
} from '../ActionsFramework'

const FIVE_MINUTES_MS = 5 * 60 * 1000;

export const unlessCurrentTimerSet = (stateUpdater) => (state) => {
  if (state.currentTimer)
    return {}
  return typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;
}

export const ifCurrentTimerSet = (stateUpdater) => (state) => {
  if (state.currentTimer)
    return typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;
  return {};
}

const Updaters = {
  clearTimer: () => composeUpdaters(
    { currentTimer: undefined },
    Updaters.resetCycle(),
    Updaters.finishCycle(),
  ),
  startTimer: () => unlessCurrentTimerSet(({ description }) =>
    description.trim() === '' ? {} : {
      description: '',
      timerStart: performance.now(),
      cycle: {
        id: uuidv4(),
        description: description.trim(),
      },
    }
  ),
  createTimer: ({ durationMs, interval }) => unlessCurrentTimerSet(({ timerStart }) => ({
    currentTimer: {
      timerStart,
      durationMs: durationMs,
      timeSpentMs: 0,
      interval,
    },
    timerStart: undefined,
  })),
  updateTimer: (timeSpentMs) => compose(
    ifCurrentTimerSet,
    updateIn('currentTimer', 'timeSpentMs'),
  )(timeSpentMs),
  resetCycle: () => ({ cycle: undefined }),
  clearFinishedCycles: () => ({ finishedCycles: [] }),
  finishCycle: () => ({ cycle, finishedCycles }) => ({
    finishedCycles: [cycle].concat(finishedCycles || [])
  }),
  updateCycleContent: (content) => updateKey('cycle')(shallowMerger({ content })),
  updateCycleDescription: (description) => updateKey('cycle')(shallowMerger({ description })),
  updateInterimDescription: (description) => ({ description }),
}

const countdown = ({ shouldClearFn, timerStartFn, durationMsFn, onCountdownEnd, onUpdate }) => {
  const interval = setInterval(() => {
    if (shouldClearFn(interval)) {
      clearInterval(interval)
      return
    }
    const delta = performance.now() - timerStartFn()
    if (delta > durationMsFn()) {
      onCountdownEnd()
    } else {
      onUpdate(delta)
    }
  }, 100)
  return interval;
}

export class App extends Component {

  TIMER_DURATION_MS = FIVE_MINUTES_MS

  constructor(props) {
    super(props)
    this.state = composeUpdaters(
      Updaters.clearFinishedCycles(),
      Updaters.resetCycle(),
      Updaters.updateInterimDescription(''),
    )({})
    this.actions = bindUpdaters(this, Updaters, {
      createTimer: (interval) => ({ interval, durationMs: this.TIMER_DURATION_MS }),
      updateCycleContent: (event) => event.target.value,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.timerStart && this.state.timerStart !== prevState.timerStart) {
      this.actions.createTimer(countdown({
        shouldClearFn: (interval) => (
          !this.state.timerStart && (
            !this.state.currentTimer ||
            this.state.currentTimer.interval !== interval
          )
        ),
        timerStartFn: () => this.state.currentTimer.timerStart,
        durationMsFn: () => this.state.currentTimer.durationMs,
        onCountdownEnd: this.actions.clearTimer,
        onUpdate: this.actions.updateTimer,
      }))
    }
  }

  render() {
    const { currentTimer, cycle, finishedCycles, description } = this.state;
    return (
      <div className="App container">
        <h1>5 Minute Timer!</h1>
        <div className='card'>
          <div className='card-header'>
            {currentTimer
              ? (
                <RunningTimer
                  durationMs={currentTimer.durationMs}
                  timeSpentMs={currentTimer.timeSpentMs}
                  onDone={this.actions.clearTimer} />
              ) : (
                <NewTimer
                  durationMs={this.TIMER_DURATION_MS}
                  onStart={description.trim() !== '' ? this.actions.startTimer : undefined} />
              )
            }
            {cycle && cycle.description}
          </div>
          <div className='card-body'>
            {cycle
              ? (
                <CycleEditor
                  cycle={cycle}
                  onChangeContent={this.actions.updateCycleContent}
                />
              )
              : (
                <DescriptionEditor
                  value={description}
                  onChange={this.actions.updateInterimDescription}
                  onSubmit={this.actions.startTimer} />
              )
            }
          </div>
        </div>
        {finishedCycles &&
          <div>
            <h2>Previous cycles</h2>
            <FinishedCyclesList cycles={finishedCycles} />
          </div>
        }
      </div >
    );
  }
}

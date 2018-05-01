import React, { Component } from 'react'
import { CycleEditor } from './CycleEditor'
import { NewTimer, RunningTimer } from './TimerForm'
import { DescriptionEditor } from './DescriptionEditor'
import { FinishedCycle } from './FinishedCycle'

const FIVE_MINUTES_MS = 0.1 * 60 * 1000;

const applyUpdater = (stateUpdater, state) =>
  typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;

const shallowMerger = (stateUpdater) => (state) => {
  const update = typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;
  return typeof state === 'object' ? { ...state, ...update } : update
}

const compose = (...funcs) => (arg) => funcs.reduceRight((v, f) => f(v), arg)

const composeUpdaters = (...updaters) => (state) =>
  updaters.reduceRight(
    (state, updater) => Object.assign(state, applyUpdater(updater, state)),
    { ...state }
  )

const unlessCurrentTimerSet = (stateUpdater) => (state) => {
  if (state.currentTimer)
    return {}
  return typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;
}

const ifCurrentTimerSet = (stateUpdater) => (state) => {
  if (state.currentTimer)
    return typeof stateUpdater === 'function' ? stateUpdater(state) : stateUpdater;
  return {};
}

const empty = {}

const updateKey = (key) => (updater) => shallowMerger((state) => ({
  [key]: applyUpdater(updater, (state || empty)[key])
}))

const updateIn = (...keys) => compose.apply(undefined, keys.map(updateKey))

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
      cycle: { description: description.trim() },
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

const bindUpdaters = (component, updaters, argMappers = {}) => {
  const actions = {}
  for (const key of Object.keys(updaters)) {
    const argMapper = argMappers[key]
    if (argMapper) {
      actions[key] = (arg) => component.setState(updaters[key](argMapper(arg)))
    } else {
      actions[key] = (arg) => component.setState(updaters[key](arg))
    }
  }
  return actions
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

class App extends Component {

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
        <div>
          <h2>Cycles done</h2>
          {finishedCycles.map((cycle, i) => <FinishedCycle key={i} {...cycle} />)}
        </div>
        <button onClick={() => console.log(this.state)}>Dump</button>
      </div >
    );
  }
}

export default App;

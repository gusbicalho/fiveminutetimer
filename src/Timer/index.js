import React from 'react'

function zeroLeftPad(val, length) {
  const s = "00000" + val
  return s.substr(s.length - length)
}

function renderTime(timeMs) {
  const timeSeconds = Math.ceil(timeMs / 1000)
  const minutes = Math.floor(timeSeconds / 60)
  const seconds = Math.ceil(timeSeconds - minutes * 60)
  return minutes + ":" + zeroLeftPad(seconds, 2)
}

const TimerRaw = ({ timeMs, buttonLabel, onClickButton, buttonDisabled }) => (
  <div style={{ display: 'flex' }}>
    <h2 style={{ flex: 1 }}>{renderTime(timeMs)}</h2>
    <button
      className="btn btn-primary"
      disabled={buttonDisabled}
      onClick={onClickButton}>
      {buttonLabel}
    </button>
  </div>
)

export const NewTimer = ({ durationMs, onStart }) => (
  <TimerRaw
    timeMs={durationMs}
    buttonLabel='Start!'
    buttonDisabled={!onStart}
    onClickButton={onStart} />
)

export const RunningTimer = ({ durationMs, timeSpentMs, onDone }) => (
  <TimerRaw
    timeMs={durationMs - timeSpentMs}
    buttonLabel='Done!'
    onClickButton={onDone} />
)

import React from 'react'
import PropTypes from 'prop-types'

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

export const NewTimer = ({ durationMs, onStart }) => (
  <div>
    {renderTime(durationMs)}
    <button
      className="btn btn-primary"
      disabled={!onStart}
      onClick={onStart}>
      Start!
    </button>
  </div>
)

export const RunningTimer = ({ durationMs, timeSpentMs, onDone }) => (
  <div>
    {renderTime(durationMs - timeSpentMs)}
    <button
      className="btn btn-primary"
      onClick={onDone}>
      Done!
    </button>
  </div>
)

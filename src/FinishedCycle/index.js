import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const COLLAPSED_STYLE = Object.freeze({
  height: '2em',
  overflow: 'hidden',
})

export const FinishedCycle = ({ description, content, toggleCollapse, collapsed }) => (
  <div className='card finished-cycle'>
    <div className='card-header' style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{description}</div>
      <CopyToClipboard text={`${description}\n\n${content}`}>
        <button className='btn btn-secondary btn-sm'>Copy to Clipboard</button>
      </CopyToClipboard>

      {toggleCollapse &&
        <button className='btn btn-secondary btn-sm' onClick={toggleCollapse}>
          {collapsed ? '+' : '-'}
        </button>}
    </div>
    <div className='card-body' style={collapsed ? COLLAPSED_STYLE : undefined}>
      <pre>{content}</pre>
    </div>
  </div>
)

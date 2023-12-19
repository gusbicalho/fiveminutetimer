import React from 'react'
import { CopyToClipboardButton } from '../CopyToClipboardButton'

const COLLAPSED_STYLE = Object.freeze({
  height: '2em',
  overflow: 'hidden',
})

export const FinishedCycle = ({ description, content, toggleCollapse, collapsed }) => (
  <div className='card finished-cycle'>
    <div className='card-header' style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{description}</div>
      <CopyToClipboardButton text={`${description}\n\n${content}`} />

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

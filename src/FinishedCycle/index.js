import React from 'react'

export const FinishedCycle = ({ description, content, toggleCollapse, collapsed }) => (
  <div className='card'>
    <div className='card-header' style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{description}</div>
      {toggleCollapse &&
        <button className='btn btn-secondary' onClick={toggleCollapse}>
          {collapsed ? 'Show content' : 'Hide content'}
        </button>}
    </div>
    {collapsed ||
      <div className='card-body'>
        <pre>{content}</pre>
      </div>
    }
  </div>
)

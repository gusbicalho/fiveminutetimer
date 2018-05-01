import React from 'react'
import { FinishedCycle } from '../FinishedCycle'
import { Toggle } from '../Toggle'

export const FinishedCyclesList = ({ cycles }) => (
  <div>
    {cycles[0] &&
      <FinishedCycle {...cycles[0]} />
    }
    {cycles.slice(1).map((cycle, i) => (
      <Toggle initialStatus={true} key={cycle.id}>{({ toggle, status }) => (
        <FinishedCycle
          {...cycle}
          toggleCollapse={toggle}
          collapsed={status} />
      )}</Toggle>
    ))}
  </div>
)

import React from 'react'

export const FinishedCycle = ({ description, content }) => (
  <div>
    <h3>{description}</h3>
    <div><pre>{content}</pre></div>
  </div>
)

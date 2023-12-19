import React from 'react'
import './CycleEditor.css';

export const CycleEditor = ({ cycle, onChangeContent, style }) => (
  <textarea
    className='cycle-editor form-control'
    style={style}
    autoFocus={true}
    value={(cycle && cycle.content) || ''}
    onChange={onChangeContent}
    readOnly={!cycle}
    disabled={!cycle}
  />
)

import React from 'react'
import { Editor } from '../Editor';

export const CycleEditor = ({ cycle, onChangeContent }) => (
  <Editor
    value={(cycle && cycle.content) || ''}
    onChange={onChangeContent}
    readOnly={!cycle}
    disabled={!cycle}
  />
)

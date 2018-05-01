import React, { Component } from 'react';
import './Editor.css';

export const Editor = ({ value, onChange, style, readOnly, disabled }) => (
  <textarea
    className='editor'
    style={style}
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    disabled={disabled}
  />
)
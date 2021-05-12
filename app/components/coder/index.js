/**
 * Form item code editor.
 */
import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import './ansi';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 700px;
  .CodeMirror, .Form_CodeMirror {
    height: 100% !important;
  }
`;

const FormCoder = ({
  language, // maybe used in the future
  value,
  style,
  onChange,
  selfClassName,
  hight
}) => {
  return (
    <Container style={style} hight={hight} className={selfClassName}>
      <ControlledEditor
        value={value}
        onBeforeChange={(editor, data, value) => onChange(value)}
        options={{
          lineNumbers: true, // show linenumbers
          lineWrapping: true, // auto wrap
          lint: true, // auto lint code
          theme: 'material', // now we only support one theme
          indentUnit: 2, // 2 space indent
          tabSize: 2, // one tab size equals to 2 whitespace
          mode: 'application/json',
          specialChars: /\u001B/,
          specialCharPlaceholder: function (char) {
            return document.createElement('span');
          }
        }}
        className='Form_CodeMirror'
      />
    </Container>
  );
};

export default FormCoder;

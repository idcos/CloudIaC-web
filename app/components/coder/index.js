/* eslint-disable no-control-regex */
/**
 * Form item code editor.
 */
import React, { useEffect, useState, useImperativeHandle } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neo.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';

/**
 * defineMode
 */
import './mode/error-text';

/**
 * rego mode
 */
import 'codemirror-rego/mode';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror-rego/key-map';

/**
 * search
 */
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';

import './mode/error-text';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import styled from 'styled-components';
import get from 'lodash/get';
import noop from 'lodash/noop';

const Container = styled.div`
  width: 100%;
  height: 700px;
  margin-top: 1px;
  .CodeMirror,
  .Form_CodeMirror {
    height: 100% !important;
  }
`;

const FormCoder = ({
  childRef,
  domRef,
  language, // maybe used in the future
  value,
  style,
  onChange = noop,
  selfClassName,
  hight,
  options,
  autoScrollToBottom, // 是否开启自动滚动至最后一行
}) => {
  const [codemirror, setCodemirror] = useState();

  useEffect(() => {
    setTimeout(() => {
      codemirror && codemirror.refresh();
    }, 300);
  }, [value]);

  const _options = {
    lineNumbers: true, // show linenumbers
    lineWrapping: true, // auto wrap
    lint: true, // auto lint code
    theme: 'neo', // now we only support one theme
    indentUnit: 2, // 2 space indent
    tabSize: 2, // one tab size equals to 2 whitespace
    mode: 'application/json',
    specialChars: /\u001B/,
    specialCharPlaceholder: function (char) {
      return document.createElement('span');
    },
    ...options,
  };

  const autoScrollToBottomFn = () => {
    if (!autoScrollToBottom) {
      return;
    }
    setTimeout(scrollToBottom); // 延迟效果为了dom加载出来再滚到底部
  };

  const scrollToTop = () => {
    const vert = get(codemirror, 'display.scrollbars.vert', {});
    vert.scrollTo &&
      vert.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  };

  const scrollToBottom = () => {
    const vert = get(codemirror, 'display.scrollbars.vert', {});
    vert.scrollTo &&
      vert.scrollTo({
        top: vert.scrollHeight,
        behavior: 'smooth',
      });
  };

  const editorDidMount = editor => {
    setCodemirror(editor);
  };

  useImperativeHandle(childRef, () => ({
    search: keyword => {
      if (!codemirror) {
        throw new Error('编辑器还未装载完成');
      }
      codemirror.execCommand('find');
      try {
        let searchInp = document.querySelector('input.CodeMirror-search-field');
        searchInp.value = keyword;
        searchInp.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
      } catch (error) {
        throw new Error('编辑器搜索功能异常');
      }
    },
    execCommand: type => {
      codemirror.execCommand(type);
    },
    scrollToTop,
    scrollToBottom,
  }));

  return (
    <Container
      ref={domRef}
      style={style}
      hight={hight}
      className={selfClassName}
    >
      <ControlledEditor
        onChange={autoScrollToBottomFn}
        editorDidMount={editorDidMount}
        value={value}
        onBeforeChange={(editor, data, value) => onChange(value)}
        options={_options}
        className='Form_CodeMirror'
      />
    </Container>
  );
};

export default FormCoder;

/**
 * Form item code editor.
 */
import React, { useState, useImperativeHandle } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/javascript/javascript";

/**
 * search
 */
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/match-highlighter.js";
import "codemirror/addon/search/jump-to-line.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";

import "./ansi";
import { Controlled as ControlledEditor } from "react-codemirror2";
import styled from "styled-components";
import get from "lodash/get";

const Container = styled.div`
  width: 100%;
  height: 700px;
  .CodeMirror,
  .Form_CodeMirror {
    height: 100% !important;
  }
`;

const FormCoder = ({
  childRef,
  language, // maybe used in the future
  value,
  style,
  onChange,
  selfClassName,
  hight,
  options,
  autoScrollToBottom // 是否开启自动滚动至最后一行
}) => {
  const [ codemirror, setCodemirror ] = useState();

  const _options = {
    lineNumbers: true, // show linenumbers
    lineWrapping: true, // auto wrap
    lint: true, // auto lint code
    theme: "material", // now we only support one theme
    indentUnit: 2, // 2 space indent
    tabSize: 2, // one tab size equals to 2 whitespace
    mode: "application/json",
    specialChars: /\u001B/,
    specialCharPlaceholder: function (char) {
      return document.createElement("span");
    },
    ...options
  };

  const autoScrollToBottomFn = (editor) => {
    if (!autoScrollToBottom) {
      return;
    }
    scrollToBottom();
  };
  
  const scrollToTop = () => {
    const vert = get(codemirror, "display.scrollbars.vert", {});
    vert.scrollTo && vert.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    const vert = get(codemirror, "display.scrollbars.vert", {});
    vert.scrollTo && vert.scrollTo({
      top: vert.scrollHeight,
      behavior: 'smooth'
    });
  };

  const editorDidMount = (editor) => {
    setCodemirror(editor);
  };

  useImperativeHandle(childRef, () => ({
    // 搜索临时方案 - 不喜勿喷 0.0
    search: (keyword) => {
      if (!codemirror) {
        throw new Error('编辑器还未装载完成');
      }
      codemirror.execCommand('find'); //触发
      try {
        let searchInp = document.querySelector('input.CodeMirror-search-field');
        searchInp.value = keyword;
        searchInp.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
      } catch (error) {
        throw new Error('编辑器搜索功能异常');
      }
    },
    scrollToTop,
    scrollToBottom
  }));

  return (
    <Container style={style} hight={hight} className={selfClassName}>
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

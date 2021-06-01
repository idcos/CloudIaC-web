import React, { useRef } from 'react';
import { Remarkable } from 'remarkable';
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

import test from '../../../../developerManual/components/test-md.js';

import styles from './styles.less';

export default (props) => {
  const ref = useRef(new Remarkable({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {
          console.log(err);
        }
      }

      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {
        console.log(err);
      }
      return ""; // use external default escaping
    }
  }));

  const getRawMarkup = () => {
    return { __html: ref.current.render(test) };
  };

  return <div
    className={styles.mdContent}
    dangerouslySetInnerHTML={getRawMarkup()}
  >
  </div>;
};

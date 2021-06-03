import React, { useState, useEffect, useRef } from "react";
import { Anchor } from "antd";
const { Link } = Anchor;
import { Remarkable } from "remarkable";
import get from 'lodash/get';
import set from 'lodash/set';
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import styles from "./styles.less";

const getParent = (data, grade) => {
  if (!data || data.grade >= grade) {
    return;
  }
  const { children } = data;
  return getParent(children[children.length - 1], grade) || data;
};

export default (props) => {

  const { mdText, scrollDomSelecter } = props;

  const [ anchorList, setAnchorList ] = useState([]);
  const [ anchorBaseData, setAnchorBaseData ] = useState({});
  const [ innerHTML, setInnerHTML ] = useState();

  const ref = useRef(
    new Remarkable({
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
    })
  );

  const loop = (arr) => {
    return arr.map((it) => (
      <Link href={'#' + it.href} title={it.title}>
        {loop(it.children)}
      </Link>
    ));
  };

  useEffect(() => {
    let arr = [];
    const { list, highestGrade } = anchorBaseData;
    (list || []).forEach((item) => {
      const { title, grade, href } = item;
      const parent = getParent(arr[arr.length - 1], grade);
      if (parent) {
        const diffGrade = grade - parent.grade;
        let path = parent.path;
        for (let i = 0; i < diffGrade; i++) {
          const lastParent = get(arr, path);
          path = `${path}.children[${lastParent.children.length}]`;
          if (i === diffGrade - 1) {
            set(arr, path, { isTpl: false, children: [], path, title, grade, href });
          } else {
            set(arr, path, { isTpl: true, children: [], path, grade: parent.grade + i + 1 });
          }
        }
      } else {
        const diffGrade = grade - highestGrade;
        let path = `[${arr.length}]`;
        for (let i = 0; i <= diffGrade; i++) {
          if (i === diffGrade) {
            set(arr, path, { isTpl: false, children: [], path, title, grade, href });
          } else {
            set(arr, path, { isTpl: true, children: [], path, grade: highestGrade + i + 1 });
          }
          path = `${path}.children[0]`;
        }
      }
    });
    setAnchorList(arr);
  }, [anchorBaseData]);

  useEffect(() => {
    if (!mdText) {
      return;
    }
    let html = ref.current.render(mdText);
    let arr = [];
    let highestGrade;
    const reg = /<[Hh]([1-4])>([^<]*?)<\/[Hh]\1>/g;
    html = html.replace(reg, (hTag, grade, title) => {
      const len = arr.length;
      const href = `anchor-${len}`;
      const a = `<a id="${href}"></a>`;
      grade = Number(grade);
      arr.push({ title, grade, href });
      highestGrade = (highestGrade && grade > highestGrade) ? highestGrade : grade;
      return a + hTag;
    });
    setAnchorBaseData({
      list: arr,
      highestGrade
    });
    setInnerHTML(html);
  }, [mdText]);

  return (
    <div className={styles.markdownDoc} style={{ paddingRight: 300 }}>
      <div className='doc-anchor-wrapper'>
        <Anchor 
          className='doc-anchor' 
          onClick={e => e.preventDefault()}
          affix={false} 
          targetOffset={110}
          bounds={50}
          showInkInFixed={true}
          getContainer={() => document.querySelector(scrollDomSelecter)}
        >
          {loop(anchorList)}
        </Anchor>
      </div>
      <div className='doc-content'>
        {/* <h1>开发者手册</h1> */}
        <div className='doc-content-scroll' dangerouslySetInnerHTML={{ __html: innerHTML }}></div>
      </div>
    </div>
  );
};

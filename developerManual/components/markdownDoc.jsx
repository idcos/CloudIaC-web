import React, { useEffect, useRef } from "react";
import { Anchor } from "antd";
const { Link } = Anchor;
import { Remarkable } from "remarkable";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import styles from "./styles.less";
import testMd from "./test-md";

export default () => {
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

  const getRawMarkup = () => {
    return { __html: ref.current.render(testMd) };
  };

  return (
    <div className={styles.markdownDoc} style={{ paddingRight: 300 }}>
      <Anchor className='doc-anchor' affix={false} getCurrentAnchor={() => '#c1'}>
        <Link href='#c1' title='开发流程' />
        <Link href='#c2' title='登录地址' />
        <Link href='#c3' title='登录用户名、密码' />
        <Link href='#c4' title='脚手架获取' />
        <Link href='#c5' title='目录文件说明' />
        <Link href='#c6' title='开发并提交代码' />
        <Link href='#c7' title={"terraform & ansible 串连配置示例"} />
        <Link href='#c8' title='创建、运行云模板' />
      </Anchor>
      <div className='doc-content'>
        <h1>开发者手册</h1>
        <div className='' dangerouslySetInnerHTML={getRawMarkup()}></div>
      </div>
    </div>
  );
};

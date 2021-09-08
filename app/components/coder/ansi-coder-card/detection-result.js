import React, { useState, useRef } from "react";
import { Button, Input, Card, Space } from "antd";
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined, FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { default as AnsiUp } from 'ansi_up';
import { useThrottleEffect } from 'ahooks';

import { getNumLen } from 'utils/util';

import styles from './styles.less';
import SearchByKeyWord from './dom-event';

const ansi_up = new AnsiUp();
const searchService = new SearchByKeyWord({ 
  searchWrapperSelect: '.ansi-coder-content',
  excludeSearchClassNameList: [
    'line-index'
  ]
});

export default ({ value, cardTitleAfter, showHeader }) => {
  const [ fullScreen, setFullScreen ] = useState(false);
  const ansiCoderWrapperRef = useRef();
  const searchRef = useRef();
  const [ html, setHtml ] = useState('');
  console.log(value, 'value');
  let formatList = [
    { name: '策略组名称', code: 'policyGroupName' },
    { name: '策略名称', code: 'policyName' },
    { name: '严重程度', code: 'severity' },
    { name: '资源类型', code: 'resourceType' },
    { name: '文件', code: 'filePath' },
    { name: 'name', code: 'filePath' },
    { name: '错误所在行数', code: 'line' },
    { name: 'code', code: '提供从 line 开始向后共 3 行源码' },
    { code: 'source', isCode: true },
    { name: '建议', code: 'fixSuggestion', showName: true },
    { code: 'fixSuggestion' },
    { name: '建议', code: 'message' }
  ];

  let forMartData = () => {
    let ll = [];
    formatList.forEach(it => {
      if (!!it.name) {
        if (it.name === 'code') {
          let obj = {};
          let aaa = value.source;
          let ls = !!aaa && aaa.replace(/"/g, '');
          let lt = !!ls && ls.split('\n') || [];
          obj.name = '参考源码 code';
          obj.code = `提供从 ${value.line || '-'} 开始向后共 ${lt.length} 行源码`;
          !!value.source && ll.push(obj);
        } else {
          let obj = {};
          obj.name = it.name;
          obj.code = it.showName ? '' : value[it.code] || '';
          !!value[it.code] && ll.push(obj);
        }
      } else {
        if (it.code === 'source') {
          let aaa = value[it.code];
          let ls = !!aaa && aaa.replace(/"/g, '');
          let lt = !!ls && ls.split('\n');
          !!lt && lt.forEach((dt) => {
            let objs = {};
            objs.code = dt;
            objs.isViewLine = dt;
            ll.push(objs);
          });
        }
        if (it.code === 'fixSuggestion') {
          let aaa = value[it.code];
          let ls = !!aaa && aaa.replace(/ /g, '');
          let lt = !!ls && ls.split('\n');
          !!lt && lt.forEach((dt) => {
            let objs = {};
            objs.code = dt;
            ll.push(objs);
          });
        }
      }
    });
    return ll;
  };
  console.log(forMartData());
  //   return [ '策略组名称 policyGroupName',
  //     '策略名称 policyName',
  //     '严重程度 severity',
  //     '资源类型 resourceType',
  //     '文件 filePath',
  //     '错误所在行数 10',
  //     '参考源码 code   提供从 line 开始向后共 3 行源码',
  //     // eslint-disable-next-line no-unexpected-multiline
  //     // `"code": "resource "alicloud_vpc" "jack_vpc" {\n  vpc_name = "tf_jack_vpc"\n  cidr_block = "172.16.0.0/12""`
  //     ...lt
  //   ];
  let errorLine = value.line;
  useThrottleEffect(
    () => {
      const maxLineIndexLen = getNumLen(forMartData().length);
      const lineIndexWidth = 6 + 8.5 * maxLineIndexLen;
      const _html = forMartData().map((line, index) => {
        // 计算indexline展示的位置 
        return `
          <div class='ansi-line' style='padding-left: ${lineIndexWidth}px;'>
            <span class='line-index' style='width: ${lineIndexWidth}px;'>${line.isViewLine ? errorLine++ : ""}</span>
            <pre class='line-text reset-styles ${line.isViewLine ? 'UbuntuMonoUnOblique' : ''}'><span style='color: rgba(0,0,0,0.4)'>${line.name || ''}</span>   ${ansi_up.ansi_to_html(line.code)}</pre>
          </div>
        `;
      }).join('');
      setHtml(_html);
      setTimeout(() => {
        go('bottom');
      });
    },
    [value],
    {
      wait: 100
    }
  );

  const go = (type) => {
    try {
      const scrollDom = ansiCoderWrapperRef.current;
      let top;
      switch (type) {
      case 'top':
        top = 0;
        break;
      case 'bottom':
        top = scrollDom.scrollHeight;
        break;
      
      default:
        break;
      }
      scrollDom.scrollTo({
        top,
        behavior: 'smooth'
      });
    } catch (error) {
      console.log('滚动定位失败');
    }
  };
  const setFullScreenClose = (e) => {
    if (e.keyCode === 27) {
      setFullScreen(false);
    }
  };
  return (
    <Card
      className={`card-body-no-paading ${fullScreen ? "full-card" : ""} ${styles.ansiCodeCard}`}
      title={
        !showHeader && <>
          <Input.Search
            ref={searchRef}
            placeholder='请输入内容搜索'
            onSearch={(keyword) => {
              searchService.search(keyword);
              searchRef.current.focus();
            }}
            style={{ width: 240 }}
          />
          <div className='title-after'>
            {cardTitleAfter}
          </div>
        </>
      }
      extra={
        !showHeader && <Space>
          <Button onClick={() => go('top')}>
            <VerticalAlignTopOutlined />
            回顶部
          </Button>
          <Button onClick={() => go('bottom')}>
            <VerticalAlignBottomOutlined />
            回底部
          </Button>
          <Button onClick={() => setFullScreen(!fullScreen)} onKeyDown={(e) => setFullScreenClose(e)}>
            {
              fullScreen ? (
                <>
                  <FullscreenExitOutlined />&nbsp;退出全屏
                </>
              ) : (
                <>
                  <FullscreenOutlined />&nbsp;全屏显示
                </>
              )
            }
          </Button>
        </Space>
      }
    >
      <div className='ansi-coder-wrapper' ref={ansiCoderWrapperRef} >
        <div className='ansi-coder-content' dangerouslySetInnerHTML={{ __html: html }}>
        </div>
      </div>
    </Card>
  );
};

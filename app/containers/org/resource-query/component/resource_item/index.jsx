import React, { useState, useRef, useLayoutEffect } from 'react';
import styles from './styles.less';
import { safeJsonStringify, safeJsonParse } from 'utils/util';
import { connect } from "react-redux";
import history from 'utils/history';
import classNames from 'classnames';
import { Button } from 'antd';
import {
  ArrowRightOutlined
} from "@ant-design/icons";
import Coder from 'components/coder';

const KEY = 'global';

const resourceItem = ({ attrs, projectName, envName, type, resourceName, curOrg, projectId, envId }) => {

  const data = safeJsonParse([attrs]);
  const [ isUnfold, setIsUnfold ] = useState(false);
  const [ whetherOverflow, setWhetherOverflow ] = useState(false);
  const codeDomRef = useRef();

  useLayoutEffect(() => {
    const height = codeDomRef.current.clientHeight;
    if (height > 432) {
      setWhetherOverflow(true);
    }
  }, [attrs]);

  return (
    <div className={styles.resource_item}>
      <div className={styles.header}>
        <div className={styles.item}>
          <span className={styles.label}>项目</span>
          <span className={styles.value}>{projectName}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>环境</span>
          <span className={styles.value}>
            <a onClick={() => {
              history.push(`/org/${curOrg.id}/project/${projectId}/m-project-env/detail/${envId}`); 
            }}
            >
              {envName} <ArrowRightOutlined /> 
            </a>
          </span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>资源类型</span>
          <span className={styles.value}>{type}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>资源名称</span>
          <span className={styles.value}>{resourceName}</span>
        </div>
      </div>
      <div className={classNames(styles.json, isUnfold ? styles.unfold : undefined)}>
        {/* {whetherOverflow ? "溢出" : "未溢出"} */}
        <Button 
          onClick={() => {
            setIsUnfold(!isUnfold);
          }} 
          style={!whetherOverflow ? { display: "none" } : undefined} 
          className={styles.code_btn}
        >
          {isUnfold ? "点我收起" : "点我展开"}
        </Button>
        <Coder domRef={codeDomRef} value={safeJsonStringify([ data, null, 2 ])} style={{ height: 'auto' }} />
      </div>
    </div>
  );
};

export default connect((state) => {
  return {
    curOrg: state[KEY].get('curOrg'),
    curProject: state[KEY].get('curProject')
  };
})(resourceItem);

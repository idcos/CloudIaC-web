import React, { useState, useRef, useEffect } from "react";
import { Dropdown, Menu, Popconfirm } from 'antd';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import { useThrottleEffect } from 'ahooks';
import classnames from 'classnames';
import EllipsisText from 'components/EllipsisText';
import { chartUtils } from 'components/charts-cfg';
import { t } from 'utils/i18n';
import styles from '../styles.less';

export default ({ item = {}, setOpt, setRecord, toggleVisible, updateStatus }) => {
  const project_trend_Line = useRef();
  
  let CHART = useRef([
    { key: 'project_trend_Line', domRef: project_trend_Line, ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART.current);

  const edit = (record) => {
    setOpt('edit');
    setRecord(record);
    toggleVisible();
  };

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'project_trend_Line') {
        chartUtils.update(chart, {});
      }
    });
  }, []);

  useEffect(() => {
    resizeHelper.attach();
    return () => {
      resizeHelper.remove();
    };
  }, []);

  const menu = (item) => (<Menu>
    <Menu.Item>
      <a onClick={() => edit(item)}>
        {t('define.action.modify')}
      </a>
    </Menu.Item>
    <Menu.Item>
      {item.status === 'enable' ? 
        <Popconfirm
          title={t('define.project.status.disabled.confirm.title')}
          onConfirm={() => updateStatus(item, 'disable')}
        >
          <a>{t('define.project.status.disabled')}</a>
        </Popconfirm> : 
        <Popconfirm
          title={t('define.project.action.recovery.confirm.title')}
          onConfirm={() => updateStatus(item, 'enable')}
        >
          <a>{t('define.project.action.recovery')}</a>
        </Popconfirm>
      }
    </Menu.Item>
  </Menu>);

  return (<div className={'pjtItemBox'}>
    <div className={'pjtItemBox-header'}>
      <span className={'pjtItemBox-header-left'}> 
        <PlusCircleOutlined className={'pjtItemBox-header-left-icon'} />
        {item.name}
        <div className={'pjtItemBox-header-left-count'}>1</div>
      </span>
      <span className={'configBox'}>
        <Dropdown overlay={() => menu(item)} placement='bottomRight'>
          <MinusOutlined className={'configIcon'} />
        </Dropdown>
      </span>
    </div>
    <div><EllipsisText>{item.description || '-'}</EllipsisText></div>
    <div className={'project-report'}>
      <div ref={project_trend_Line} style={{ width: '100%', height: "100%" }}></div>
    </div>
  </div>);
};

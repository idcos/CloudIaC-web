import React, { useRef, useEffect } from "react";
import { Dropdown, Empty, Menu, Modal, Tooltip } from 'antd';
import { PlusCircleOutlined, InfoCircleFilled, EllipsisOutlined } from '@ant-design/icons';
import EllipsisText from 'components/EllipsisText';
import { chartUtils } from 'components/charts-cfg';
import { t } from 'utils/i18n';
import isEmpty from "lodash/isEmpty";

export default ({ isLastUse, changeProject, item = {}, setOpt, setRecord, toggleVisible, updateStatus }) => {
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
        chartUtils.update(chart, { resStats: item.resStats || [] });
      }
    });
  }, []);

  useEffect(() => {
    resizeHelper.attach();
    return () => {
      resizeHelper.remove();
    };
  }, []);

  const comfirmDisabled = (e) => {
    e.stopPropagation();
    Modal.confirm({
      icon: <InfoCircleFilled />,
      title: t('define.project.status.disabled.confirm.title'),
      onOk: () => updateStatus(item, 'disable')
    });
  };

  const comfirmEnable = (e) => {
    e.stopPropagation();
    Modal.confirm({
      icon: <InfoCircleFilled />,
      title: t('define.project.action.recovery.confirm.title'),
      onOk: () => updateStatus(item, 'enable')
    });
  };

  const menu = (<Menu>
    <Menu.Item>
      <a 
        onClick={(e) => {
          e.stopPropagation();
          edit(item);
        }}
      >
        {t('define.action.modify')}
      </a>
    </Menu.Item>
    <Menu.Item>
      {item.status === 'enable' ? 
        <a onClick={comfirmDisabled}>{t('define.project.status.disabled')}</a> : 
        <a onClick={comfirmEnable}>{t('define.project.action.recovery')}</a>
      }
    </Menu.Item>
  </Menu>);

  return (<div className={'pjtItemBox'} onClick={() => item.status === 'enable' && changeProject(item.id)}>
    <div className={'pjtItemBox-header'}>
      <span className={'pjtItemBox-header-left'}> 
        {/* <PlusCircleOutlined className={'pjtItemBox-header-left-icon'} /> */}
        <div className={'pjtItemBox-header-left-name'}><EllipsisText>{item.name}</EllipsisText></div>
        {!!item.activeEnvironment && (
          <Tooltip title={t('define.activeEnvironment')}>
            <div className={'pjtItemBox-header-left-count'}>{item.activeEnvironment}</div>
          </Tooltip>
        )}
      </span>
      <Dropdown 
        overlay={menu} 
        placement='bottomRight'
      >
        <EllipsisOutlined className={'configIcon'} onClick={(e) => e.stopPropagation()} />
      </Dropdown>
    </div>
    <div className='pjtItemBox-content'>
      <div className='description'>
        <EllipsisText>{item.description || '-'}</EllipsisText>
      </div>
      <span className='mark'>
        {!!isLastUse && '最近选择'}
      </span>
    </div>
    <div className={'project-report'}>
      {isEmpty(item.resStats) ? (
        <Empty imageStyle={{ display: 'none' }} style={{ marginTop: 16 }} />
      ) : <div ref={project_trend_Line} style={{ width: '100%', height: "100%" }}></div>}
    </div>
  </div>);
};

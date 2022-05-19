import React, { useRef, useEffect } from "react";
import { Button, Modal, Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import { GdIcon, RenameIcon } from 'components/iconfont';
import EllipsisText from 'components/EllipsisText';
import { chartUtils } from 'components/charts-cfg';
import { t, getLanguage } from 'utils/i18n';
import { formatImgUrl } from 'utils/util';
import moment from 'moment';
import isEmpty from "lodash/isEmpty";

export default ({ readOnly, isLastUse, changeProject, item = {}, setOpt, setRecord, toggleVisible, updateStatus }) => {
  const project_trend_Line = useRef();

  const language = getLanguage();
  let CHART = useRef([
    { key: 'project_trend_Line', domRef: project_trend_Line, ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART.current);

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

  const edit = () => {
    setOpt('edit');
    setRecord(item);
    toggleVisible();
  };

  const comfirmDisabled = () => {
    Modal.confirm({
      icon: <InfoCircleFilled />,
      title: t('define.project.status.disabled.confirm.title'),
      onOk: () => updateStatus(item, 'disable')
    });
  };

  const comfirmEnable = () => {
    Modal.confirm({
      icon: <InfoCircleFilled />,
      title: t('define.project.action.recovery.confirm.title'),
      onOk: () => updateStatus(item, 'enable')
    });
  };

  const handleActions = ({ key, domEvent }) => {
    domEvent.stopPropagation();
    switch (key) {
    case 'modify':
      edit();
      break;
    case 'disabled':
      comfirmDisabled();
      break;
    case 'recovery':
      comfirmEnable();
      break;
    default:
      break;
    }
  };

  return (<div className={`pjtItemBox ${!!isLastUse ? 'recent-project' : ''}`} onClick={() => item.status === 'enable' && changeProject(item.id)}>

    {!!isLastUse &&
      <div className='last-use-bar' role='img'>
        <img width={96} height={16} style={{ verticalAlign: 'top' }} src={formatImgUrl(`/assets/img/recent-project-${language}.png`)} />
      </div>}
    <div className={'pjtItemBox-header'}>
      <span className={'pjtItemBox-header-left'}>
        <div role='img'>
          <img width={18} height={20} src={formatImgUrl(`/assets/img/jewel.png`)} />
        </div>
        <div className={'pjtItemBox-header-left-name'}><EllipsisText>{item.name}</EllipsisText></div>
        {!!item.activeEnvironment && (
          <Tooltip title={t('define.activeEnvironment')}>
            <div className={'pjtItemBox-header-left-count'}>{item.activeEnvironment}</div>
          </Tooltip>
        )}
      </span>
      {!readOnly && (
        <div className='pjtItemBox-actions'>
          <Tooltip title={t('define.action.modify')}>
            <Button icon={<RenameIcon style={{ fontSize: 14, color: '#008C5A' }} />} onClick={(e) => handleActions({ key: 'modify', domEvent: e })} type='text' size='small' />
          </Tooltip>
          {item.status === 'enable' ?
            <Tooltip title={t('define.project.status.disabled')}>
              <Button icon={<GdIcon style={{ fontSize: 14, color: '#008C5A' }} />} onClick={(e) => handleActions({ key: 'disabled', domEvent: e })} type='text' size='small' />
            </Tooltip> :
            <Tooltip title={t('define.project.action.recovery')}>
              <Button icon={<GdIcon style={{ fontSize: 14, color: '#008C5A' }} />} onClick={(e) => handleActions({ key: 'recovery', domEvent: e })} type='text' size='small' />
            </Tooltip>
          }
        </div>
      )}
    </div>
    <div className='pjtItemBox-content'>
      <div className='description'>
        <EllipsisText>{item.description || '-'}</EllipsisText>
      </div>
    </div>
    <div className={'project-report'}>
      {isEmpty(item.resStats) ? (
        <div className='empty-container' role='img'>
          <img width={58} height={58} src={formatImgUrl(`/assets/img/no-data.png`)} />
          <div className='empty-text'>{t('define.noDataView')}</div>
        </div>
      ) : <div ref={project_trend_Line} style={{ width: '100%', height: "100%", opacity: '0.44' }}></div>}
    </div>
    <div className='card-bottom-container'>
      <EllipsisText className='text'>{item.creator || '-'}</EllipsisText>
      <EllipsisText className='text'>{item.createdAt ? moment(new Date(item.createdAt)).format('YYYY-MM-DD') : '-'}</EllipsisText>
    </div>
  </div>);
};

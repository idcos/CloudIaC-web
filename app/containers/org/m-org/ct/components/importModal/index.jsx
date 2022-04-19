import React, { useState, useEffect, useMemo } from 'react';
import { Button, Modal, Radio, Space, Upload, notification, Select } from 'antd';
import { DownIcon } from 'components/iconfont';
import classNames from 'classnames';
import styles from './index.less';
import tplAPI from 'services/tpl';
import projectAPI from 'services/project';
import { t } from 'utils/i18n';

const { Option } = Select;
const infoType = {
  created: t('define.ct.import.infoType.created'),
  updated: t('define.ct.import.infoType.updated'),
  skipped: t('define.ct.import.infoType.skipped'),
  copied: t('define.ct.import.infoType.copied')
};
const infoErrorType = {
  renamed: t('define.ct.import.infoErrorType.renamed'),
  duplicate: t('define.ct.import.infoErrorType.duplicate')
};
const Index = ({ reload, toggleVisible, orgId }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ importStatus, setImportStatus ] = useState('init');
  const [ importInfo, setImportInfo ] = useState({});
  const [ fileList, setFileList ] = useState([]);
  const [ type, setType ] = useState();
  const [ projectList, setProjectList ] = useState([]);
  const [ selectProject, setSelectProject ] = useState([]);
  const [ hasColon, setHasColon ] = useState(false);
  
  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async() => {
    let res = await projectAPI.allEnableProjects({ orgId });
    if (res.code === 200) {
      setProjectList(res.result.list || []);
    } else {
      notification.error({
        message: t('define.message.getFail'),
        description: res.message
      });
    }
  };
  
  const computeCount = () => {
    let count = 0;
    let successTypeList = Object.keys(infoType);
    Object.keys(importInfo).map((it, i) => {
      if (successTypeList.includes(it) && (it === 'created' || it === 'copied')) {
        count += (importInfo[it].templates || []).length;
        count += (importInfo[it].varGroups || []).length;
        count += (importInfo[it].vcs || []).length;
      }
    });
    return count;
  };

  const computeHasColon = (data) => {
    let flag = false;
    Object.keys(data).map((it, i) => {
      if ((data[it].templates || []).length > 0 || (data[it].varGroups || []).length > 0 || (data[it].vcs || []).length > 0) {
        flag = true;
      }
      setHasColon(flag);
    });
  };

  const onOk = async () => {
    if (fileList.length === 0) {
      return notification.error({ message: t('define.ct.import.message.error.selectFile') });
    }
    if (!type) {
      return notification.error({ message: t('define.ct.import.message.error.actionModeWhenRepeating') });
    }

    const formData = new FormData();
    formData.set('file', fileList[0] && fileList[0]);
    formData.set('idDuplicate', type);
    formData.set('projects', selectProject);

    const params = {
      file: formData,
      orgId
    };

    setSubmitLoading(true);
    const res = await tplAPI.importTemplates(params);
    setSubmitLoading(false);
    
    if (res.code !== 200) {
      setImportStatus('error');
      if (res.result) {
        setImportInfo(res.result || {});
        computeHasColon(res.result || {});
      }
      return notification.error({ message: res.message });
    } else {
      setImportStatus('success');
      setImportInfo(res.result || {});
      reload();
    }
  };

  const props = {
    showUploadList: false,
    beforeUpload: file => {
      setFileList([file]);
      return false;
    },
    fileList
  };

  const modalContent = useMemo(() => {
    switch (importStatus) {
      case 'success':
        return (
          <Space direction='vertical' size={4}>
            <div className={styles.resultHeader}>{t('define.ct.import.success.prefix')}&nbsp;{computeCount('success')}&nbsp;{t('define.ct.import.success.suffix')}</div>
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].templates || []).map((dt) => {
                return (<>
                  {!!infoType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoType[it]}【{t('define.scope.template')}】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].varGroups || []).map((dt) => {
                return (<>
                  {!!infoType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoType[it]}【{t('define.resourceAccount.title')}】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].vcs || []).map((dt) => {
                return (<>
                  {!!infoType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoType[it]}【{t('define.vcs')}】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
          </Space>
        );
      case 'error':
        return (
          <Space direction='vertical' size={4}>
            <div className={styles.resultHeader}>{t('define.ct.import.error.title')}{hasColon ? '：' : '。'}</div>
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].templates || []).map((dt) => {
                return (<>
                  {!!infoErrorType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoErrorType[it]}【{t('define.scope.template')}】</span>: <span className={styles.resultText}>{dt.id}</span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].varGroups || []).map((dt) => {
                return (<>
                  {!!infoErrorType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoErrorType[it]}【{t('define.resourceAccount.title')}】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].vcs || []).map((dt) => {
                return (<>
                  {!!infoErrorType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoErrorType[it]}【{t('define.vcs')}】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
          </Space>
        );
      case 'init':
        return (
          <Space direction='vertical' size='middle' style={{ width: '100%' }}>
            <Space style={{ width: '100%' }}>
              <Upload 
                {...props} 
              >
                <Button
                  icon={<DownIcon/>}
                  style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                >
                  {fileList[0] && fileList[0] ? t('define.ct.import.init.upload.reSelectFile') : t('define.ct.import.init.upload.selectFile')}
                </Button>
              </Upload>
              <span className={styles.uploadExtra} style={{ marginLeft: 0, color: fileList[0] && fileList[0] ? '#08857C' : 'none' }}>{fileList[0] && fileList[0] ? fileList[0].name : t('define.ct.import.init.upload.extra')}</span> 
            </Space>
            <Space direction='vertical' size={6} style={{ width: '100%' }}>
              <div className={styles.importHeader}><span>*</span> {t('define.ct.import.init.actionModeWhenRepeating')}</div>
              <Radio.Group className={styles.radioGroup} onChange={(e) => setType(e.target.value)} value={type} style={{ width: '100%' }}>
                <Space direction='vertical' size={4} style={{ width: '100%' }}>
                  <Radio value={'update'}>
                    <span>{t('define.ct.import.infoType.updated')}</span>
                    <span className={styles.radioText} title={t('define.ct.import.init.actionModeWhenRepeating.updated')}>
                      {t('define.ct.import.init.actionModeWhenRepeating.updated')}
                    </span>
                  </Radio> 
                  <Radio value={'skip'}>
                    <span>{t('define.ct.import.infoType.skipped')}</span>
                    <span className={styles.radioText} title={t('define.ct.import.init.actionModeWhenRepeating.skip')}>
                      {t('define.ct.import.init.actionModeWhenRepeating.skip')}
                    </span>
                  </Radio> 
                  <Radio value={'copy'}>
                    <span>{t('define.ct.import.infoType.copied')}</span>
                    <span style={{ marginLeft: 8 }} className={styles.radioText} title={t('define.ct.import.init.actionModeWhenRepeating.copy')}>
                      {t('define.ct.import.init.actionModeWhenRepeating.copy')}
                    </span>
                  </Radio> 
                  <Radio value={'abort'}>
                    <span>{t('define.ct.import.infoErrorType.duplicate')}</span>
                    <span className={styles.radioText} title={t('define.ct.import.init.actionModeWhenRepeating.abort')}>
                      {t('define.ct.import.init.actionModeWhenRepeating.abort')}
                    </span>
                  </Radio>
                </Space>
              </Radio.Group>
            </Space>
            <Space style={{ width: '100%' }}>
              <span>{t('define.ct.import.init.associatedProject')}</span><Select 
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placeholder={t('define.form.select.placeholder')}
                mode={'multiple'}
                showArrow={true}
                style={{ width: 350 }}
                onChange={e => setSelectProject(e)}
              >
                {(projectList || []).map(it => <Option value={it.id}>{it.name}</Option>)}
              </Select>
            </Space>
          </Space>
        );
      default:
        break;
    }
  });

  return <Modal
    title={`${importStatus === 'success' ? t('define.ct.import.result.success') : importStatus === 'error' ? t('define.ct.import.result.error') : t('define.ct.import')}`}
    visible={true}
    onCancel={toggleVisible}
    width={600}
    className='antd-modal-type-form'
    footer={<>
      {importStatus === 'init' ? <Space>
        <Button className='ant-btn-tertiary' onClick={toggleVisible}>{t('define.ct.import.action.cancel')}</Button>
        <Button type={'primary'} onClick={onOk} loading={submitLoading}>{t('define.ct.import.action.ok')}</Button>
      </Space> : <Button type={'primary'} onClick={toggleVisible}>{t('define.ct.import.action.gotIt')}</Button>}
    </>}
  >
    {modalContent}
  </Modal>;
};
export default Index;

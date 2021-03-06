import React, { useState, useEffect, useMemo } from 'react';
import { Button, Modal, Radio, Space, Upload, notification, Select } from 'antd';
import { DownIcon } from 'components/iconfont';
import classNames from 'classnames';
import styles from './index.less';
import tplAPI from 'services/tpl';
import projectAPI from 'services/project';

const { Option } = Select;
const infoType = {
  created: '新增',
  updated: '覆盖',
  skipped: '跳过',
  copied: '创建副本'
};
const infoErrorType = {
  renamed: '重命名',
  duplicate: '中止'
};
const infoTypeName = {
  templates: '云模板',
  vcs: 'VCS',
  varGroups: 'varGroups'
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
        message: '获取失败',
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
      return notification.error({ message: '请选择文件。' });
    }
    if (!type) {
      return notification.error({ message: '请选择UUID重复时的操作方式。' });
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
            <div className={styles.resultHeader}>成功导入模板{computeCount('success')}条：</div>
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].templates || []).map((dt) => {
                return (<>
                  {!!infoType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoType[it]}【云模板】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].varGroups || []).map((dt) => {
                return (<>
                  {!!infoType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoType[it]}【资源账号】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].vcs || []).map((dt) => {
                return (<>
                  {!!infoType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoType[it]}【VCS】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
          </Space>
        );
      case 'error':
        return (
          <Space direction='vertical' size={4}>
            <div className={styles.resultHeader}>UUID存在冲突，操作已中止，导入0条数据{hasColon ? '：' : '。'}</div>
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].templates || []).map((dt) => {
                return (<>
                  {!!infoErrorType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoErrorType[it]}【云模板】</span>: <span className={styles.resultText}>{dt.id}</span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].varGroups || []).map((dt) => {
                return (<>
                  {!!infoErrorType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoErrorType[it]}【资源账号】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
            {Object.keys(importInfo).map(it => {
              return (importInfo[it].vcs || []).map((dt) => {
                return (<>
                  {!!infoErrorType[it] && <span>
                    <span className={classNames(styles.resultTitle, { [styles.greenColor]: it === 'created' || it === 'copied' })}> {infoErrorType[it]}【VCS】</span>: <span><span className={styles.resultText}>{dt.name}</span><span className={styles.resultText}>({dt.id})</span></span>
                  </span>}
                </>);
              });
            })}
          </Space>
        );
      case 'init':
        return (
          <Space direction='vertical' size='middle'>
            <Space>
              <Upload 
                {...props} 
              >
                <Button
                  icon={<DownIcon/>}
                  style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
                >
                  {fileList[0] && fileList[0] ? '重新选择' : '选择文件'}
                </Button>
              </Upload>
              <span className={styles.radioText} style={{ marginLeft: 0, color: fileList[0] && fileList[0] ? '#00AB9D' : 'none' }}>{fileList[0] && fileList[0] ? fileList[0].name : '支持json文件'}</span> 
            </Space>
            <Space direction='vertical' size={6}>
              <div className={styles.importHeader}><span>*</span> 导入时以UUID作为是否重复导入的依据，UUID重复时的操作方式：</div>
              <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
                <Space direction='vertical' size={4}>
                  <Radio value={'update'}>覆盖 <span className={styles.radioText}>UUID重复时更新该条数据（包括云模板、VCS、资源帐号）</span></Radio> 
                  <Radio value={'skip'}>跳过 <span className={styles.radioText}>UUID重复时跳过该条数据，继续导入其他数据</span></Radio> 
                  <Radio value={'copy'}>创建副本 <span style={{ marginLeft: 0 }} className={styles.radioText}>UUID重复时，重新创建一条数据，如果名称也相同，给名称加上_copy后缀</span></Radio> 
                  <Radio value={'abort'}>中止 <span className={styles.radioText}>UUID重复时中止导入操作，不做任何变更</span></Radio>
                </Space>
              </Radio.Group>
            </Space>
            <Space>
              <span>关联项目：</span><Select 
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placeholder='请选择关联项目'
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
    title={`${importStatus === 'success' ? '导入成功' : importStatus === 'error' ? '导入失败' : '导入云模板'}`}
    visible={true}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    width={600}
    onOk={importStatus === 'init' ? onOk : toggleVisible}
    footer={<>
      {importStatus === 'init' ? <Space>
        <Button onClick={toggleVisible}>取消</Button>
        <Button type={'primary'} onClick={onOk}>确认</Button>
      </Space> : <Button type={'primary'} onClick={toggleVisible}>知道了</Button>}
    </>}
  >
    {modalContent}
  </Modal>;
};
export default Index;

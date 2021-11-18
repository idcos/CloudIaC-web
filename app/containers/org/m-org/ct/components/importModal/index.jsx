import React, { useState, useEffect } from 'react';
import { Button, Modal, Radio, Space, Upload, notification, Select } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import styles from './index.less';
import tplAPI from 'services/tpl';
import projectAPI from 'services/project';
import { reduce } from 'lodash';

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
const Index = ({ reload, toggleVisible, orgId }) => {
  const [ submitLoading, setSubmitLoading ] = useState(false);
  const [ importStatus, setImportStatus ] = useState('init');
  const [ importInfo, setImportInfo ] = useState({});
  const [ isImportSkipped, setIsImportSkipped ] = useState(false);
  const [ fileList, setFileList ] = useState([]);
  const [ type, setType ] = useState();
  const [ projectList, setProjectList ] = useState([]);
  const [ selectProject, setSelectProject ] = useState([]);

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
      if (successTypeList.includes(it)) {
        count += (importInfo[it].templates || []).length;
      }
    });
    return count;
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

  return <Modal
    title={`${importStatus === 'success' ? '导入成功' : importStatus === 'error' ? '导入失败' : '导入云模板'}`}
    visible={true}
    onCancel={toggleVisible}
    okButtonProps={{
      loading: submitLoading
    }}
    width={573}
    onOk={importStatus === 'init' ? onOk : toggleVisible}
    footer={<>
      {importStatus === 'init' ? <Space>
        <Button onClick={toggleVisible}>取消</Button>
        <Button type={'primary'} onClick={onOk}>确认</Button>
      </Space> : <Button type={'primary'} onClick={toggleVisible}>知道了</Button>}
    </>}
  >
    {importStatus === 'success' && (
      <Space direction='vertical'>
        <span style={{ fontWeight: 900 }}>成功导入云模板{computeCount('success')}条：</span>
        {Object.keys(importInfo).map(it => {
          return (importInfo[it].templates || []).map((dt) => {
            return (<span>
              {!!infoType[it] && <>
                <span className={styles.resultTiele} style={{ color: it === 'create' ? '#088245' : '#000' }}> {infoType[it]}</span>: <span className={styles.resultText}>{dt.id}</span>
              </>}
            </span>);
          });
        })}
      </Space>
    )}
    {importStatus === 'error' && (
      <Space direction='vertical'>
        <span style={{ fontWeight: 900 }}>UUID存在冲突，操作已中止，导入{computeCount('success')}条数据：</span>
        {Object.keys(importInfo).map(it => {
          return (importInfo[it].templates || []).map((dt) => {
            return (<span>
              {!!infoErrorType[it] && <>
                <span className={styles.resultTiele} style={{ color: it === 'create' ? '#088245' : '#000' }}> {infoErrorType[it]}</span>: <span className={styles.resultText}>{dt.id}</span>
              </>}
            </span>);
          });
        })}
      </Space>
    )}
    { importStatus === 'init' && (
      <Space direction='vertical'>
        <Space>
          <Upload 
            {...props} 
          >
            <Button
              icon={<VerticalAlignBottomOutlined/>}
              style={{ borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}
            >
              选择文件
            </Button>
          </Upload>
          <span className={styles.radioText} style={{ marginLeft: 0 }}>{fileList[0] && fileList[0] ? fileList[0].name : '支持json文件'}</span> 
        </Space>
        <span className={styles.importHeader}><span>*</span> 导入时以UUID作为是否重复导入的依据，UUID重复时的操作方式：</span>
        <Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
          <Space direction='vertical'>
            <Radio value={'update'}>覆盖 <span className={styles.radioText}>UUID重复时更新该条数据（包括云模板、VCS、资源帐号）</span></Radio> 
            <Radio value={'skip'}>跳过 <span className={styles.radioText}>UUID重复时跳过该条数据，继续导入其他数据</span></Radio> 
            <Radio value={'copy'}>创建副本 <span style={{ marginLeft: 0 }} className={styles.radioText}>UUID重复时，重新创建一条数据，如果名称也相同，给名称加上_copy后缀</span></Radio> 
            <Radio value={'abort'}>中止 <span className={styles.radioText}>UUID重复时中止导入操作，不做任何变更</span></Radio>
          </Space>
        </Radio.Group>
        <Space>
          <span>关联项目：</span><Select 
            getPopupContainer={triggerNode => triggerNode.parentNode}
            placeholder='请选择关联项目'
            mode={'multiple'}
            style={{ width: 350 }}
            onChange={e => setSelectProject(e)}
          >
            {(projectList || []).map(it => <Option value={it.id}>{it.name}</Option>)}
          </Select>
        </Space>
      </Space>)}

  </Modal>;
};
export default Index;
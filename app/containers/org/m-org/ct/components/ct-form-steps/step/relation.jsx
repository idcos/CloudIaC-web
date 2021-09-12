import React, { useState, useEffect, useImperativeHandle } from 'react';
import { Space, Checkbox, Form, Button, Row, Divider, notification, Empty } from "antd";

import projectAPI from 'services/project';
import OpModal from 'components/project-modal';

const FL = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
};

export default ({ goCTlist, childRef, stepHelper, orgId, ctData, type, opType, saveLoading }) => {

  const [form] = Form.useForm();

  const [ projectList, setProjectList ] = useState([]);
  const [ indeterminate, setIndeterminate ] = useState(false);
  const [ checkAll, setCheckAll ] = useState(false);
  const [ pjtModalVsible, setPjtModalVsible ] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    const defaultValues = ctData[type];
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  }, [ ctData, type ]);

  useEffect(() => {
    const defaultValues = ctData[type];
    if (defaultValues && projectList.length) {
      const { projectId = [] } = defaultValues;
      setIndeterminate(!!projectId && !!projectId.length && projectId.length < projectList.length);
      !!projectId && !!projectId.length && setCheckAll(projectId.length === projectList.length);
    }
  }, [ ctData, type, projectList ]);

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

  useImperativeHandle(childRef, () => ({
    onFinish: async (index) => {
      const values = await form.validateFields();
      stepHelper.updateData({
        type, 
        data: values
      });
      stepHelper.go(index);
    }
  }));

  const onFinish = (values) => {
    stepHelper.updateData({
      type, 
      data: values,
      isSubmit: true
    });
  };

  const onChange = (list) => {
    setIndeterminate(!!list.length && list.length < projectList.length);
    setCheckAll(list.length === projectList.length);
  };

  const onCheckAllChange = (e) => {
    form.setFieldsValue({
      projectId: e.target.checked ? projectList.map(it => it.id) : []
    });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const togglePjtModalVsible = () => setPjtModalVsible(!pjtModalVsible);

  const pjtOperation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: (param) => projectAPI.createProject(param)
      };
      let params = {
        ...payload
      };
      const res = await method[action](params);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      fetchProject();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  return <div className='form-wrapper' style={{ width: 720 }}>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <div>{
        projectList.length === 0 ? <div>
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={<>暂无项目，<a onClick={togglePjtModalVsible}>创建项目</a></>}
          />
          {
            pjtModalVsible && <OpModal
              visible={pjtModalVsible}
              orgId={orgId}
              opt='add'
              toggleVisible={togglePjtModalVsible}
              operation={pjtOperation}
            />
          }
        </div> : <div>
          <Row>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              选择全部项目
            </Checkbox>
          </Row>
          <Divider style={{ margin: '8px 0' }} />
          <Form.Item 
            name='projectId'
          >
            <Checkbox.Group onChange={onChange}>
              <Space direction='vertical' size={6}>
                {projectList.map(it => <Checkbox value={it.id}>{it.name}</Checkbox>)}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </div>
      }</div>
      
      <div className='btn-wrapper'>
        <Space size={24}>
          {
            opType === 'add' ? (
              <>
                <Button onClick={() => stepHelper.prev()} >上一步</Button>
                <Button type='primary' htmlType={'submit'} loading={saveLoading}>完成</Button>
              </>
            ) : (
              <>
                <Button onClick={goCTlist}>取消</Button>
                <Button type='primary' htmlType={'submit'} loading={saveLoading}>提交</Button>
              </>
            )
          }
        </Space>
      </div>
    </Form>
  </div>;
};

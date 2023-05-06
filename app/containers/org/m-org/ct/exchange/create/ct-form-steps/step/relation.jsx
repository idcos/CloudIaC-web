/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useImperativeHandle } from 'react';
import {
  Space,
  Checkbox,
  Form,
  Button,
  Row,
  Divider,
  notification,
  Empty,
} from 'antd';
import { t } from 'utils/i18n';
import projectAPI from 'services/project';
import OpModal from 'components/project-modal';
import queryString from 'query-string';

const FL = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const Relation = ({
  goCTlist,
  childRef,
  stepHelper,
  orgId,
  ctData,
  type,
  opType,
  saveLoading,
}) => {
  const [form] = Form.useForm();

  const [projectList, setProjectList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [pjtModalVsible, setPjtModalVsible] = useState(false);
  const { related_project } = queryString.parse(window.location.search);
  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    const defaultValues = {
      ...ctData[type],
      projectId: related_project ? [related_project] : [],
    };
    if (defaultValues) {
      form.setFieldsValue(defaultValues);
    }
  }, [ctData, type]);

  useEffect(() => {
    const defaultValues = ctData[type];
    if (defaultValues && projectList.length) {
      const { projectId = [] } = defaultValues;
      setIndeterminate(
        !!projectId &&
          !!projectId.length &&
          projectId.length < projectList.length,
      );
      !!projectId &&
        !!projectId.length &&
        setCheckAll(projectId.length === projectList.length);
    }
  }, [ctData, type, projectList]);

  const fetchProject = async () => {
    let res = await projectAPI.allEnableProjects({ orgId });
    if (res.code === 200) {
      setProjectList(res.result.list || []);
    } else {
      notification.error({
        message: t('define.message.getFail'),
        description: res.message,
      });
    }
  };

  useImperativeHandle(childRef, () => ({
    onFinish: async index => {
      const values = await form.validateFields();
      stepHelper.updateData({
        type,
        data: values,
      });
      stepHelper.go(index);
    },
  }));

  const onFinish = values => {
    stepHelper.updateData({
      type,
      data: values,
      isSubmit: true,
    });
  };

  const onChange = list => {
    setIndeterminate(!!list.length && list.length < projectList.length);
    setCheckAll(list.length === projectList.length);
  };

  const onCheckAllChange = e => {
    form.setFieldsValue({
      projectId: e.target.checked ? projectList.map(it => it.id) : [],
    });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const togglePjtModalVsible = () => setPjtModalVsible(!pjtModalVsible);

  const pjtOperation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: param => projectAPI.createProject(param),
      };
      let params = {
        ...payload,
      };
      const res = await method[action](params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess'),
      });
      fetchProject();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message,
      });
    }
  };

  return (
    <div className='form-wrapper' style={{ width: 824 }}>
      <Form form={form} {...FL} onFinish={onFinish}>
        <div>
          {projectList.length === 0 ? (
            <div>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <>
                    {t('define.noData')}，
                    <a onClick={togglePjtModalVsible}>
                      {t('define.project.create')}
                    </a>
                  </>
                }
              />
              {pjtModalVsible && (
                <OpModal
                  visible={pjtModalVsible}
                  orgId={orgId}
                  opt='add'
                  toggleVisible={togglePjtModalVsible}
                  operation={pjtOperation}
                />
              )}
            </div>
          ) : (
            <div>
              <Row>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  {t('define.project.selectAll')}
                </Checkbox>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
              <Form.Item name='projectId'>
                <Checkbox.Group
                  onChange={onChange}
                  initialValues={[related_project]}
                >
                  <Space direction='vertical' size={6}>
                    {projectList.map(it => (
                      <Checkbox value={it.id}>{it.name}</Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </div>
          )}
        </div>

        <div className='btn-wrapper'>
          <Space size={24}>
            {opType === 'add' ? (
              <>
                <Button
                  className='ant-btn-tertiary'
                  onClick={() => stepHelper.prev()}
                >
                  {t('define.action.prev')}
                </Button>
                <Button
                  type='primary'
                  htmlType={'submit'}
                  loading={saveLoading}
                >
                  {t('define.action.complete')}
                </Button>
              </>
            ) : (
              <>
                <Button className='ant-btn-tertiary' onClick={goCTlist}>
                  {t('define.action.cancel')}
                </Button>
                <Button
                  type='primary'
                  htmlType={'submit'}
                  loading={saveLoading}
                >
                  {t('define.action.submit')}
                </Button>
              </>
            )}
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default Relation;

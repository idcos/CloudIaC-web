import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin, Radio, Input, notification, Row, Col, Button, Form } from 'antd';
import { Eb_WP } from 'components/error-boundary';
import { chartUtils } from 'components/charts-cfg';
import projectAPI from 'services/project';
import { t } from 'utils/i18n';
import styles from './styles.less';

const FL = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 }
};

const Basic = ({ orgId, projectId, dispatch }) => {

  const [ spinning, setSpinning ] = useState(false);
  const [ projectInfo, setProjectInfo ] = useState({});
  const [form] = Form.useForm();
  let CHART = useRef([
    { key: 'project_statistics', domRef: useRef(), ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART.current);

  useEffect(() => {
    fetchProjectInfo();
    resizeHelper.attach();
    return () => resizeHelper.remove();
  }, []);

  useEffect(() => {
    form.setFieldsValue(projectInfo);
    CHART.current.forEach(chart => {
      if (chart.key === 'project_statistics') {
        chartUtils.update(chart, projectInfo);
      }
    });
  }, [projectInfo]);

  const fetchProjectInfo = async () => {
    try {
      setSpinning(true);
      const res = await projectAPI.detailProject({
        projectId, orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setProjectInfo(res.result || {});
      setSpinning(false);
    } catch (e) {
      setSpinning(false);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  // 重新刷新全局的projects
  const reloadGlobalProjects = () => {
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId
      }
    });
  };

  const onFinish = async (values) => {
    try {
      setSpinning(true);
      const res = await projectAPI.editProject({
        ...values,
        projectId, 
        orgId
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setProjectInfo(res.result || {});
      setSpinning(false);
      notification.success({
        message: t('define.message.opSuccess')
      });
      fetchProjectInfo();
      reloadGlobalProjects();
    } catch (e) {
      setSpinning(false);
      notification.error({
        message: e.message
      });
    }
  };
  
  return (
    <Spin spinning={spinning}>
      <div className={styles.basic}>
        <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={t('define.page.userSet.basic')}>
          <Form
            form={form}
            {...FL}
            onFinish={onFinish}
          >
            <Form.Item
              label={t('define.projectName')}
              name='name'
              rules={[
                {
                  required: true,
                  message: t('define.form.input.placeholder')
                }
              ]}
            >
              <Input placeholder={t('define.form.input.placeholder')} />
            </Form.Item>
            <Form.Item
              label={t('define.projectDes')}
              name='description'
              rules={[
                {
                  message: t('define.form.input.placeholder')
                }
              ]}
            >
              <Input.TextArea placeholder={t('define.form.input.placeholder')} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type='primary' htmlType={'submit'} >{t('define.action.save')}</Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

export default Eb_WP()(Basic);

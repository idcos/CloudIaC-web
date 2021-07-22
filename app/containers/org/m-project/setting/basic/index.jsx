import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin, Radio, Input, notification, Row, Col, Button, Form } from 'antd';

import { Eb_WP } from 'components/error-boundary';
import { chartUtils } from 'components/charts-cfg';
import { pjtAPI } from 'services/base';

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
    { key: 'project_statistics', domRef: useRef(), des: '环境状态占比', ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART);

  useEffect(() => {
    fetchProjectInfo();
    resizeHelper.attach();
    return resizeHelper.remove();
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
      const res = await pjtAPI.detailProject({
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
        message: '获取失败',
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
      const res = await pjtAPI.editProject({
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
        message: '修改信息成功'
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
        <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} title={'基础信息'}>
          <Form
            form={form}
            {...FL}
            onFinish={onFinish}
          >
            <Form.Item
              label='项目名称'
              name='name'
              rules={[
                {
                  required: true,
                  message: '请输入'
                }
              ]}
            >
              <Input placeholder='请输入云模板名称' />
            </Form.Item>
            <Form.Item
              label='项目描述'
              name='description'
              rules={[
                {
                  message: '请输入'
                }
              ]}
            >
              <Input.TextArea placeholder='请输入描述' />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button type='primary' htmlType={'submit'} >保存</Button>
            </Form.Item>
          </Form>
        </Card>
        <Card title={'项目统计'} headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} style={{ marginTop: 24 }}>
          <Row style={{ display: 'flex', justifyContent: 'center', padding: '0px 72px' }}>
            {CHART.current.map(chart => <Col span={18}>
              <div className='chartPanel' style={{ position: 'relative' }}>
                <h2 style={{ position: 'absolute', top: 65, left: 18 }}>云模板数量
                  <h1 style={{ display: 'flex' }}>{projectInfo.tplCount || 0}</h1>
                </h2>
                <div ref={chart.domRef} className='chartEle'></div>
              </div>
            </Col>)}
          </Row>
        </Card>
      </div>
    </Spin>
  );
};

export default Eb_WP()(Basic);

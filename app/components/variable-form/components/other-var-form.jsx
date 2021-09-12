import React, { useEffect, useState } from 'react';
import { Row, Col, Collapse, Form, Select, notification } from 'antd';
import vcsAPI from 'services/vcs';

const { Option } = Select;

const OtherVarForm = (props) => {

  const { otherVarForm, fetchParams, defaultExpandCollapse = true } = props;
  const [ tfvars, setTfvars ] = useState([]);
  const [ playbooks, setPlaybooks ] = useState([]);

  useEffect(() => {
    if (fetchParams) {
      fetchTfvars();
      fetchPlaybooks();
    }
  }, [fetchParams]);

  const fetchTfvars = async () => {
    const { orgId, repoRevision, repoId, repoType, vcsId } = fetchParams;
    const params = { orgId, repoRevision, repoId, repoType, vcsId };
    try {
      const res = await vcsAPI.listTfvars(params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setTfvars(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const fetchPlaybooks = async () => {
    const { orgId, repoRevision, repoId, repoType, vcsId } = fetchParams;
    const params = { orgId, repoRevision, repoId, repoType, vcsId };
    try {
      const res = await vcsAPI.listPlaybook(params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setPlaybooks(res.result || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  return (
    <Collapse defaultActiveKey={defaultExpandCollapse && 'open'} expandIconPosition={'right'}>
      <Collapse.Panel key='open' header='其它变量' forceRender={true}>
        <Form form={otherVarForm}>
          <Row gutter={8}>
            <Col span={11}>
              <Form.Item
                name='tfVarsFile'
                label='tfvars文件'
                rules={[
                  {
                    required: false,
                    message: '请选择'
                  }
                ]}
              >
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentNode} 
                  allowClear={true} 
                  placeholder='请选择tfvars文件'
                >
                  {tfvars.map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={11} offset={2}>
              <Form.Item
                name='playbook'
                label='playbook文件'
                rules={[
                  {
                    required: false,
                    message: '请选择'
                  }
                ]}
              >
                <Select 
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  allowClear={true} 
                  placeholder='请选择playbook文件'
                >
                  {playbooks.map(it => <Option value={it}>{it}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};

export default OtherVarForm;
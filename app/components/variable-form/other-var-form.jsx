import React, { useEffect, useState } from 'react';
import { Row, Col, Collapse, Form, Select, notification } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import vcsAPI from 'services/vcs';
import keysAPI from 'services/keys';
import { t } from 'utils/i18n';

const { Option } = Select;

const OtherVarForm = props => {
  const { otherVarForm, fetchParams, defaultExpandCollapse = true } = props;
  const [tfvars, setTfvars] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);

  useEffect(() => {
    if (fetchParams) {
      fetchTfvars();
      fetchPlaybooks();
    }
  }, [fetchParams]);

  // ssh key选项列表
  const { data: keyOptions = [] } = useRequest(
    () =>
      requestWrapper(
        keysAPI.list.bind(null, {
          pageSize: 0,
        }),
      ),
    {
      formatResult: data =>
        (data.list || []).map(it => ({ label: it.name, value: it.id })),
    },
  );

  const fetchTfvars = async () => {
    const { orgId, repoRevision, repoId, repoType, vcsId, workdir } =
      fetchParams;
    const params = { orgId, repoRevision, repoId, repoType, vcsId, workdir };
    try {
      const res = await vcsAPI.listTfvars(params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setTfvars(res.result || []);
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  const fetchPlaybooks = async () => {
    const { orgId, repoRevision, repoId, repoType, vcsId, workdir } =
      fetchParams;
    const params = { orgId, repoRevision, repoId, repoType, vcsId, workdir };
    try {
      const res = await vcsAPI.listPlaybook(params);
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setPlaybooks(res.result || []);
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  return (
    <Collapse
      defaultActiveKey={defaultExpandCollapse && 'open'}
      expandIconPosition={'right'}
    >
      <Collapse.Panel
        key='open'
        header={t('define.varType.other')}
        forceRender={true}
      >
        <Form form={otherVarForm} style={{ margin: '0 8px' }}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='tfVarsFile'
                label={t('define.variable.tfVarsFile')}
                rules={[
                  {
                    required: false,
                    message: t('define.form.select.placeholder'),
                  },
                ]}
              >
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  allowClear={true}
                  placeholder={t('define.form.select.placeholder')}
                >
                  {tfvars.map(it => (
                    <Option value={it}>{it}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='playbook'
                label={t('define.variable.playbook')}
                rules={[
                  {
                    required: false,
                    message: t('define.form.select.placeholder'),
                  },
                ]}
              >
                <Select
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                  allowClear={true}
                  placeholder={t('define.form.select.placeholder')}
                >
                  {playbooks.map(it => (
                    <Option value={it}>{it}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name='keyId'
                label={t('define.ssh')}
                rules={[
                  {
                    required: false,
                    message: t('define.form.select.placeholder'),
                  },
                ]}
              >
                <Select
                  allowClear={true}
                  placeholder={t('define.form.select.placeholder')}
                  options={keyOptions}
                  optionFilterProp='label'
                  showSearch={true}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Collapse.Panel>
    </Collapse>
  );
};

export default OtherVarForm;

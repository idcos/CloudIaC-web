import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, Empty, notification, Row, Col } from "antd";

import { ctAPI } from 'services/base';
import vcsAPI from 'services/vcs';

import history from 'utils/history';
import OpModal from 'components/vcs-modal';

const FL = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 }
};
const { Option } = Select;

export default ({ stepHelper, orgId }) => {

  const [form] = Form.useForm();

  const [ repoBranches, setRepoBranches ] = useState([]),
    [ vcsList, setVcsList ] = useState([]),
    [ vcsVisible, setVcsVisible ] = useState(false),
    [ submitLoading, setSubmitLoading ] = useState(false);
  
  useEffect(() => {
    fetchRepoBranch();
    // fetchVcsList();
  }, []);

  const fetchVcsList = async () => {
    try {
      const res = await vcsAPI.searchVcs({
        orgId,
        status: 'enable',
        currentPage: 1,
        pageSize: 100000
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setVcsList(res.result.list || []);
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const vcsOperation = async ({ doWhat, payload }, cb) => {
    try {
      const method = {
        add: (param) => vcsAPI.createVcs(param)
      };
      const res = await method[doWhat]({
        orgId,
        ...payload
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: '操作成功'
      });
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: '操作失败',
        description: e.message
      });
    }
  };

  const fetchRepoBranch = async () => {
    try {
      const res = await ctAPI.listRepoBranch({
        repoId: 1,
        orgId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setRepoBranches(res.result || []);
    } catch (e) {
      console.log(e);
      notification.error({
        message: '获取仓库分支失败',
        description: e.message
      });
    }
  };

  const onFinish = async (values) => {
    // 
  };

  const opVcsModal = () => {
    setVcsVisible(true);
  };
  const clVcsModal = () => {
    setVcsVisible(false);
  };
  const notFoundRender = () => {
    return <span>
      暂无数据， <a onClick={opVcsModal}>创建VCS</a>
    </span>;
  };

  return <div className='form-wrapper'>
    <Form
      form={form}
      {...FL}
      onFinish={onFinish}
    >
      <Form.Item
        label='vcs'
        name='vcsId'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择vcs'
          notFoundContent={<Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            imageStyle={{
              height: 60
            }}
            description={
              notFoundRender()
            }
          >
          </Empty>}
        >
          {vcsList.map(it => <Option value={it.id}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='仓库名称'
        name='repoBranch'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择分支'
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='分支/标签'
        name='gitbranch'
        rules={[
          {
            required: true,
            message: '请选择'
          }
        ]}
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择分支'
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item
        label='工作目录'
        name='work'
      >
        <Select 
          getPopupContainer={triggerNode => triggerNode.parentNode}
          placeholder='请选择分支'
        >
          {repoBranches.map(it => <Option value={it.name}>{it.name}</Option>)}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 5, span: 14 }}>
        <Button onClick={() => stepHelper.prev()} style={{ marginRight: 24 }}>上一步</Button>
        <Button type='primary' onClick={() => stepHelper.next()}>下一步</Button>
      </Form.Item>
    </Form>
    {
      vcsVisible && <OpModal
        visible={vcsVisible}
        toggleVisible={clVcsModal}
        opt={'add'}
        reload={fetchRepoBranch}
        operation={vcsOperation}
      />
    }
  </div>;
};

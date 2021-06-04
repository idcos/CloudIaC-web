import React, { useState, useCallback } from "react";
import {
  Card,
  Menu,
  notification
} from "antd";

import { ctAPI } from "services/base";

import BasicInfo from './components/basic-info';
import RepoInfo from './components/repo-info';
import OperationAuthority from './components/operation-authority';
import Webhook from './components/webhook';
import DestroyResources from './components/destroy-resources';

const subNavs = {
  basic: "基本信息",
  repo: "仓库信息",
  operationAuthority: "操作权限",
  webhook: '触发器',
  destroyResources: '销毁资源'
};

const Setting = (props) => {
  const { routesParams, location } = props;
  const { curOrg, ctId, detailInfo, ctRunnerList, reload, linkToRunningDetail } = routesParams;
  const { initSettingPanel } = location.state || {};
  const [ panel, setPanel ] = useState(initSettingPanel || "basic");
  const [ submitLoading, setSubmitLoading ] = useState(false);
  
  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      const { defaultRunnerServiceId, ...restValues } = values;
      const ctInfo =
        ctRunnerList.find((it) => it.ID == defaultRunnerServiceId) || {};
      const { Port, Address } = ctInfo;
      const res = await ctAPI.edit({
        ...restValues,
        orgId: curOrg.id,
        id: ctId - 0,
        defaultRunnerServiceId,
        defaultRunnerAddr: Address,
        defaultRunnerPort: Port
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setSubmitLoading(false);
      notification.success({
        message: "操作成功"
      });
      reload();
    } catch (e) {
      setSubmitLoading(false);
      notification.error({
        message: e.message
      });
    }
  };

  const renderByPanel = useCallback(() => {
    const panelProps = {
      orgId: curOrg.id,
      ctId,
      submitLoading,
      ctRunnerList,
      detailInfo,
      linkToRunningDetail,
      onFinish
    };
    const PAGES = {
      basic: <BasicInfo {...panelProps} />,
      repo: <RepoInfo {...panelProps}/>,
      operationAuthority: <OperationAuthority {...panelProps}/>,
      webhook: <Webhook {...panelProps}/>,
      destroyResources: <DestroyResources {...panelProps}/>
    };
    return PAGES[panel];
  }, [ panel, detailInfo, ctRunnerList, submitLoading ]);

  return (
    <div className='setting'>
      <Menu
        mode='inline'
        className='subNav'
        selectedKeys={[panel]}
        onClick={({ item, key }) => {
          setPanel(key);
        }}
      >
        {Object.keys(subNavs).map((it) => (
          <Menu.Item key={it}>{subNavs[it]}</Menu.Item>
        ))}
      </Menu>
      <div className='rightPanel'>
        <Card title={subNavs[panel]}>
          <div className='form-wrapper'>
            {renderByPanel()}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Setting;

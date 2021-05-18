import React, { useState, useEffect } from "react";
import {
  Button,
  notification,
  Tabs,
  Dropdown,
  Menu,
  Popover,
  Tag,
  Alert
} from "antd";
import history from "utils/history";
import PageHeader from "components/pageHeader";
import { Eb_WP } from "components/error-boundary";
import Layout from "components/common/layout";
import RoutesList from "components/routes-list";
import styles from "./styles.less";
import CreateTaskForm from "./detailPages/components/createTaskForm/index";
import { DownOutlined } from "@ant-design/icons";
import { ctAPI, sysAPI } from "services/base";
import { CT } from "constants/types";

const subNavs = {
  overview: "概览",
  running: "运行",
  state: "状态",
  variable: "变量",
  setting: "设置"
};

const CloudTmpDetail = (props) => {
  const { match, routesParams, routes, location } = props,
    { ctId, orgId: orgGuid, ctDetailTabKey } = match.params,
    { cacheDetailInfo } = location.state || {},
    baseUrl = `/org/${orgGuid}/ct/${ctId}`;

  const [ popOverVisible, setPopoverVisible ] = useState(false),
    [ taskType, setTaskType ] = useState(null),
    [ ctRunnerList, setCtRunnerList ] = useState([]),
    [ detailInfo, setDetailInfo ] = useState(cacheDetailInfo || {});

  useEffect(() => {
    // if (!cacheDetailInfo) {
    fetchDetailInfo();
    fetchCTRunner();
    // }
  }, []);

  const changeTab = (key, cacheData) => {
    linkTo(`${baseUrl}/${key}`, cacheData);
  };

  // 去运行详情页面
  const linkToRunningDetail = (taskId) => {
    linkTo(`${baseUrl}/running/runningDetail/${taskId}`);
  };

  /**
   * @param {string} url 跳转的url地址
   * @param {Object} cacheData 需要缓存的数据
   */
  const linkTo = (url, cacheData = {}) => {
    const baseCacheState = { cacheDetailInfo: detailInfo };
    const cacheState = { ...baseCacheState, ...cacheData };
    history.push(url, cacheState);
  };

  const fetchDetailInfo = async () => {
    try {
      const res = await ctAPI.detail({
        id: ctId,
        orgId: routesParams.curOrg.id
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setDetailInfo(res.result || {});
    } catch (e) {
      notification.error({
        message: e.message
      });
    }
  };

  const fetchCTRunner = async () => {
    try {
      const res = await sysAPI.listCTRunner({ orgId: routesParams.curOrg.id });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setCtRunnerList(res.result || []);
     
    } catch (e) {
      notification.error({
        message: '获取失败',
        description: e.message
      });
    }
  };

  const toggleVisible = ({ taskType = null, visible }) => {
    setPopoverVisible(visible);
    setTaskType(taskType);
  };

  const closePopover = () => toggleVisible({ taskType: null, visible: false });

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={detailInfo.name || "-"}
          breadcrumb={true}
          des={
            <>
              {detailInfo.status == "disable" && <Tag color='red'>已禁用</Tag>}{" "}
              {detailInfo.description}{" "}
            </>
          }
          renderFooter={() => (
            <Tabs
              animated={false}
              tabBarExtraContent={
                <Dropdown
                  disabled={detailInfo.status === "disable"}
                  overlay={
                    <Menu
                      onClick={({ key }) =>
                        toggleVisible({ taskType: key, visible: true })
                      }
                    >
                      {Object.keys(CT.taskType).map((it) => (
                        <Menu.Item key={it}>新建{CT.taskType[it]}</Menu.Item>
                      ))}
                    </Menu>
                  }
                >
                  <Popover
                    placement='bottomRight'
                    content={
                      popOverVisible && (
                        <CreateTaskForm
                          linkToRunningDetail={linkToRunningDetail}
                          closePopover={closePopover}
                          taskType={taskType}
                          orgId={routesParams.curOrg.id}
                          ctRunnerList={ctRunnerList}
                          ctDetailInfo={detailInfo}
                        />
                      )
                    }
                    visible={popOverVisible}
                    trigger={"click"}
                    onMouseLeave={closePopover}
                    overlayStyle={{ width: 500 }}
                    onVisibleChange={closePopover}
                  >
                    <Button disabled={detailInfo.status === "disable"} type='primary' icon={<DownOutlined />}>
                      新建作业
                    </Button>
                  </Popover>
                </Dropdown>
              }
              renderTabBar={(props, DefaultTabBar) => {
                return (
                  <div style={{ marginBottom: -16 }}>
                    <DefaultTabBar {...props} />
                  </div>
                );
              }}
              activeKey={ctDetailTabKey}
              onChange={(k) => changeTab(k)}
            >
              {Object.keys(subNavs).map((it) => (
                <Tabs.TabPane
                  tab={subNavs[it]}
                  key={it}
                  disabled={it == "state" && !detailInfo.saveState}
                />
              ))}
            </Tabs>
          )}
        />
      }
    >
      <div className='container-inner-width'>
        {detailInfo.status == "disable" && (
          <Alert
            message={
              <>
                当前云模板为禁用状态，仅能正常访问云模板数据，不可发起作业、修改变量等操作
                <Button
                  type='link'
                  size='small'
                  onClick={() => {
                    changeTab("setting", { initSettingPanel: "del" });
                  }}
                >
                  去修改状态
                </Button>
              </>
            }
            showIcon={true}
            type='warning'
            banner={true}
          />
        )}
        <div className={styles.ctDetail}>
          <RoutesList
            routes={routes}
            routesParams={{
              curOrg: routesParams.curOrg,
              ctId,
              detailInfo,
              ctRunnerList,
              changeTab,
              linkToRunningDetail,
              reload: fetchDetailInfo
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Eb_WP()(CloudTmpDetail);

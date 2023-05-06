import React, { useState, useEffect, useCallback } from 'react';
import { List, notification, Collapse, Spin, Alert } from 'antd';
import {
  CheckCircleFilled,
  GlobalOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import sysAPI from 'services/sys';
import Tags from 'components/tags';
import { SYS } from 'constants/types';
import { statusTextCls } from 'utils/util';
import { t } from 'utils/i18n';
import getPermission from 'utils/permission';
import styles from './styles.less';

const { Panel } = Collapse;
const statusIcons = {
  passing: <CheckCircleFilled />,
};
const MsgEnums = {
  passing: 'success',
};

const SysStatus = ({ userInfo }) => {
  const { SYS_OPERATOR } = getPermission(userInfo);
  const [loading, setLoading] = useState(false);
  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async needLoading => {
    try {
      needLoading && setLoading(true);
      const res = await sysAPI.sysStatus();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const sortResultList = (res.result || []).sort((a, b) => {
        const sortRuleList = [
          /** 其它系统状态的service... */ 'IaC-Portal',
          'CT-Runner',
        ]; // index越大排序权重越高
        return (
          sortRuleList.indexOf(b.service) - sortRuleList.indexOf(a.service)
        );
      });
      setResultList(sortResultList);
      needLoading && setLoading(false);
    } catch (e) {
      needLoading && setLoading(false);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  const updateTag = async ({ tags, serviceId }) => {
    try {
      const res = await sysAPI.updateTags({ tags, serviceId });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      fetchList();
    } catch (e) {
      notification.error({
        message: t('define.message.opFail'),
        description: e.message,
      });
    }
  };

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={t('define.page.sysStatus.title')}
          breadcrumb={false}
        />
      }
    >
      <div className='idcos-card'>
        {loading ? (
          <Spin />
        ) : (
          <div className={styles.status}>
            {resultList.map(it => {
              return (
                <Collapse
                  defaultActiveKey={['defaultOpen']}
                  className='collapse-panel'
                >
                  <Panel header={it.service} key='defaultOpen'>
                    <List
                      itemLayout='horizontal'
                      dataSource={it.Children}
                      renderItem={item => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <p className='list-title reset-styles'>
                                <span>{item.ID}</span>
                                <span>
                                  <GlobalOutlined /> {item.address}
                                </span>
                              </p>
                            }
                            description={
                              <>
                                <p className='tags reset-styles'>
                                  <Tags
                                    data={item.tags}
                                    canEdit={
                                      SYS_OPERATOR && it.service === 'CT-Runner'
                                    }
                                    update={newTags => {
                                      updateTag({
                                        tags: newTags,
                                        serviceId: item.ID,
                                      });
                                    }}
                                  />
                                </p>
                                {item.output ? (
                                  <AlertMsg
                                    message={item.output}
                                    type={item.status}
                                  />
                                ) : null}
                              </>
                            }
                          />
                          <p className='tableRender reset-styles'>
                            <span
                              className={`status-text ${
                                statusTextCls(item.status).cls
                              }`}
                            >
                              {statusIcons[item.status]}{' '}
                              <span>{SYS.status[item.status]}</span>
                            </span>
                          </p>
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

const AlertMsg = ({ type, message }) => {
  const [collapse, setCollapse] = useState(true);
  const renderMsg = useCallback(() => {
    const maxMsgLength = 140,
      trigger = (
        <span className='msg-trigger' onClick={() => setCollapse(!collapse)}>
          {collapse ? <DownOutlined /> : <UpOutlined />}
        </span>
      );
    const collapsed = msg => (collapse ? msg.slice(0, maxMsgLength) : msg);
    const max = msg => {
      const exceed = msg.length > maxMsgLength;
      return exceed ? (
        <>
          {collapsed(msg)} {trigger}
        </>
      ) : (
        message
      );
    };
    return max(message);
  }, [message, collapse]);
  return (
    <Alert
      className='alert'
      showIcon={true}
      type={MsgEnums[type]}
      message={renderMsg()}
      closable={true}
    />
  );
};

AlertMsg.defaultProps = {
  type: 'success',
  message: '-',
};

export default Eb_WP()(
  connect(state => {
    return {
      userInfo: state['global'].get('userInfo').toJS(),
    };
  })(SysStatus),
);

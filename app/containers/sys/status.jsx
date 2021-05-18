import React, { useState, useEffect, useCallback } from 'react';
import { List, notification, Collapse, Spin, Alert } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import { sysAPI } from 'services/base';

import Tags from 'components/tags';

import styles from './styles.less';

import { SYS } from 'constants/types';
import { statusTextCls } from 'utils/util';

import { CheckCircleFilled, GlobalOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

const { Panel } = Collapse;


const statusIcons = {
  passing: <CheckCircleFilled/>
};

const MsgEnums = {
  passing: 'success'
};

const SysStatus = (props) => {
  const [ loading, setLoading ] = useState(false),
    [ resultList, setResultList ] = useState([]);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async (needLoading) => {
    try {
      needLoading && setLoading(true);
      const res = await sysAPI.sysStatus();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const sortResultList = (res.result || []).sort((a, b) => {
        const sortRuleList = [/** 其它系统状态的service... */ 'IaC-Portal', 'CT-Runner' ]; // index越大排序权重越高
        return sortRuleList.indexOf(b.service) - sortRuleList.indexOf(a.service);
      });
      setResultList(sortResultList);
      needLoading && setLoading(false);
    } catch (e) {
      needLoading && setLoading(false);
      notification.error({
        message: '获取失败',
        description: e.message
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
        message: '操作失败',
        description: e.message
      });
    }
  };

  return <Layout
    extraHeader={<PageHeader
      title='系统状态'
      breadcrumb={false}
    />}
  >
    <div className='container-inner-width'>
      {
        loading ? <Spin/> : <div className={styles.status}>
          {
            resultList.map(it => {
              return <Collapse defaultActiveKey={['defaultOpen']} className='collapse-panel'>
                <Panel header={it.service} key='defaultOpen'>
                  <List
                    itemLayout='horizontal'
                    dataSource={it.Children}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <p className='list-title'>
                              <span>{item.ID}</span>
                              <span><GlobalOutlined/> {item.address}</span>
                            </p>
                          }
                          description={
                            <>
                              <p className='tags'>
                                <Tags data={item.tags} canEdit={it.service === 'CT-Runner'} 
                                  update={(newTags) => {
                                    updateTag({ tags: newTags, serviceId: item.ID });
                                  }}
                                />
                              </p>
                              {item.output ? <AlertMsg message={item.output} type={item.status}/> : null}
                            </>
                          }
                        />
                        <p className='tableRender'>
                          <span className={`status-text ${statusTextCls(item.status).cls}`}>{statusIcons[item.status]} <span>{SYS.status[item.status]}</span></span>
                        </p>
                      </List.Item>
                    )}
                  />
                </Panel>
              </Collapse>;
            })
          }
        </div>
      }
    </div>
  </Layout>;
};

const AlertMsg = ({ type, message }) => {
  const [ collapse, setCollapse ] = useState(true);
  const renderMsg = useCallback(() => {
    const maxMsgLength = 140,
      trigger = <span className='msg-trigger' onClick={() => setCollapse(!collapse)}>{collapse ? <DownOutlined /> : <UpOutlined />}</span>;
    const collapsed = (msg) => collapse ? msg.slice(0, maxMsgLength) : msg;
    const max = (msg) => {
      const exceed = msg.length > maxMsgLength;
      return exceed ? <>{collapsed(msg)} {trigger}</> : message;
    };
    return max(message);
  }, [ message, collapse ]);
  return <Alert
    className='alert'
    showIcon={true}
    type={MsgEnums[type]}
    message={renderMsg()}
    closable={true}
  />;
};


AlertMsg.defaultProps = {
  type: 'success',
  message: '-'
};

export default Eb_WP()(SysStatus);

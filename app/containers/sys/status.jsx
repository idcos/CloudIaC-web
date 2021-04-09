import React, { useState, useEffect, useCallback } from 'react';
import { List, notification, Tag, Collapse, Spin, Alert } from 'antd';

import PageHeader from 'components/pageHeader';
import { Eb_WP } from 'components/error-boundary';
import Layout from 'components/common/layout';
import { sysAPI } from 'services/base';

import styles from './styles.less';

import { SYS } from 'constants/types';

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

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await sysAPI.sysStatus();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      setResultList(res.result || []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: '获取失败',
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
              return <Collapse className='collapse-panel'>
                <Panel header={it.service}>
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
                              <p className='tags'>{item.tags.map(tag => <Tag>{tag}</Tag>)}</p>
                              <AlertMsg message={item.outpu} type={item.status}/>
                            </>
                          }
                        />
                        <p className={`status-tip ${item.status}`}>
                          {statusIcons[item.status]} <span>{SYS.status[item.status]}</span>
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

import React, { useState, useEffect, useRef } from 'react';
import { Select, Row, Col, Empty, List, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import { chartUtils } from 'components/charts-cfg';
import classNames from 'classnames';
import { getStat, getProviderEnv, getProviderResource, getProviderType, getProviderWeek, getProviderActive, getoPerationLog } from 'services/platform';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { t } from 'utils/i18n';
import { connect } from 'react-redux';
import styles from './styles.less';
import { ENV_STATUS } from 'constants/types';
import EllipsisText from 'components/EllipsisText';
import moment from 'moment';

const KEY = 'global';

const overview = ({ curOrg, orgs }) => {

  const TYPE_MAP = {
    envCount: '环境',
    orgCount: '组织',
    projectCount: '项目',
    stackCount: 'Stack',
    userCount: '用户'
  };

  const platform_prvider_env_count_hold = useRef();
  const platform_prvider_resource_count_hold = useRef();
  const platform_prvider_resource_type_hold = useRef();
  const platform_resource_change_trend = useRef();
  const platform_number_of_active_resources = useRef();
  const [ logData, setLogData ] = useState([]);
  
  const [ selectedOrganization, setSelectedOrganization ] = useState([]);
  const [ statisticsCount, setStatisticsCount ] = useState(0);
  const [ fetchCount, setFetchCount ] = useState(0);
  const [ data, setData ] = useState({});

  const onChangeSelectedOrg = (v) => {
    setSelectedOrganization(v);
    setStatisticsCount(preValue => preValue + 1);
  };

  let CHART = useRef([
    { key: 'platform_prvider_env_count_hold', domRef: platform_prvider_env_count_hold, ins: null },
    { key: 'platform_prvider_resource_count_hold', domRef: platform_prvider_resource_count_hold, ins: null },
    { key: 'platform_prvider_resource_type_hold', domRef: platform_prvider_resource_type_hold, ins: null },
    { key: 'platform_resource_change_trend', domRef: platform_resource_change_trend, ins: null },
    { key: 'platform_number_of_active_resources', domRef: platform_number_of_active_resources, ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART.current);

  const fetchDetail = async() => {
    const detailData = await Promise.all([ getStat(selectedOrganization.join(',')), getProviderEnv(selectedOrganization.join(',')), getProviderResource(selectedOrganization.join(',')), getProviderType(selectedOrganization.join(',')), getProviderWeek(selectedOrganization.join(',')), getProviderActive(selectedOrganization.join(',')) ]);
    const list = [ 'stat', 'providerEnv', 'providerResource', 'providerType', 'providerWeek', 'providerActive' ];
    let obj = {};
    detailData.map((item, index) => {
      obj[list[index]] = item['result'];
    });
    setData(obj || {});
    setFetchCount(preValue => preValue + 1);
  };

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'platform_prvider_env_count_hold') {
        chartUtils.update(chart, data.providerEnv || []);
      }
      if (chart.key === 'platform_prvider_resource_count_hold') {
        chartUtils.update(chart, data.providerResource || []);
      }
      if (chart.key === 'platform_prvider_resource_type_hold') {
        chartUtils.update(chart, data.providerType || []);
      }
      if (chart.key === 'platform_resource_change_trend') {
        chartUtils.update(chart, data.providerWeek);
      }
      if (chart.key === 'platform_number_of_active_resources') {
        chartUtils.update(chart, data.providerActive);
      }
    });
  }, [fetchCount]);

  useEffect(() => {
    fetchDetail();
  }, [selectedOrganization]);

  useEffect(() => {
    resizeHelper.attach();
    return () => {
      resizeHelper.remove();
    };
  }, []);

  const getLog = async() => {
    let res = await getoPerationLog();
    setLogData(res.result || []);
  };

  useEffect(() => {
    getLog();
  }, []);

  const OBJ_TYPE = {
    user: { login: "登陆平台" }
  };

  return (
    <div className={styles.overview}>
      <div className={styles.overview_left}>
        <div className={styles.select}>
          {t('define.page.platform_overview.title')}
          <Select
            placeholder={t('define.page.selectOrganization.title')}
            mode='multiple'
            maxTagCount={3}
            allowClear={true}
            
            maxTagTextLength={10}
            style={{ minWidth: 173, marginTop: 16, paddingLeft: 16 }}
            value={selectedOrganization}
            suffixIcon={<FileTextOutlined />}
            onChange={(v) => {
              onChangeSelectedOrg(v);
            }}
            options={
              (orgs.list || []).map((val) => {
                return { label: val.name, value: val.id };
              })
            }
          >
          </Select>
        </div>
        <div>
          <Row style={{ padding: '13.5px 10.5px', justifyContent: 'space-between' }} gutter={[ 21, 27 ]}>
            {
              Object.keys(data.stat || {}).map(item => {
                return (
                  <div className={styles.statisticsCard}>
                    <div className={styles.statisticsTop}>
                      <span>{TYPE_MAP[item]}</span>
                    </div>
                    <div className={styles.statisticsBottom}>
                      <div>
                        <span>总数</span>
                        <span>{((data.stat || {})[item] || {}).total}  <span>/</span></span>
                      </div>  <div>
                        <span>活跃</span>
                        <span>{((data.stat || {})[item] || {}).active}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </Row>
          <Row gutter={[ 21, 27 ]}>
            <Col span={8}>
              <div className={styles.env_state}>
                {/* <h3>{t('define.charts.platform_prvider_env_count_hold')}</h3> */}
                <div className={classNames(styles.content)}>
                  <div>
                    <span className={styles.content_title}>{t('define.charts.platform_prvider_env_count_hold')}</span>
                    <>
                      {isEmpty(data.providerEnv) ? (
                        <Empty 
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          style={{ 
                            width: '100%',
                            top: '150px',
                            left: 0,
                            zIndex: 100,
                            position: 'absolute' 
                          }}
                        />
                      ) : (
                        <></>
                      )}
                      <div ref={platform_prvider_env_count_hold} style={{ width: '100%', height: 214 }}></div>
                    </>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.env_state}>
                {/* <h3>{t('define.charts.platform_prvider_resource_count_hold')}</h3> */}
                <div className={classNames(styles.content)}>
                  <div>
                    <span className={styles.content_title}>{t('define.charts.platform_prvider_resource_count_hold')}</span>
                    <>
                      {isEmpty(data.providerResource) ? (
                        <Empty 
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          style={{ 
                            width: '100%',
                            top: '150px',
                            left: 0,
                            zIndex: 100,
                            position: 'absolute' 
                          }}
                        />
                      ) : (
                        <></>
                      )}
                      <div ref={platform_prvider_resource_count_hold} style={{ width: '100%', height: 214 }}></div>
                    </>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.resource_type}>
                {/* <h3>{t('define.charts.platform_prvider_resource_type_hold')}</h3> */}
                <div className={classNames(styles.content)}>
                  <div>
                    <span className={styles.content_title}>{t('define.charts.platform_prvider_resource_type_hold')}</span>
                    <>
                      {isEmpty(data.providerType) ? (
                        <Empty 
                          image={Empty.PRESENTED_IMAGE_SIMPLE} 
                          style={{ 
                            width: '100%',
                            top: '150px',
                            zIndex: '100',
                            position: 'absolute',
                            left: 0
                          }}
                        />
                      ) : (
                        <>
                        </>
                      )}
                      <div ref={platform_prvider_resource_type_hold} style={{ width: '100%', height: 214 }}></div>
                    </>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[ 21, 27 ]}>
            <Col span={12}>
              <div className={styles.pro_resource}>
                <div className={classNames(styles.content)}>
                  <span className={styles.content_title} style={{ marginLeft: 20 }}>{t('define.page.platform_resource_change_trend')}</span>
                  <div style={{ width: '100%', height: "100%" }}>
                    {isEmpty(data.providerWeek) ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 90 }}/>
                    ) : (
                      <div ref={platform_resource_change_trend} style={{ width: '100%', height: "100%" }}></div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.resource_tendency}>
                <div className={classNames(styles.content)}>
                  <span className={styles.content_title} style={{ marginLeft: 20 }}>{t('define.page.platform_number_of_active_resources')}</span>
                  <div style={{ width: '100%', height: "100%" }}>
                    {isEmpty(data.providerActive) ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 90 }}/>
                    ) : (
                      <div ref={platform_number_of_active_resources} style={{ width: '100%', height: "100%" }}></div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div className={styles.overview_right} style={{ flex: "0 0 280px" }}>
        <div className={styles.tableWrapper}>
          {/* <h2>{t('define.page.overview.dynamic')}</h2> */}
          <div className={styles.listInfo}>
            <List
              header={false}
              footer={false}
              dataSource={logData}
              renderItem={item => (
                <List.Item className={styles.listbody}>
                  <div className={styles.dynamicTitle}>
                    <span>{item.operatorName}: </span>
                    <EllipsisText style={{ maxWidth: 200, paddingLeft: 8 }}>{OBJ_TYPE[item.objectType][item.action] || '-'}</EllipsisText>
                  </div>
                  <div className={styles.orgInfo}><span>{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span> <span>{item.objectName}</span> </div>

                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({ 
    curOrg: state[KEY].get('curOrg'),
    orgs: state.global.get('orgs').toJS()
  })
)(overview);
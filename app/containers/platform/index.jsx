import React, { useState, useEffect, useRef } from 'react';
import { Select, Row, Col, Empty, List, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import isEmpty from 'lodash/isEmpty';
import { chartUtils } from 'components/charts-cfg';
import classNames from 'classnames';
import orgsAPI from 'services/orgs';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { t } from 'utils/i18n';
import { connect } from 'react-redux';
import styles from './styles.less';
import { ENV_STATUS } from 'constants/types';
import EllipsisText from 'components/EllipsisText';

const KEY = 'global';

const overview = ({ curOrg, projects }) => {

  const platform_prvider_env_count_hold = useRef();
  const platform_prvider_resource_count_hold = useRef();
  const platform_prvider_resource_type_hold = useRef();
  const platform_resource_change_trend = useRef();
  const platform_number_of_active_resources = useRef();
  
  const [ selectedProjectIds, setSelectedProjectIds ] = useState([]);
  const [ statisticsCount, setStatisticsCount ] = useState(0);
  const [ fetchCount, setFetchCount ] = useState(0);
  const [ envStatTopData, setEnvStatTopData ] = useState([]);
  const [ resStatTopData, setResStatTopData ] = useState([]);
  const [ resStatTotal, setResStatTotal ] = useState(1);
  const [ envStatTotal, setEnvStatTotal ] = useState(1);

  const {
    data = {
      envStat: [],
      resStat: [],
      projectResStat: {
        series_list: [],
        dataList: []
      },
      resGrowTrend: []
    },
    run: startStatistics
  } = useRequest(
    () => requestWrapper(
      orgsAPI.orgStatistics.bind(null, { curOrg, projectIds: selectedProjectIds })
    ), {
      manual: true,
      formatResult: data => {
        const { envStat, resStat, projectResStat, resGrowTrend } = data || {};
        return {
          envStat: envStat || [], 
          resStat: resStat || [], 
          projectResStat: formatResStat(projectResStat) || {}, 
          resGrowTrend: resGrowTrend || []
        };
      },
      onSuccess: ({ envStat, resStat }) => {
        setEnvStatTopData(sortBy(envStat, item => -item.count).slice(0, 2));
        setResStatTopData(sortBy(resStat, item => -item.count).slice(0, 2));
        setEnvStatTotal(reduce(envStat, function(sum, item) {
          return sum + item.count;
        }, 0));
        setResStatTotal(reduce(resStat, function(sum, item) {
          return sum + item.count;
        }, 0));
        setFetchCount(preValue => preValue + 1);
      }
    }
  );
  const onChangeSelectedPrpo = (v) => {
    setSelectedProjectIds(v);
    setStatisticsCount(preValue => preValue + 1);
  };
  const formatResStat = (data = []) => {
    let series_list = [];
    if (data.length) {
      series_list = data[0].details.map((item) => item.name);
    }
    for (let i = 0; i < data.length; i++) {
      data[i].detailsMap = {};
      data[i].details.forEach((item) => {
        data[i].detailsMap[item.name] = item.count;
      });
    }
    return { dataList: data, series_list: series_list };
  }; 

  let CHART = useRef([
    { key: 'platform_prvider_env_count_hold', domRef: platform_prvider_env_count_hold, ins: null },
    { key: 'platform_prvider_resource_count_hold', domRef: platform_prvider_resource_count_hold, ins: null },
    { key: 'platform_prvider_resource_type_hold', domRef: platform_prvider_resource_type_hold, ins: null },
    { key: 'platform_resource_change_trend', domRef: platform_resource_change_trend, ins: null },
    { key: 'platform_number_of_active_resources', domRef: platform_number_of_active_resources, ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART.current);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'platform_prvider_env_count_hold') {
        chartUtils.update(chart, data.envStat);
      }
      if (chart.key === 'platform_prvider_resource_count_hold') {
        chartUtils.update(chart, data.envStat);
      }
      if (chart.key === 'platform_prvider_resource_type_hold') {
        chartUtils.update(chart, data.resStat);
      }
      if (chart.key === 'platform_resource_change_trend') {
        chartUtils.update(chart, data.projectResStat);
      }
      if (chart.key === 'platform_number_of_active_resources') {
        chartUtils.update(chart, data.resGrowTrend);
      }
    });
  }, [fetchCount]);

  useEffect(() => {
    onChangeSelectedPrpo([]);
  }, []);

  useEffect(() => {
    resizeHelper.attach();
    return () => {
      resizeHelper.remove();
    };
  }, []);

  useEffect(() => {
    statisticsCount > 0 && startStatistics();
  }, [statisticsCount]);
  return (
    <div className={styles.overview}>
      <div className={styles.overview_left}>
        <div className={styles.select}>
          <Select
            placeholder={t('define.page.selectProject.title')}
            mode='multiple'
            maxTagCount={3}
            allowClear={true}
            maxTagTextLength={10}
            style={{ minWidth: 173 }}
            value={selectedProjectIds}
            suffixIcon={<FileTextOutlined />}
            onChange={(v) => {
              onChangeSelectedPrpo(v);
            }}
            options={
              (projects.list || []).map((val) => {
                return { label: val.name, value: val.id };
              })
            }
          >
          </Select>
        </div>
        <div>
          <Row style={{ padding: '13.5px 10.5px', justifyContent: 'space-between' }} gutter={[ 21, 27 ]}>
            {
              [{
                name: '组织',
                count: 120,
                acount: 152
              }, {
                name: '组织',
                count: 120,
                acount: 152
              }, {
                name: '组织',
                count: 120,
                acount: 152
              }, {
                name: '组织',
                count: 120,
                acount: 152
              }, {
                name: '组织',
                count: 120,
                acount: 152
              }].map(item => {
                return (
                  <div className={styles.statisticsCard}>
                    <div className={styles.statisticsTop}>
                      <span>{item.name}</span>
                      <span>总数/活跃</span>
                    </div>
                    <div className={styles.statisticsBottom}>
                      {item.acount}/<span>{item.count}</span>
                    </div>
                  </div>
                );
              })
            }
          </Row>
          <Row gutter={[ 21, 27 ]}>
            <Col span={8}>
              <div className={styles.env_state}>
                <h3>{t('define.charts.platform_prvider_env_count_hold')}</h3>
                <div className={classNames(styles.content)}>
                  <div>
                    {/* <span className={styles.content_title}>{t('define.page.overview.lastUpdated')}</span> */}
                    <>
                      {isEmpty(data.envStat) ? (
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
                      {
                        isEmpty(data.envStat) ? 
                          <></> : 
                          <div className={styles.table}>
                            <div className={classNames(styles.table_header)}>
                              <div>{t('define.page.overview.order')}</div>
                              <div>{t('define.page.overview.envStatus')}</div>
                              <div>{t('define.page.overview.ratio')}</div>
                            </div>
                            {envStatTopData.map((val, i) => {
                              return <div className={classNames(styles.table_item)}>
                                <div>0{i + 1}</div>
                                <div>{ENV_STATUS[val.status]}</div>
                                <div>{(val.count * 100 / envStatTotal).toFixed(1) + '%'}</div>
                              </div>;
                            })}
                          </div>
                      } 
                    </>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.env_state}>
                <h3>{t('define.charts.platform_prvider_resource_count_hold')}</h3>
                <div className={classNames(styles.content)}>
                  <div>
                    <span className={styles.content_title}>{t('define.page.overview.lastUpdated')}</span>
                    <>
                      {isEmpty(data.envStat) ? (
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
                      {
                        isEmpty(data.envStat) ? 
                          <></> : 
                          <div className={styles.table}>
                            <div className={classNames(styles.table_header)}>
                              <div>{t('define.page.overview.order')}</div>
                              <div>{t('define.page.overview.envStatus')}</div>
                              <div>{t('define.page.overview.ratio')}</div>
                            </div>
                            {envStatTopData.map((val, i) => {
                              return <div className={classNames(styles.table_item)}>
                                <div>0{i + 1}</div>
                                <div>{ENV_STATUS[val.status]}</div>
                                <div>{(val.count * 100 / envStatTotal).toFixed(1) + '%'}</div>
                              </div>;
                            })}
                          </div>
                      } 
                    </>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.resource_type}>
                <h3>{t('define.charts.platform_prvider_resource_type_hold')}</h3>
                <div className={classNames(styles.content)}>
                  <div>
                    <span className={styles.content_title}>{t('define.page.overview.lastUpdated')}</span>
                    <>
                      {isEmpty(data.resStat) ? (
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
                      {
                        isEmpty(data.resStat) ? 
                          <></> :
                          <div className={styles.table}>
                            <div className={classNames(styles.table_header)}>
                              <div>{t('define.page.overview.order')}</div>
                              <div>{t('define.page.overview.resourceType')}</div>
                              <div>{t('define.page.overview.ratio')}</div>
                            </div>
                            {resStatTopData.map((val, i) => {
                              return <div className={classNames(styles.table_item)}>
                                <div>0{i + 1}</div>
                                <div>{val.resType}</div>
                                <div>{(val.count * 100 / resStatTotal).toFixed(1) + '%'}</div>
                              </div>;
                            })}
                          </div>
                      }
                    </>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[ 21, 27 ]}>
            <Col span={12}>
              <div className={styles.pro_resource}>
                <h3>{t('define.page.platform_resource_change_trend')}</h3>
                <div className={classNames(styles.content)}>
                  <div style={{ width: '100%', height: "100%" }}>
                    {isEmpty(data.projectResStat) ? (
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
                <h3>{t('define.page.platform_number_of_active_resources')}</h3>
                <div className={classNames(styles.content)}>
                  <div style={{ width: '100%', height: "100%" }}>
                    {isEmpty(data.projectResStat) ? (
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
          <h2>{t('define.page.overview.dynamic')}</h2>
          <div className={styles.data_table}>
            <List
              header={false}
              footer={false}
              dataSource={[ 'define.page.overview.dynamicdefine.page.overview.dynamicdefine.page.overview.dynamicdefine.page.overview.dynamicdefine.page.overview.dynamic', 2, 3, 5, 6, 7, 2, 3, 5, 6, 7, 2, 3, 5, 6, 7, 2, 3, 5, 6, 7, 2, 3, 5, 6, 7, 2, 3, 5, 6, 7 ]}
              renderItem={item => (
                <List.Item className={styles.listbody}>
                  <div className={styles.dynamicTitle}>
                    <span>{(item || {}).name || '张三'}: </span>
                    <EllipsisText style={{ maxWidth: 200 }}>{item || '-'}</EllipsisText>
                  </div>
                  <div className={styles.orgInfo}><span>{(item || {}).orgName || '组织'}</span> <span>06-22 18:10:30</span></div>

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
    projects: state[KEY].get('projects').toJS()
  })
)(overview);
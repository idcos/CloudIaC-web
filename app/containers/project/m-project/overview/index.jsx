import React, { useState, useEffect, useRef } from 'react';
import { Select, Row, Col, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { chartUtils } from 'components/charts-cfg';
import classNames from 'classnames';
import projectAPI from 'services/project';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { t } from 'utils/i18n';
import { connect } from 'react-redux';
import styles from './styles.less';
import { ENV_STATUS } from 'constants/types';
import { EnvStat, EnvResStat, ResGrowTrend, ResStat } from './components/dataDetail';

const KEY = 'global';

const overview = ({ curOrg, curProject }) => {

  const wrapperRef = useRef();
  const overview_envs_state = useRef();
  const overview_resouces_type = useRef();
  const overview_pro_resource = useRef();
  const overview_resource_tendency = useRef();
  const [ selectedModule, setSelectedModule ] = useState("envStat");
  const [ fetchCount, setFetchCount ] = useState(0);
  const [ envStatTopData, setEnvStatTopData ] = useState([]);
  const [ resStatTopData, setResStatTopData ] = useState([]);
  const [ resStatTotal, setResStatTotal ] = useState(1);
  const [ envStatTotal, setEnvStatTotal ] = useState(1);

  const {
    data = {
      envStat: [],
      resStat: [],
      envResStat: {
        series_list: [],
        dataList: []
      },
      resGrowTrend: []
    }
  } = useRequest(
    () => requestWrapper(
      projectAPI.statistics.bind(null, { orgId: curOrg.id, projectId: curProject.id })
    ), {
      ready: !!curProject.id,
      formatResult: data => {
        const { envStat, resStat, envResStat, resGrowTrend } = data || {};
        return {
          envStat: envStat || [], 
          resStat: resStat || [], 
          envResStat: formatResStat(envResStat) || {},
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
    { key: 'overview_envs_state', domRef: overview_envs_state, ins: null },
    { key: 'overview_resouces_type', domRef: overview_resouces_type, ins: null },
    { key: 'overview_pro_resource', domRef: overview_pro_resource, ins: null },
    { key: 'overview_resource_tendency', domRef: overview_resource_tendency, ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEventOfDomRef(CHART.current, wrapperRef);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'overview_envs_state') {
        chartUtils.update(chart, data.envStat);
      }
      if (chart.key === 'overview_resouces_type') {
        chartUtils.update(chart, data.resStat);
      }
      if (chart.key === 'overview_pro_resource') {
        chartUtils.update(chart, data.envResStat);
      }
      if (chart.key === 'overview_resource_tendency') {
        chartUtils.update(chart, data.resGrowTrend);
      }
    });
  }, [fetchCount]);

  useEffect(() => {
    resizeHelper.attach();
    return () => {
      resizeHelper.remove();
    };
  }, [wrapperRef.current]);

  return (
    <div className={styles.overview}>
      <Layout
        style={{ flex: 1, minWidth: 0 }}
        className='idcos-no-scrollbar'
        extraHeader={
          <PageHeader
            title={
              <div 
                className={styles.select} 
                style={{ 
                  height: "56px",
                  lineHeight: "56px",
                  marginBottom: "0"
                }}
              >
                <span style={{ fontSize: 20 }}>{t('define.overview')}</span>
              </div>
            }
            breadcrumb={true}
          />
        }
      >
        {curProject.id ? <div className={classNames(styles.overview_left, 'idcos-card')} ref={wrapperRef}>
          <Row gutter={[ 21, 27 ]}>
            <Col span={12}>
              <div className={styles.env_state}>
                <h3>{t('define.charts.overview_envs_state.envStateProportion')}</h3>
                <div className={classNames(styles.content, selectedModule === 'envStat' ? styles.selected : undefined)} 
                  onClick={() => {
                    setSelectedModule("envStat"); 
                  }}
                >
                  <div>
                    <span className={styles.content_title}>{t('define.page.overview.lastUpdated')}</span>
                    {isEmpty(data.envStat) ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 110 }}/>
                    ) : (
                      <>
                        <div ref={overview_envs_state} style={{ width: '100%', height: 214 }}></div>
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.resource_type}>
                <h3>{t('define.charts.overview_resouces_type.resoucesTypeProportion')}</h3>
                <div className={classNames(styles.content, selectedModule === 'resStat' ? styles.selected : undefined)} 
                  onClick={() => {
                    setSelectedModule("resStat"); 
                  }}
                >
                  <div>
                    <span className={styles.content_title}>{t('define.page.overview.lastUpdated')}</span>
                    {isEmpty(data.resStat) ? (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 110 }}/>
                    ) : (
                      <>
                        <div ref={overview_resouces_type} style={{ width: '100%', height: 214 }}></div>
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[ 21, 27 ]}>
            <Col span={12}>
              <div className={styles.pro_resource}>
                <h3>{t('define.page.overview.envResStat')}</h3>
                <div className={classNames(styles.content, selectedModule === 'envResStat' ? styles.selected : undefined)}
                  onClick={() => {
                    setSelectedModule("envResStat"); 
                  }}
                >
                  {isEmpty(data.envResStat) ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 90 }}/>
                  ) : (
                    <>
                      <div style={{ width: '100%', height: "100%" }}>
                        <div ref={overview_pro_resource} style={{ width: '100%', height: "100%" }}></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.resource_tendency}>
                <h3>{t('define.page.overview.resGrowTrend')}</h3>
                <div className={classNames(styles.content, selectedModule === 'resGrowTrend' ? styles.selected : undefined)}
                  onClick={() => {
                    setSelectedModule("resGrowTrend"); 
                  }}
                >
                  {isEmpty(data.resGrowTrend) ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ marginTop: 90 }}/>
                  ) : (
                    <>
                      <div style={{ width: '100%', height: "100%" }}>
                        <div ref={overview_resource_tendency} style={{ width: '100%', height: "100%" }}></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </Layout>
      {curProject.id && <div className={styles.overview_right} style={{ flex: "0 0 280px" }}>
        { selectedModule === 'envStat' ? <EnvStat showData={data.envStat} total={envStatTotal} /> : undefined }
        { selectedModule === 'resStat' ? <ResStat showData={data.resStat} total={resStatTotal} /> : undefined }
        { selectedModule === 'envResStat' ? <EnvResStat showData={data.envResStat.dataList}/> : undefined }
        { selectedModule === 'resGrowTrend' ? <ResGrowTrend showData={data.resGrowTrend}/> : undefined }
      </div>}
    </div>
  );
};

export default connect(
  (state) => ({ 
    curOrg: state[KEY].get('curOrg'),
    curProject: state[KEY].get('curProject') || {},
    projects: state[KEY].get('projects').toJS()
  })
)(overview);
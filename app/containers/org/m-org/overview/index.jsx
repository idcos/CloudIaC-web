import React, { useState, useEffect, useRef } from 'react';
import { Select, Row, Col, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { chartUtils } from 'components/charts-cfg';
import classNames from 'classnames';
import orgsAPI from 'services/orgs';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { connect } from 'react-redux';
import styles from './styles.less';
import { ENV_STATUS } from 'constants/types';
import { EnvStat, ProjectStat, ResGrowTrend, ResStat } from './components/dataDetail';

const KEY = 'global';

const overview = ({ curOrg, projects, curProject }) => {

  const overview_envs_state = useRef();
  const overview_resouces_type = useRef();
  const overview_pro_resource = useRef();
  const overview_resource_tendency = useRef();
  const [ selectedProjectIds, setSelectedProjectIds ] = useState([]);
  const [ selProList, setSelProList ] = useState([]);
  const [ selectedModule, setSelectedModule ] = useState("envStat");
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
      projectStat: {
        last_month: [],
        this_month: []
      },
      resGrowTrend: {
        last_month: [],
        this_month: []
      }
    },
    run: startStatistics
  } = useRequest(
    () => requestWrapper(
      orgsAPI.orgStatistics.bind(null, { curOrg, projectIds: selectedProjectIds })
    ), {
      manual: true,
      formatResult: data => {
        const { envStat, resStat, projectStat, resGrowTrend } = data || {};
        return {
          envStat: envStat || [], 
          resStat: resStat || [], 
          projectStat: {
            last_month: [projectStat[0]].filter(it => it), 
            this_month: [projectStat[1]].filter(it => it)
          }, 
          resGrowTrend: {
            last_month: resGrowTrend.slice(0, 7), 
            this_month: resGrowTrend.slice(-8, -1)
          }
        };
      },
      onSuccess: ({ envStat, resStat }) => {
        setEnvStatTopData(sortBy(envStat, function(item) {
          -item.count; 
        }).slice(0, 2));
        setResStatTopData(sortBy(resStat, function(item) {
          -item.count; 
        }).slice(0, 2));
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

  let CHART = useRef([
    { key: 'overview_envs_state', domRef: overview_envs_state, des: '环境状态占比', ins: null },
    { key: 'overview_resouces_type', domRef: overview_resouces_type, des: '资源类型占比', ins: null },
    { key: 'overview_pro_resource', domRef: overview_pro_resource, des: '环境状态占比', ins: null },
    { key: 'overview_resource_tendency', domRef: overview_resource_tendency, des: '环境状态占比', ins: null }
  ]);
  const resizeHelper = chartUtils.resizeEvent(CHART.current);

  useEffect(() => {
    CHART.current.forEach(chart => {
      if (chart.key === 'overview_envs_state') {
        chartUtils.update(chart, data.envStat);
      }
      if (chart.key === 'overview_resouces_type') {
        chartUtils.update(chart, data.resStat);
      }
      if (chart.key === 'overview_pro_resource') {
        chartUtils.update(chart, data.projectStat);
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
  }, []);

  useEffect(() => {
    setSelProList(projects.list);
  }, [projects]);

  useEffect(() => {
    curProject.id && onChangeSelectedPrpo([curProject.id]);
  }, [curProject]);

  useEffect(() => {
    statisticsCount > 0 && startStatistics();
  }, [statisticsCount]);
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
                <span style={{ fontSize: 20 }}>概览</span>
                <Select
                  placeholder='全部项目'
                  mode='multiple'
                  maxTagCount={3}
                  allowClear={true}
                  maxTagTextLength={10}
                  style={{ minWidth: 173, marginLeft: 12, fontWeight: 'normal' }}
                  value={selectedProjectIds}
                  suffixIcon={<FileTextOutlined />}
                  onChange={(v) => {
                    onChangeSelectedPrpo(v);
                  }}
                  options={
                    selProList ? selProList.map((val) => {
                      return { label: val.name, value: val.id };
                    }) : undefined
                  }
                >
                </Select>
              </div>}
            breadcrumb={true}
          />
        }
      >
        {curProject.id ? <div className={classNames(styles.overview_left, 'idcos-card')}>
          <Row gutter={[ 21, 27 ]}>
            <Col span={12}>
              <div className={styles.env_state}>
                <h3>环境状态占比</h3>
                <div className={classNames(styles.content, selectedModule === 'envStat' ? styles.selected : undefined)} 
                  onClick={() => {
                    setSelectedModule("envStat"); 
                  }}
                >
                  <div>
                    <span className={styles.content_title}>环境状态占比</span>
                    <div ref={overview_envs_state} style={{ width: '100%', height: 214 }}></div>
                    <div className={styles.table}>
                      <div className={classNames(styles.table_header)}>
                        <div>占比正序排列</div>
                        <div>环境状态</div>
                        <div>占比比率</div>
                      </div>
                      {envStatTopData.map((val, i) => {
                        return <div className={classNames(styles.table_item)}>
                          <div>0{i + 1}</div>
                          <div>{ENV_STATUS[val.status]}</div>
                          <div>{(val.count * 100 / envStatTotal).toFixed(1) + '%'}</div>
                        </div>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.resource_type}>
                <h3>资源类型占比</h3>
                <div className={classNames(styles.content, selectedModule === 'resStat' ? styles.selected : undefined)} 
                  onClick={() => {
                    setSelectedModule("resStat"); 
                  }}
                >
                  <div>
                    <span className={styles.content_title}>资源类型占比</span>
                    <div ref={overview_resouces_type} style={{ width: '100%', height: 214 }}></div>
                    <div className={styles.table}>
                      <div className={classNames(styles.table_header)}>
                        <div>占比正序排列</div>
                        <div>资源类型</div>
                        <div>占比比率</div>
                      </div>
                      {resStatTopData.map((val, i) => {
                        return <div className={classNames(styles.table_item)}>
                          <div>0{i + 1}</div>
                          <div>{val.resType}</div>
                          <div>{(val.count * 100 / resStatTotal).toFixed(1) + '%'}</div>
                        </div>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[ 21, 27 ]}>
            <Col span={12}>
              <div className={styles.pro_resource}>
                <h3>项目资源数量</h3>
                <div className={classNames(styles.content, selectedModule === 'projectStat' ? styles.selected : undefined)}
                  onClick={() => {
                    setSelectedModule("projectStat"); 
                  }}
                >
                  <div style={{ width: '100%', height: "100%" }}>
                    <div ref={overview_pro_resource} style={{ width: '100%', height: "100%" }}></div>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.resource_tendency}>
                <h3>最近七天资源新增趋势</h3>
                <div className={classNames(styles.content, selectedModule === 'resGrowTrend' ? styles.selected : undefined)}
                  onClick={() => {
                    setSelectedModule("resGrowTrend"); 
                  }}
                >
                  <div style={{ width: '100%', height: "100%" }}>
                    <div ref={overview_resource_tendency} style={{ width: '100%', height: "100%" }}></div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </Layout>
      {curProject.id && <div className={styles.overview_right} style={{ flex: "0 0 280px" }}>
        { selectedModule === 'envStat' ? <EnvStat showData={data.envStat} total={envStatTotal} /> : undefined }
        { selectedModule === 'resStat' ? <ResStat showData={data.resStat} total={resStatTotal} /> : undefined }
        { selectedModule === 'projectStat' ? <ProjectStat showData={data.projectStat}/> : undefined }
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
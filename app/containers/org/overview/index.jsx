import React, { useState, useEffect, useRef } from 'react';
import { Select, Row, Col, Empty } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { chartUtils } from 'components/charts-cfg';
import classNames from 'classnames';
import orgsAPI from 'services/orgs';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { connect } from 'react-redux';
import styles from './styles.less';
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
  const [ testData, setData ] = useState({
    active: 1,
    failed: 2,
    destroyed: 3,
    running: 4,
    approving: 5
  });

  const [ testData2, setData2 ] = useState({
    eip: 1,
    slb: 2,
    vpc: 3,
    running: 4,
    approving: 5
  });

  const {
    data,
    run: startStatistics
  } = useRequest(
    () => requestWrapper(
      orgsAPI.orgStatistics.bind(null, { curOrg, projectIds: selectedProjectIds })
    ), {
      manual: true,
      onSuccess: () => {
        console.log(data);
      }
    }
  );
  const onChangeSelectedPrpo = (v) => {
    setSelectedProjectIds(v);
    setStatisticsCount(preValue => preValue + 1);
  };

  const [ testData1, setData1 ] = useState({
    last_month: [ 10, 17, 26, 43, 35, 29, 19 ],
    this_month: [ 21, 20, 52, 10, 42, 25, 80 ]
  });
  
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
        chartUtils.update(chart, testData);
      }
      if (chart.key === 'overview_resouces_type') {
        chartUtils.update(chart, testData2);
      }
      if (chart.key === 'overview_pro_resource') {
        chartUtils.update(chart, testData1);
      }
      if (chart.key === 'overview_resource_tendency') {
        chartUtils.update(chart, testData1);
      }
    });
  }, [ testData, curProject ]);

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
        style={{ flex: 1, minWidth: "0" }}
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
                  mode='multiple'
                  style={{ minWidth: 173, marginLeft: "13px" }}
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
                      <div className={classNames(styles.table_item)}>
                        <div>01</div>
                        <div>活跃</div>
                        <div>35.5%</div>
                      </div>
                      <div className={classNames(styles.table_item)}>
                        <div>02</div>
                        <div>失败</div>
                        <div>35.5%</div>
                      </div>
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
                        <div>环境状态</div>
                        <div>占比比率</div>
                      </div>
                      <div className={classNames(styles.table_item)}>
                        <div>01</div>
                        <div>活跃</div>
                        <div>35.5%</div>
                      </div>
                      <div className={classNames(styles.table_item)}>
                        <div>02</div>
                        <div>失败</div>
                        <div>35.5%</div>
                      </div>
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
        { selectedModule === 'envStat' ? <EnvStat/> : undefined }
        { selectedModule === 'resStat' ? <ResStat/> : undefined }
        { selectedModule === 'projectStat' ? <ProjectStat/> : undefined }
        { selectedModule === 'resGrowTrend' ? <ResGrowTrend/> : undefined }
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
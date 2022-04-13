import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Card } from 'antd';
import { FileFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import queryString from 'query-string';
import classnames from 'classnames';
import moment from 'moment';
import Layout from 'components/common/layout';
import PageHeader from 'components/pageHeader';
import history from "utils/history";
import { t } from 'utils/i18n';
import styles from './styles.less';

const ProjectSelectPage = ({ projects, dispatch }) => {

  const { orgId } = queryString.parse(location.search);
  const projectList = (projects || {}).list || [];
  const [showProjectList, setShowProjectList] = useState([]);

  useEffect(() => {
    setShowProjectList(projectList);
  }, [projectList]);

  const onSearch = (keyword) => {
    const reg = new RegExp(keyword, 'gi');
    const filterOptions = projectList.filter((it) => !keyword || reg.test(it.name));
    setShowProjectList(filterOptions);
  };

  const changeProject = (pjtId) => {
    dispatch({
      type: 'global/set-curProject',
      payload: {
        projectId: pjtId
      }
    });
    history.push(`/org/${orgId}/project/${pjtId}/m-project-env`);
  };

  return (
    <Layout
      style={{ backgroundColor: '#F5F8F8', paddingRight: 0 }}
      contentStyle={{ backgroundColor: '#F5F8F8' }}
      extraHeader={
        <PageHeader
          className='container-inner-width'
          title={t('define.page.selectProject.title')}
          headerStyle={{ padding: '42px 24px' }}
          breadcrumb={false}
          showIcon='document'
          subDes={
            <Input.Search placeholder={t('define.page.selectProject.search.placeholder')} onSearch={onSearch} style={{ width: 240 }} />
          }
        />
      }
    >
      <div className='container-inner-width' style={{ marginTop: 24 }}>
        <Row gutter={[24, 24]}>
          {
            showProjectList.map(({ id, name, description, createdAt }) => (
              <Col span={6}>
                <div className={styles.project} onClick={() => changeProject(id)}>
                  <div className={styles.project_main}>
                    <FileFilled className={styles.project_main_icon} />
                    <div className={styles.project_main_info}>
                      <div className={classnames('idcos-text-ellipsis', styles.project_main_info_name)}>
                        {name}
                      </div>
                      <div className={classnames('idcos-text-ellipsis', styles.project_main_info_description)}>
                        {description || '-'}
                      </div>
                    </div>
                  </div>
                  <div className={styles.project_createdAt}>
                    {moment(createdAt).format('YYYY/MM/DD')}
                  </div>
                </div>
              </Col>
            ))
          }
        </Row>
      </div>
    </Layout>
  );
};

export default connect(
  (state) => ({
    curOrg: state['global'].get('curOrg'),
    projects: state['global'].get('projects').toJS(),
  })
)(ProjectSelectPage);
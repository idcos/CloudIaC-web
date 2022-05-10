import React, { useState, useEffect } from 'react';
import { Empty, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { connect } from "react-redux";
import { Eb_WP } from 'components/error-boundary';
import OpModal from 'components/project-modal';
import projectAPI from 'services/project';
import ProjectCard from './components/projectCard';
import { t } from 'utils/i18n';
import history from 'utils/history';
import getPermission from "utils/permission";
import styles from './styles.less';


const Index = (props) => {
  const { curProject, match, dispatch, userInfo } = props,
    { params } = match;
  const { ORG_SET } = getPermission(userInfo);
  const [ loading, setLoading ] = useState(false),
    [ lastUseProject, setLastUseProject ] = useState(),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 0,
      withStat: true
    }),
    [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null),
    [ record, setRecord ] = useState({});

  useEffect(() => {
    if (curProject.id) {
      fetchLastUseProject();
    }
  }, [curProject.id]);

  useEffect(() => {
    fetchList();
  }, [query]);

  // 重新刷新全局的projects
  const reloadGlobalProjects = () => {
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId: params.orgId
      }
    });
  };

  const changeProject = (pjtId) => {
    dispatch({
      type: 'global/set-curProject',
      payload: {
        projectId: pjtId
      }
    });
    history.push(`/org/${params.orgId}/project/${pjtId}/m-project-overview`);
  };
  
  const updateStatus = async(record, status) => {
    let payload = {
      orgId: params.orgId,
      projectId: record.id,
      status
    };
    const res = await projectAPI.editProject(payload);
    if (res.code != 200) {
      return notification.error({
        message: res.message
      });
    } else {
      notification.success({
        message: t('define.message.opSuccess')
      });
      reloadGlobalProjects();
    }
    fetchList();
  };

  const fetchLastUseProject = async () => {
    try {
      const res = await projectAPI.projectList({
        ...query,
        projectId: curProject.id,
        orgId: params.orgId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setLastUseProject((res.result.list || [])[0]);
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await projectAPI.projectList({
        ...query,
        orgId: params.orgId
      });
      if (res.code != 200) {
        throw new Error(res.message);
      }
      setResultMap({
        list: res.result.list || [],
        total: res.result.total || 0
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      notification.error({
        message: t('define.message.getFail'),
        description: e.message
      });
    }
  };

  const toggleVisible = () => {
    if (visible) {
      setOpt(null);
      setRecord({});
    }
    setVisible(!visible);
  };
  const operation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: (param) => projectAPI.createProject(param),
        edit: (param) => projectAPI.editProject(param)
      };
      let params = {
        ...payload
      };
      const res = await method[action](params);
      if (res.code != 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess')
      });
      fetchList();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message
      });
    }
  };

  return (
    <div className={styles.projectList}>
      {(!ORG_SET && resultMap.list.length === 0) ? (
        <Empty style={{ marginTop: 200 }} image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('define.project.empty.des')} />
      ) : (
        <div className={'pjtBox'}>
          {!!ORG_SET && (
            <div 
              onClick={() => {
                setOpt('add');
                toggleVisible();
              }} 
              className={classNames('pjtItemBox', 'creatPjtBox')}
            >
              <PlusOutlined className='plusIcon' />
              <span className='create-text'>{t('define.project.create')}</span>
            </div>
          )}
          {
            resultMap.list.map((item, i) => {
              return <ProjectCard 
                changeProject={changeProject}
                setOpt={setOpt}
                setRecord={setRecord}
                toggleVisible={toggleVisible}
                updateStatus={updateStatus}
                isLastUse={lastUseProject && lastUseProject.id === item.id}
                item={item}
                readOnly={!ORG_SET}
              />;
            })
          }
        </div>
      )}
      {
        visible && <OpModal
          visible={visible}
          orgId={params.orgId}
          opt={opt}
          curRecord={record}
          toggleVisible={toggleVisible}
          reload={fetchList}
          operation={operation}
        />
      }
    </div>
  );
};

export default connect(
  (state) => ({ 
    curProject: state['global'].get('curProject') || {},
    userInfo: state['global'].get('userInfo').toJS()
  })
)(
  Eb_WP()(Index)
);

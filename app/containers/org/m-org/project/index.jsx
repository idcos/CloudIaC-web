import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { connect } from "react-redux";
import { Eb_WP } from 'components/error-boundary';
import OpModal from 'components/project-modal';
import projectAPI from 'services/project';
import ProjectCard from './components/projectCard';
import EmptyGen from 'components/empty-gen';
import { t } from 'utils/i18n';
import history from 'utils/history';
import getPermission from "utils/permission";
import { IAC_PUBLICITY_HOST } from 'constants/types';
import styles from './styles.less';


const Index = ({ curProject, match, dispatch, userInfo }) => {
  const { params } = match;
  const { ORG_SET } = getPermission(userInfo);
  const [ loading, setLoading ] = useState(false),
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
      {(resultMap.list.length === 0) ? (
        !ORG_SET ?
          <EmptyGen
            imgName='contact-admin.png'
            title={t('define.project.noPermission')}
            description={t('define.project.empty.des')}
            linkText={t('define.project')}
            linkUrl={`${IAC_PUBLICITY_HOST}/markdown/docs/mkdocs/manual/org-project-role.md`}
          /> :
          <EmptyGen
            imgName='new-project.png'
            title={t('define.project.new')}
            imgClickFn={() => {
              setOpt('add');
              toggleVisible();
            }}
            description={t('define.project.empty.des')}
            linkText={t('define.project')}
            linkUrl={`${IAC_PUBLICITY_HOST}/markdown/docs/mkdocs/manual/org-project-role.md`}
          />
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
              <span className='create-text'>{t('define.project.new')}</span>
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
                isLastUse={curProject.id === item.id}
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

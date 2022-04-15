import React, { useState, useEffect } from 'react';
import { Button, Col, Row, notification, Divider, Popconfirm, Dropdown, Menu } from 'antd';
import { PlusCircleOutlined, MinusOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from "react-redux";
import { Eb_WP } from 'components/error-boundary';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import OpModal from 'components/project-modal';
import projectAPI from 'services/project';
import ProjectCard from './components/projectCard';
import { t } from 'utils/i18n';
import styles from './styles.less';


const Index = (props) => {
  const { match, dispatch } = props,
    { params } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 0
      // status: 'all'
    }),
    [ visible, setVisible ] = useState(false),
    [ opt, setOpt ] = useState(null),
    [ record, setRecord ] = useState({});

  const tableFilterFieldName = 'taskStatus';

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.name'),
      width: 230,
      ellipsis: true
    },
    {
      dataIndex: 'description',
      title: t('define.des'),
      width: 264,
      ellipsis: true
    },
    {
      dataIndex: 'creator',
      title: t('define.creator'),
      width: 160,
      ellipsis: true
    },
    {
      dataIndex: 'createdAt',
      title: t('define.createdAt'),
      width: 210,
      ellipsis: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      dataIndex: 'status',
      title: t('define.status'),
      width: 100,
      ellipsis: true,
      render: (text) => {
        return <span>{text === 'enable' ? t('define.project.status.enable') : t('define.project.status.disabled')}</span>; 
      }
    },
    {
      title: t('define.action'),
      width: 169,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => {
        return (
          <span className='inlineOp'>
            <a type='link' onClick={() => edit(record)}>{t('define.action.modify')}</a>
            <Divider type='vertical' />
            {record.status === 'enable' ? 
              <Popconfirm
                title={t('define.project.status.disabled.confirm.title')}
                onConfirm={() => updateStatus(record, 'disable')}
              >
                <a>{t('define.project.status.disabled')}</a>
              </Popconfirm> : 
              <Popconfirm
                title={t('define.project.action.recovery.confirm.title')}
                onConfirm={() => updateStatus(record, 'enable')}
              >
                <a>{t('define.project.action.recovery')}</a>
              </Popconfirm>
            }
          </span>
        );
      }
    }
  ];

  useEffect(() => {
    fetchList();
  }, [query]);

  const edit = (record) => {
    setOpt('edit');
    setRecord(record);
    toggleVisible();
  };

  // 重新刷新全局的projects
  const reloadGlobalProjects = () => {
    dispatch({
      type: 'global/getProjects',
      payload: {
        orgId: params.orgId
      }
    });
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
      const { combinedStatus, status, ...restQuery } = query;
      const res = await projectAPI.projectList({
        ...restQuery,
        [tableFilterFieldName]: combinedStatus || status,
        orgId: params.orgId
      });
      console.log(res, 'tre');
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

  const changeQuery = (payload) => {
    setQuery({
      ...query,
      ...payload
    });
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

  return <Layout
    extraHeader={<PageHeader
      title={t('define.scope.project')}
      breadcrumb={true}
    />}
  >
    <div className={styles.projectList}>
      <div className={'pjtBox'}>
        <div 
          onClick={() => {
            setOpt('add');
            toggleVisible();
          }} 
          className={classNames('pjtItemBox', 'creatPjtBox')
          }
        >
          <PlusCircleOutlined className={'plusIcon'} />{t('define.project.create')}
        </div>
        {
          resultMap.list.map((item, i) => {
            return <ProjectCard 
              setOpt={setOpt}
              setRecord={setRecord}
              toggleVisible={toggleVisible}
              updateStatus={updateStatus}
              item={item}
            />;
          })
        }
      </div>
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
  </Layout>;
};

export default connect()(
  Eb_WP()(Index)
);

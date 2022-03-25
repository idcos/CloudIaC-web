import { Link } from 'react-router-dom';
import { Space, Table, ConfigProvider, Empty, Select, Checkbox, Input, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRequest, useEventEmitter } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import PageHeader from 'components/pageHeader';
import ResourceViewModal from 'components/resource-view-modal';
import Layout from 'components/common/layout';
import EllipsisText from 'components/EllipsisText';
import classNames from 'classnames';
import PageSearch from 'components/PageSearch';
import orgsAPI from 'services/orgs';
import styles from './styles.less'
import ResourceItem from './component/resource_item';

const cateList = [
  {
    description: '资源名称',
    code: 'name'
  },
  {
    description: '资源类型',
    code: 'type'
  }
];

export default ({ match }) => {

  const { orgId } = match.params || {};
  const event$ = useEventEmitter();
  // 列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList
  } = useRequest(
    (params) => requestWrapper(
      orgsAPI.listResources.bind(null, { orgId, ...params })
    ), {
      throttleInterval: 1000, // 节流
      manual: true,
      onSuccess: () => {
        console.log( pjtId );
      }
    }
  );

  // const { 
  //   data: resultMap = {
  //     list: [],
  //     total: 0
  //   },
  //   loading
  // } = useRequest(
  //   () => requestWrapper(
  //     envAPI.envsList.bind(null, {
  //       orgId,
  //       projectId: pjtId,
  //     })
  //   ),{
  //     manual:true,
  //     onSuccess: () => {
  //       console.log(resultMap.list);
  //     }
  //   }
  // );

  // 表单搜索和table关联hooks
  const { 
    tableProps, 
    setSearchParams
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, type, keyword, ...restParams } = params;
      fetchList({
        currentPage,
        module: type,
        q: keyword,
        ...restParams 
      });
    }
  });

  const onSearch = (type, keyword) => {
    setSearchParams((preSearchParams) => ({ 
      ...preSearchParams,
      form: { type, keyword },
      paginate: { ...preSearchParams.paginate, current: 1 }
    }));
  };

  const columns = [
    {
      dataIndex: 'projectName',
      title: '项目',
      width: 180,
      ellipsis: true
    },
    {
      dataIndex: 'envName',
      title: '环境',
      width: 180,
      render: (text, record) => {
        const { projectId, envId } = record;
        const url = `/org/${orgId}/project/${projectId}/m-project-env/detail/${envId}?tabKey=resource`;
        return (
          <Link to={url}>
            <EllipsisText>{text}</EllipsisText>
          </Link>
        );
      }
    },
    {
      dataIndex: 'provider',
      title: 'Provider',
      width: 170,
      ellipsis: true
    },
    {
      dataIndex: 'type',
      title: '类型',
      width: 220,
      ellipsis: true
    },
    {
      dataIndex: 'resourceName',
      title: '名称',
      width: 200,
      render: (text, record) => {
        const { resourceName, resourceId, projectId, envId } = record;
        const params = { resourceName, orgId, projectId, envId, resourceId };
        return (
          <a onClick={() => event$.emit({ type: 'open-resource-view-modal', data: { params } })}>
            <EllipsisText>{text}</EllipsisText>
          </a>
        );
      }
    },
    {
      dataIndex: 'module',
      title: '模块',
      width: 190,
      ellipsis: true
    }
  ];

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={
          <div className={styles.search}>
            <span style={{fontSize: "20px"}}>资源查询</span>
            <Input
              allowClear={true}
              style={{ width:"400px", marginLeft:"135px", height: "32px" }}
              placeholder='请输入关键字搜索'
              prefix={<SearchOutlined />}
            />
          </div>}
          breadcrumb={true}
        />
      }
    >
      <div className={classNames(styles.res_query, 'idcos-card')}>
        <div className={styles.left}>
          <div className={styles.env_list}>
            <span>环境</span>
            <Checkbox.Group style={{ width: '100%' }} onChange={(v) => {console.log(v)}}>
              <Checkbox className={styles.left_item} value="a">A121212</Checkbox>
              <Checkbox className={styles.left_item} value="b">b212323</Checkbox>
              <Checkbox className={styles.left_item} value="c">A32121321</Checkbox>
              <Checkbox className={styles.left_item} value="d">A32121321</Checkbox>
            </Checkbox.Group>
          </div>
          <div className={styles.provider_list}>
            <span>Provider</span>
            <Checkbox.Group style={{ width: '100%' }} onChange={(v) => {console.log(v)}}>
              <Checkbox className={styles.left_item} value="a">A121212</Checkbox>
              <Checkbox className={styles.left_item} value="b">b212323</Checkbox>
              <Checkbox className={styles.left_item} value="c">A32121321</Checkbox>
              <Checkbox className={styles.left_item} value="d">A32121321</Checkbox>
            </Checkbox.Group>
          </div>
        </div>
        <div className={styles.right}>
          <ResourceItem />
          <ResourceItem />
        </div>
      </div>
      <ResourceViewModal event$={event$}/>
    </Layout>
  );
};

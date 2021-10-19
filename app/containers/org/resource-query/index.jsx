import { Space, Table } from 'antd';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import { PageSearch, usePageSearch } from 'inner-modules/@idcos/components';
import orgsAPI from 'services/orgs';

export default ({ match }) => {

  const { orgId } = match.params || {};

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
      manual: true
    }
  );

  // 表单搜索和table关联hooks
  const { 
    tableProps, 
    setSearchParams
  } = useSearchFormAndTable({
    tableData,
    onSearch: (params) => {
      const { current: currentPage, name, type, ...restParams } = params;
      fetchList({ 
        currentPage,
        module: name ? 'name' : 'type',
        q: name || type,
        ...restParams 
      });
    }
  });

  const [ 
    pageSearchProps
  ] = usePageSearch({
    mode: 'simple',
    onSearch: (form) => {
      setSearchParams((preSearchParams) => ({ 
        ...preSearchParams,
        form,
        paginate: { ...preSearchParams.paginate, current: 1 }
      }));
    },
    conditionList: [
      {
        name: '资源名称',
        code: 'name'
      },
      {
        name: '资源类型',
        code: 'type'
      }
    ]
  });

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
      ellipsis: true
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
      width: 230,
      ellipsis: true
    },
    {
      dataIndex: 'resourceName',
      title: '名称',
      width: 200,
      ellipsis: true
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
          title='资源查询'
          breadcrumb={true}
        />
      }
    >
      <div className='idcos-card'>
        <Space size='middle' direction='vertical' style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Space size='middle'>
              <PageSearch {...pageSearchProps}/>
            </Space>
          </div>
          <Table
            columns={columns}
            scroll={{ x: 'min-content', y: 430 }}
            loading={tableLoading}
            {...tableProps}
          />
        </Space>
      </div>
    </Layout>
  );
};

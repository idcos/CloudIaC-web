import { Pagination, Checkbox, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import classNames from 'classnames';
import orgsAPI from 'services/orgs';
import envAPI from 'services/env';
import styles from './styles.less';
import ResourceItem from './component/resource_item';

const env = [
  {
    label: 'env1',
    value: 'env1'
  },
  {
    label: 'env2',
    value: 'env2'
  },
  {
    label: 'env3',
    value: 'env3'
  },
  {
    label: 'env4',
    value: 'env4'
  }
];

const provider = [
  {
    label: 'alicloud',
    value: 'alicloud'
  },
  {
    label: 'alicloud1',
    value: 'alicloud1'
  },
  {
    label: 'alicloud2',
    value: 'alicloud2'
  },
  {
    label: 'alicloud3',
    value: 'alicloud3'
  }
];

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

  const {
    loading,
    data,
    run,
    mutate
  } = useRequest(
    () => requestWrapper(
      envAPI.getResources.bind(null, { envId: "env-c8acft3n6m8da397gnrg", orgId: "org-c8a738rn6m8fge3vg06g", projectId: "p-c8a73obn6m8fv9d3p1g0", resourceId: "r-c8ack1jn6m8da397gou0" })
    ), {
      // manual: true
    }
  );

  return (
    <Layout
      extraHeader={
        <PageHeader
          title={
            <div className={styles.search}>
              <span style={{ fontSize: "20px" }}>资源查询</span>
              <Input
                allowClear={true}
                style={{ width: "400px", marginLeft: "135px", height: "32px" }}
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
            <Checkbox.Group 
              className={styles.checbox}
              style={{ width: '100%' }} 
              options={env}
              onChange={(v) => {
                console.log(v); 
              }}
            >
            </Checkbox.Group>
          </div>
          <div className={styles.provider_list}>
            <span>Provider</span>
            <Checkbox.Group 
              className={styles.checbox}
              style={{ width: '100%' }} 
              options={provider}
              onChange={(v) => {
                console.log(v); 
              }}
            >
            </Checkbox.Group>
          </div>
        </div>
        <div className={styles.right}>
          <ResourceItem data={data} />
          <ResourceItem data={data} />
          <ResourceItem data={data} />
          <ResourceItem data={data} />
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </div>
    </Layout>
  );
};

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback } from 'react';
import {
  Button,
  Table,
  Input,
  notification,
  Space,
  Popover,
  Tag,
  Popconfirm,
  Row,
  Col,
  Modal,
} from 'antd';
import { InfoCircleFilled, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import { useSearchFormAndTable } from 'utils/hooks';
import history from 'utils/history';
import PageHeader from 'components/pageHeader';
import Layout from 'components/common/layout';
import EllipsisText from 'components/EllipsisText';
import cgroupsAPI from 'services/cgroups';
import { t } from 'utils/i18n';

const PolicyGroupList = ({ match }) => {
  const { orgId } = match.params || {};

  // 策略组列表查询
  const {
    loading: tableLoading,
    data: tableData,
    run: fetchList,
    refresh: refreshList,
  } = useRequest(params => requestWrapper(cgroupsAPI.list.bind(null, params)), {
    manual: true,
  });

  // 删除策略组
  const { run: deleteGroup } = useRequest(
    policyGroupId =>
      requestWrapper(cgroupsAPI.del.bind(null, { policyGroupId }), {
        autoSuccess: true,
      }),
    {
      manual: true,
      onSuccess: () => {
        setSearchParams(preSearchParams => ({
          ...preSearchParams,
          paginate: { ...preSearchParams.paginate, current: 1 },
        }));
      },
    },
  );

  // 表单搜索和table关联hooks
  const { tableProps, onChangeFormParams, setSearchParams } =
    useSearchFormAndTable({
      tableData,
      onSearch: params => {
        const { current: currentPage, ...restParams } = params;
        fetchList({ currentPage, ...restParams });
      },
    });

  const enabled = async (value, record) => {
    try {
      const res = await cgroupsAPI.update({
        enabled: value,
        policyGroupId: record.id,
      });
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      notification.success({
        message: t('define.message.opSuccess'),
      });
      refreshList();
    } catch (e) {
      notification.error({
        message: t('define.message.getFail'),
        description: e.message,
      });
    }
  };

  const onDel = ({ id, policyCount, relCount }) => {
    Modal.confirm({
      width: 480,
      title: t('define.action.delete.confirm.title'),
      content: (
        <>
          {t('define.policyGroup.action.delete.confirm.content.prefix')}“
          <b>{policyCount}</b>”
          {t('define.policyGroup.action.delete.confirm.content.middle')}“
          <b>{relCount}</b>”
          {t('define.policyGroup.action.delete.confirm.content.suffix')}
        </>
      ),
      icon: <InfoCircleFilled />,
      cancelButtonProps: {
        className: 'ant-btn-tertiary',
      },
      onOk: () => deleteGroup(id),
    });
  };

  const goFormPage = id => {
    history.push(
      `/org/${orgId}/compliance/policy-config/policy-group/policy-group-form/${
        id || ''
      }`,
    );
  };

  const EllipsisTag = useCallback(
    ({ children }) => (
      <Tag style={{ maxWidth: 120, height: 22, margin: 0 }}>
        <EllipsisText>{children}</EllipsisText>
      </Tag>
    ),
    [],
  );

  const columns = [
    {
      dataIndex: 'name',
      title: t('define.name'),
      width: 188,
      ellipsis: true,
    },
    {
      dataIndex: 'description',
      title: t('define.des'),
      width: 170,
      ellipsis: true,
    },
    {
      dataIndex: 'labels',
      title: t('define.tag'),
      width: 370,
      ellipsis: true,
      render: text => {
        const tags = text || [];
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {tags.slice(0, 3).map(it => (
              <EllipsisTag>{it}</EllipsisTag>
            ))}
            {tags.length > 3 && (
              <Popover
                content={
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {tags.map(it => (
                      <EllipsisTag>{it}</EllipsisTag>
                    ))}
                  </div>
                }
              >
                <span>
                  <EllipsisTag>...</EllipsisTag>
                </span>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      dataIndex: 'policyCount',
      title: t('define.policyGroup.field.policyCount'),
      width: 100,
      ellipsis: true,
      render: (text, record) => (
        <a
          onClick={() => {
            history.push(
              `/org/${orgId}/compliance/policy-config/policy?groupId=${record.id}`,
            );
          }}
        >
          {text}
        </a>
      ),
    },
    {
      dataIndex: 'updatedAt',
      title: t('define.updateTime'),
      width: 180,
      ellipsis: true,
      render: text => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: t('define.action'),
      width: 170,
      ellipsis: true,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space>
            <a onClick={() => goFormPage(record.id)}>
              {t('define.action.modify')}
            </a>
            <Popconfirm
              title={`${t('define.ct.import.action.ok')} ${
                record.enabled
                  ? t('define.status.disabled')
                  : t('define.status.enabled')
              } ${t('define.policyGroup')}?`}
              onConfirm={() => enabled(!record.enabled, record)}
              placement='bottomLeft'
            >
              <Button type='link' style={{ padding: 0, fontSize: 12 }}>
                {record.enabled
                  ? t('define.status.disabled')
                  : t('define.status.enabled')}
              </Button>
            </Popconfirm>
            <Button
              onClick={() => onDel(record)}
              type='link'
              style={{ padding: 0, fontSize: 12 }}
            >
              {t('define.action.delete')}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Layout
      extraHeader={
        <PageHeader title={t('define.policyGroup')} breadcrumb={true} />
      }
    >
      <div className='idcos-card'>
        <Space size={16} direction='vertical' style={{ width: '100%' }}>
          <Row justify='space-between' wrap={false}>
            <Col>
              <Button type={'primary'} onClick={() => goFormPage()}>
                {t('define.addPolicyGroup')}
              </Button>
            </Col>
            <Col>
              <Input
                style={{ width: 320 }}
                allowClear={true}
                placeholder={t('define.policyGroup.search.placeholder')}
                prefix={<SearchOutlined />}
                onPressEnter={e => {
                  const q = e.target.value;
                  onChangeFormParams({ q });
                }}
              />
            </Col>
          </Row>
          <Table
            columns={columns}
            scroll={{ x: 'min-content' }}
            loading={tableLoading}
            {...tableProps}
          />
        </Space>
      </div>
    </Layout>
  );
};

export default PolicyGroupList;

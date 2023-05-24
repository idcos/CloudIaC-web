/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { memo, useState, useEffect, useContext } from 'react';
import { Button, Space, Divider, Table, Popconfirm, notification } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Eb_WP } from 'components/error-boundary';
import getPermission from 'utils/permission';
import { t } from 'utils/i18n';
import DetailPageContext from '../detail-page-context';
import styled from 'styled-components';
import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import TagModal from 'components/tag-modal';
import tagsAPI from 'services/tags';

const TagsContainer = styled.div`
  border-radius: 3px;
  margin-top: 10px;
  border: 2px solid #e1e4e8;
  .header {
    height: 53px;
    display: flex;
    align-items: center;
    padding-left: 16px;
    padding-right: 24px;
    justify-content: space-between;
    background: #fafafa;
    border-bottom: 1px solid #e1e4e8;
    .title {
      font-weight: 600;
      color: #24292f;
      line-height: 22px;
      font-size: 18px;
    }
  }
  .content {
    margin: 10px 0;
    border-top: 1px solid #e1e4e8;
  }
  .column-title {
    font-weight: 500;
    color: #24292f;
    font-size: 12px;
    line-height: 20px;
  }
  .colume-main {
    font-weight: 400;
    color: #57606a;
    line-height: 22px;
    font-size: 12px;
  }
`;

const Tags = props => {
  const { userInfo = {}, reload, envInfo } = useContext(DetailPageContext);
  const [tagModalVsible, setTagModalVsible] = useState(false);
  const [opt, setOpt] = useState('add');
  const [curRecord, setCurRecord] = useState({});
  const [tags, setTags] = useState([]);
  const { data: tagsInfo } = useRequest(
    () =>
      requestWrapper(tagsAPI.queryEnvTags.bind(null, { envId: envInfo.id }), {
        formatDataFn: res => res.result || {},
      }),
    {
      ready: !!envInfo && !!envInfo.id,
      refreshDeps: [envInfo],
    },
  );

  useEffect(() => {
    const { tokenName } = envInfo;
    const { list = [] } = tagsInfo || {};
    const _tags = list.map(tag => {
      if (tag.source === 'user') {
        return {
          ...tag,
          type: 'user',
          sourceName: 'USER',
        };
      } else {
        return {
          ...tag,
          type: 'env',
          sourceName: tokenName,
        };
      }
    });
    setTags(_tags);
  }, [tagsInfo]);

  const toggleTagModalVsible = () => {
    setTagModalVsible(!tagModalVsible);
  };

  const handleDeleteTag = param => {
    const requestParam = {
      ...param,
      objectType: 'env',
      objectId: envInfo.id,
    };
    return tagsAPI.deleteTag(requestParam);
  };
  const handleEditTag = param => {
    const requestParam = {
      ...param,
      objectType: 'env',
      objectId: envInfo.id,
      keyId: curRecord.keyId,
      valueId: curRecord.valueId,
    };
    return tagsAPI.updateTag(requestParam);
  };
  const handleaAddTag = param => {
    const requestParam = {
      ...param,
      objectType: 'env',
      objectId: envInfo.id,
    };
    return tagsAPI.addTag(requestParam);
  };
  const operation = async ({ action, payload }, cb) => {
    try {
      const method = {
        add: param => handleaAddTag(param),
        delete: param => handleDeleteTag(param),
        edit: param => handleEditTag(param),
      };
      let params = {
        ...payload,
      };
      const res = await method[action](params);
      if (res.code !== 200) {
        throw new Error(res.message_detail || res.message);
      }
      notification.success({
        message: t('define.message.opSuccess'),
      });
      reload();
      cb && cb();
    } catch (e) {
      cb && cb(e);
      notification.error({
        message: t('define.message.opFail'),
        description: e.message_detail || e.message,
      });
    }
  };
  const { PROJECT_OPERATOR } = getPermission(userInfo);
  const columns = [
    {
      title: <span className='column-title'>{t('define.key')}</span>,
      dataIndex: 'key',
      key: 'key',
      width: 230,
      render: text => <span className='column-main'>{text}</span>,
    },
    {
      title: <span className='column-title'>{t('define.value')}</span>,
      dataIndex: 'value',
      key: 'value',
      width: 500,
      render: text => <span className='column-main'>{text}</span>,
    },
    {
      title: <span className='column-title'>{t('define.source')}</span>,
      dataIndex: 'sourceName',
      key: 'sourceName',
      width: 300,
      render: text => <span className='column-main'>{text}</span>,
    },
    {
      title: '',
      render: (_, record) =>
        PROJECT_OPERATOR && record.type === 'user' ? (
          <Space split={<Divider type='vertical' />}>
            <a
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                setOpt('edit');
                toggleTagModalVsible();
                setCurRecord(record);
              }}
            >
              {t('define.action.modify')}
            </a>
            <Popconfirm
              title={t('define.tag.action.delete.confirm.title')}
              onConfirm={() => {
                console.log(record);
                operation({
                  action: 'delete',
                  payload: {
                    keyId: record.keyId,
                    valueId: record.valueId,
                  },
                });
              }}
            >
              <a style={{ whiteSpace: 'nowrap' }}>
                {t('define.action.delete')}
              </a>
            </Popconfirm>
          </Space>
        ) : (
          '-'
        ),
    },
  ];
  return (
    <TagsContainer>
      <div className='header'>
        <div className='title'>{t('define.tag')}</div>
        {PROJECT_OPERATOR && (
          <Button
            onClick={() => {
              setOpt('add');
              toggleTagModalVsible();
              setCurRecord({});
            }}
          >
            <EditOutlined />
            {t('define.addTag')}
          </Button>
        )}
      </div>
      <div className='content'>
        <Table columns={columns} dataSource={tags} pagination={false} />
      </div>
      {tagModalVsible && (
        <TagModal
          opt={opt}
          visible={tagModalVsible}
          toggleVisible={toggleTagModalVsible}
          operation={operation}
          reload={reload}
          curRecord={curRecord}
        />
      )}
    </TagsContainer>
  );
};

export default Eb_WP()(memo(Tags));

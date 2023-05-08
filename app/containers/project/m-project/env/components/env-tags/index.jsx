import React, { useState, useRef } from 'react';
import { Tag, Input, Tooltip, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import styles from './styles.less';
import classNames from 'classnames';
import { t } from 'utils/i18n';
import _isArray from 'lodash/isArray';

const EnvTags = ({
  tags,
  canEdit = false,
  fromList = false,
  update = noop,
}) => {
  const _data = tags || [];
  let data = [];
  if (_isArray(_data)) {
    data = _data;
  } else {
    data = _data.split(',').map(value => ({
      value,
      protection: false,
    }));
  }

  const [isEdit, setIsEdit] = useState(false);
  const editInputRef = useRef();

  // 新增标签
  const addTag = e => {
    const editValue = e.target.value;
    setIsEdit(false);
    if (editValue) {
      update([
        ...data,
        {
          value: editValue,
          protection: false,
        },
      ]);
    }
  };

  // 删除标签
  const delTag = index => {
    let newTags = cloneDeep(data);
    newTags.splice(index, 1);
    update(newTags);
  };

  const saveTag = (value, index) => {
    let newTags = cloneDeep(data);
    newTags.splice(index, 1, {
      value,
      protection: false,
    });
    update(newTags);
  };

  const showEditInput = () => {
    setIsEdit(true);
    setTimeout(() => {
      editInputRef.current && editInputRef.current.focus();
    }, 150);
  };

  return (data && data.length) || canEdit ? (
    <div className={styles.tags}>
      {data.map((tag, index) => {
        return (
          <EditTag
            tag={tag.value}
            canEdit={canEdit}
            protection={tag.protection}
            fromList={fromList}
            delTag={() => delTag(index)}
            saveTag={value => saveTag(value, index)}
          />
        );
      })}
      {canEdit &&
        data.length < 5 &&
        (isEdit ? (
          <Input
            ref={editInputRef}
            maxLength={20}
            type='text'
            size='small'
            className={styles.tagInput}
            onPressEnter={addTag}
            onBlur={() => setIsEdit(false)}
          />
        ) : (
          <Tag className='add-tag-btn' onClick={showEditInput}>
            <Space size={4}>
              <PlusOutlined />
              {t('define.addTag')}
            </Space>
          </Tag>
        ))}
    </div>
  ) : (
    <div></div>
  );
};

export const EditTag = ({
  canEdit,
  fromList,
  protection,
  tag,
  delTag,
  saveTag,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const editInputRef = useRef();

  const editTag = e => {
    e.preventDefault();
    if (canEdit && !protection) {
      setIsEdit(true);
      setTimeout(() => {
        editInputRef.current && editInputRef.current.focus();
      }, 150);
    }
  };

  return isEdit ? (
    <Input
      ref={editInputRef}
      key={tag}
      maxLength={20}
      size='small'
      defaultValue={tag}
      className={styles.tagInput}
      onBlur={() => setIsEdit(false)}
      onPressEnter={e => {
        setIsEdit(false);
        saveTag(e.target.value);
      }}
    />
  ) : (
    <Tag
      className={classNames({
        'can-edit': canEdit && !protection,
        'cannot-edit': !!protection || (!canEdit && !fromList),
      })}
      closable={canEdit && !protection}
      onClose={e => {
        e.preventDefault();
        delTag();
      }}
    >
      <Tooltip title={tag}>
        <span className='tag-content' onClick={editTag}>
          {tag}
        </span>
      </Tooltip>
    </Tag>
  );
};

export default EnvTags;

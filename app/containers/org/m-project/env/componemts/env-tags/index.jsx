
import React, { useState, useRef, useEffect } from 'react';
import { Tag, Input, Tooltip, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import styles from './styles.less';
import classNames from 'classnames';

export default ({
  tags,
  canEdit = false,
  update = noop
}) => {

  const data = tags ? tags.split(',') : [];
  const [ isEdit, setIsEdit ] = useState(false);
  const editInputRef = useRef();

  // 新增标签
  const addTag = (e) => {
    const editValue = e.target.value;
    setIsEdit(false);
    if (editValue) {
      update([ ...data, editValue ]);
    } 
  };

  // 删除标签
  const delTag = (index) => {
    let newTags = cloneDeep(data);
    newTags.splice(index, 1);
    update(newTags);
  };

  const saveTag = (value, index) => {
    let newTags = cloneDeep(data);
    newTags.splice(index, 1, value);
    update(newTags);
  };

  const showEditInput = () => {
    setIsEdit(true);
    setTimeout(() => {
      editInputRef.current && editInputRef.current.focus();
    }, 150);
  };

  return (
    <div className={styles.tags}>
      {data.map((tag, index) => {
        return (
          <EditTag 
            tag={tag} 
            canEdit={canEdit} 
            delTag={() => delTag(index)}
            saveTag={(value) => saveTag(value, index)}
          />
        );
      })}
      {(canEdit && data.length < 5) && (
        isEdit ? (
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
              <PlusOutlined />添加标签
            </Space>
          </Tag>
        )
      )}
    </div>
  );
};

export const EditTag = ({ canEdit, tag, delTag, saveTag }) => {

  const [ isEdit, setIsEdit ] = useState(false);
  const editInputRef = useRef();

  const editTag = (e) => {
    e.preventDefault();
    if (canEdit) {
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
      onPressEnter={(e) => {
        setIsEdit(false);
        saveTag(e.target.value);
      }}
    />
  ) : (
    <Tag
      className={classNames({ 'can-edit': canEdit })}
      closable={canEdit}
      onClose={(e) => {
        e.preventDefault();
        delTag();
      }}
    >
      <Tooltip title={tag}>
        <span
          className='tag-content'
          onClick={editTag}
        >
          {tag}
        </span>
      </Tooltip>
    </Tag>
  );

};
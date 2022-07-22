import React, { useState, useRef, useEffect } from "react";
import { Tag, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from './styles.less';
import cloneDeep from 'lodash/cloneDeep';
import { t } from 'utils/i18n';

export default ({ data, canEdit = false, update }) => {
  const [ isEdit, setIsEdit ] = useState(false);
  const [ editValue, setEditValue ] = useState('');
  const editInputRef = useRef();

  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  // 新增标签
  const handleInputConfirm = () => {
    if (editValue && update) {
      update([ ...data, editValue ]);
    } 
    resetEdit();
  };

  // 删除标签
  const delTag = (index) => {
    let newTags = cloneDeep(data);
    newTags.splice(index, 1);
    update(newTags);
  };

  const resetEdit = () => {
    setEditValue('');
    setIsEdit(false);
  };

  const showEditInput = () => {
    setIsEdit(true);
  };

  // 自动获取焦点
  useEffect(() => {
    if (isEdit && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEdit]);

  
  return (
    <>
      {data.map((tag, index) => (
        <Tag
          closable={canEdit}
          onClose={(e) => {
            e.preventDefault();
            delTag(index);
          }}
        >
          {tag}
        </Tag>
      ))}
      {(canEdit && isEdit) ? (
        <Input
          ref={editInputRef}
          type='text'
          size='small'
          className={styles.tagInput}
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      ) : null}
      {(canEdit && !isEdit) ? (
        <Tag className={styles.siteTagPlus} onClick={showEditInput}>
          <PlusOutlined /> {t('define.addTag')}
        </Tag>
      ) : null}
    </>
  );
};

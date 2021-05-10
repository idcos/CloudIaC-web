import React, { useState, useRef, useEffect } from "react";
import { Tag, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from './styles.less';

export default ({ data, canEdit = false, delTag, addTag }) => {
  const [ isEdit, setIsEdit ] = useState(false);
  const [ editValue, setEditValue ] = useState('');
  const editInputRef = useRef();

  const handleInputChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (editValue && addTag) {
      addTag(editValue);
    }
    resetEdit();
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
            delTag && delTag(index);
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
          <PlusOutlined /> 添加标签
        </Tag>
      ) : null}
    </>
  );
};

import React, { useState, useRef, useEffect } from "react";
import { Tag, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from './styles.less';
import cloneDeep from 'lodash/cloneDeep';

const { Option } = Select;

export default ({ canEdit = false, update, placeholder, onChangeSave }) => {
  let data = [];
  const [ isEdit, setIsEdit ] = useState(false);
  const [ valueData, setValueData ] = useState([]);
  const editInputRef = useRef();

  const handleInputChange = (e) => {
    setValueData(e.target.valueData);
  };

  // 新增标签
  const handleInputConfirm = () => {
    if (valueData && update) {
      update([ ...data, valueData ]);
    } 
    resetEdit();
  };

  // 删除标签
  const delTag = (tag) => {
    let newValueData = cloneDeep(valueData);
    newValueData.splice(newValueData.findIndex(d => tag === d), 1);
    setValueData(newValueData);
  };

  const resetEdit = () => {
    setValueData('');
    setIsEdit(false);
  };

  const showEditInput = () => {
    setIsEdit(true);
  };

  const clickTag = (tag) => {
    let newValueData = cloneDeep(valueData);
    newValueData.push(tag);
    setValueData(newValueData);
    onChangeSave && onChangeSave(newValueData);
  };

  return (
    <div className={styles.tagsSelect}>
      <Select 
        value={valueData}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        placeholder={placeholder}
        mode='tags'
        dropdownRender={() => (
          <div style={{ padding: '0 8px 8px 8px' }}>
            {[ 111, 22222, 3333333, 5555555, 6666666, 77777777, 88888888899, 999999 ].map((tag, index) => (
              <Tag
                style={{ marginTop: 8 }}
                closable={valueData.includes(tag)}
                onClick={() => clickTag(tag)}
                onClose={(e) => {
                  e.preventDefault();
                  delTag(tag);
                }}
              >
                {tag}
              </Tag>
            ))}</div>)}
      >
      </Select>
    </div>
  );
};

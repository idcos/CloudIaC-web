import React, { useState, useRef, useEffect } from "react";
import { Tag, Space, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from './styles.less';
import cloneDeep from 'lodash/cloneDeep';
import { pjtAPI } from "services/base";
import { changeArrByObj } from 'utils/util';

const { Option } = Select;

export default ({ canEdit = false, orgId, placeholder, onChangeSave }) => {
  let data = [];
  const [ isEdit, setIsEdit ] = useState(false);
  const [ valueData, setValueData ] = useState([]);
  const [ projectNameList, setProjectNameList ] = useState([]);
  const [ projectAllList, setProjectAllList ] = useState([]);
  const editInputRef = useRef();

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async() => {
    let res = await pjtAPI.projectList({ orgId, pageSize: 99999, pageNo: 1 });
    if (res.code === 200) {
      let arr = res.result.list || [];
      setProjectNameList(arr.map(d => d.name));
      setProjectAllList(arr);
    }
  };

  // 删除已选项目
  const delTag = (tag) => {
    let newValueData = cloneDeep(valueData);
    newValueData.splice(newValueData.findIndex(d => tag === d), 1);
    setValueData(newValueData);
    onChangeSave && onChangeSave(changeArrByObj(newValueData, projectAllList, 'id'));
  };


  // 选择项目
  const clickTag = (tag) => {
    if (valueData.includes(tag)) {
      return; 
    }
    let newValueData = cloneDeep(valueData);
    newValueData.push(tag);
    setValueData(newValueData);
    onChangeSave && onChangeSave(changeArrByObj(newValueData, projectAllList, 'id'));
  };
  // 选择项目
  const clearTags = () => {
    setValueData([]);
    onChangeSave && onChangeSave([]);
  };

  return (
    <div className={styles.tagsSelect}>
      <Select 
        value={valueData}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        placeholder={placeholder}
        mode='tags'
        removeIcon={<span></span>}
        dropdownRender={() => (
          <div className={styles.tagsBox}>
            <Space className={styles.buttonLine}><span>已选 {valueData.length} 个</span><span onClick={clearTags} className={styles.clear}>清空全部</span></Space>
            {projectNameList.length == 0 ? <div style={{ display: "block", maxHeight: 300 }}>
              {projectNameList.map((tag, index) => (
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
              ))}
            </div> : <div style={{ display: "block", maxHeight: 300 }}>
              
            </div>}
          </div>)}
      >
      </Select>
    </div>
  );
};

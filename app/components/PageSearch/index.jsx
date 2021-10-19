import React, { useEffect, useState, useMemo, useImperativeHandle } from 'react';
import { Select, Input, Col, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import isEmpty from 'lodash/isEmpty';

const { Search } = Input;
const { Option } = Select;

export default (props) => {
  const { cateList, childRef, onSearch, placeholderConfig = {} } = props || {};

  const [ type, setType ] = useState();
  const [ keyword, setKeyword ] = useState();

  useEffect(() => {
    initFormValue();
  }, [cateList]);

  useImperativeHandle(childRef, () => ({
    reset: initFormValue
  }));

  const initFormValue = () => {
    if (!isEmpty(cateList)) {
      setType(cateList[0].code);
      setKeyword(cateList[0].defaultValue || '');
    }
  };

  const handleType = (type) => {
    const { defaultValue = '' } = cateList.find((it) => it.code === type) || {};
    setKeyword(defaultValue);
    setType(type);
  };

  const handleKeyword = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = (val) => {
    if (onSearch) {
      onSearch(type, val);
    }
  };

  const searchField = useMemo(() => {
    const cateItem = cateList.find((it) => it.code === type) || {};
    const { fieldType = 'search', description, options = [], fieldConfig = {} } = cateItem;
    const searchFieldEnum = {
      search: (
        <Search
          value={keyword}
          onChange={handleKeyword}
          onSearch={handleSearch}
          style={{ width: 272 }}
          allowClear={true}
          enterButton={<SearchOutlined style={{ margin: '0 -10px' }} />}
          placeholder={placeholderConfig.search || '请输入搜索内容'}
        />
      ),
      select: (
        <>
          <Select 
            style={{ width: 240 }}  
            value={keyword}
            onChange={setKeyword}
            allowClear={true}
            placeholder={`请选择${description}`}
            {...fieldConfig}
          >
            {options.map(it => <Option value={it.value}>{it.label}</Option>)}
          </Select>
          <Button 
            type='primary'
            icon={<SearchOutlined style={{ color: '#fff' }} />} 
            onClick={() => handleSearch(keyword)}
          ></Button>
        </>
      )
    }; 
    return searchFieldEnum[fieldType || 'search'];
  }, [ keyword, placeholderConfig, type ]);

  return (
    <Col>
      <Input.Group compact={true}>
        <Select
          value={type}
          onChange={handleType}
          style={{ width: 120, textAlign: 'left' }}
          placeholder={placeholderConfig.select || '请选择查询条件'}
        >
          {cateList.map(o => (
            <Select.Option value={o.code}>{o.description}</Select.Option>
          ))}
        </Select>
        {searchField}
      </Input.Group>
    </Col>
  );
};

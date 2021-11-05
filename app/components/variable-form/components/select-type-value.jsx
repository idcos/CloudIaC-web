import React, { useEffect, useState } from 'react';
import { Select, Input, Divider, Button, Space } from 'antd';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';

const OptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectTypeValue = ({
  inputOptions,
  placeholder,
  value,
  onChange,
  isSameScope,
  form,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState();

  useEffect(() => {
    if (!isEmpty(inputOptions)) {
      setOptions(inputOptions)
    }
  }, [inputOptions]);

  const addOption = () => {
    const newOptions = [...options, inputValue];
    setOptions(newOptions);
    setInputValue();
    form.setFieldsValue({ options: newOptions });
  };

  const delOption = (e, option) => {
    e.stopPropagation();
    if (option === value) {
      onChange();
    }
    const newOptions = options.filter(item => item !== option);
    setOptions(newOptions);
    form.setFieldsValue({ options: newOptions });
  };

  return (
    <Select
      {...props}
      value={value}
      optionLabelProp='value'
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: '100%' }}
      allowClear={true}
      dropdownRender={menu => (
        <div>
          {menu}
          {
            isSameScope && (
              <>
                <Divider style={{ margin: '4px 0' }} />
                <Space style={{ padding: 8 }}>
                  <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                  <Button
                    type='link'
                    style={{ padding: 0 }}
                    disabled={!inputValue || options.includes(inputValue)}
                    onClick={addOption}
                  >
                    添加
                  </Button>
                </Space>
              </>
            )
          }
        </div>
      )}
    >
      {
        options.map(item => (
          <Select.Option key={item} value={item}>
            <OptionWrapper>
              <span>{item}</span>
              {isSameScope && <Button type='link' style={{ padding: 0 }} onClick={(e) => delOption(e, item)}>删除</Button>}
            </OptionWrapper>
          </Select.Option>
        ))
      }
    </Select>
  );
};

export default SelectTypeValue;

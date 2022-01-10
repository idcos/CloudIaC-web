import React from "react";
import { Descriptions } from 'antd';
import isFunction from 'lodash/isFunction';
import { POLICIES_SEVERITY_ENUM } from 'constants/types';

export default ({ value = {} }) => {

  const formatList = [
    { name: '错误信息', code: 'message' },
    { name: '严重等级', code: 'severity', format: (text) => POLICIES_SEVERITY_ENUM[text] || text },
    { name: '错误资源类型', code: 'resource_type' },
    { name: '文件', code: 'file' },
    { name: '行数', code: 'line' },
    { 
      name: '修复建议', 
      code: 'fixSuggestion', 
      format: (text) => <div className='idcos-format-html' dangerouslySetInnerHTML={{ __html: text }}></div> 
    }
  ];
  
  return (
    <Descriptions column={1}>
      {
        formatList.map(({ name, code, format }) => {
          if (!value[code]) { 
            return null;
          }
          return (
            <Descriptions.Item 
              style={{ padding: 0 }} 
              label={name}
              labelStyle={{ color: 'rgba(0, 0, 0, 0.86)' }}
              contentStyle={{ color: 'rgba(0, 0, 0, 0.46)' }}
            >
              {isFunction(format) ? format(value[code]) : value[code]}
            </Descriptions.Item>
          );
        })
      }
    </Descriptions>
  );
};

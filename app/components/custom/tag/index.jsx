import React, { useMemo } from 'react';
import { Tag } from 'antd';
import { CheckCircleFilled, MinusCircleFilled } from "@ant-design/icons";

const CustomTag = ({ type, icon, text }) => {

  const tagCfg = useMemo(() => {
    const tagEnum = {
      success: {
        bgColor: '#C3E6CD',
        textColor: '#108548',
        icon: <CheckCircleFilled style={{ color: '#108548' }}/>
      },
      error: {
        bgColor: '#FDD4CD',
        textColor: '#DD2B0E',
        icon: <MinusCircleFilled style={{ color: '#DD2B0E' }}/>
      }
    };
    return tagEnum[type];
  }, [type]);
  
  return (
    <Tag color={tagCfg.bgColor}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon || tagCfg.icon}
        <span style={{ color: tagCfg.textColor }}>{text}</span>
      </div>
    </Tag>
  );
};

export default CustomTag;
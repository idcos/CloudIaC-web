import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Alert, Card, Form, Table, Divider, Button, notification, Input, InputNumber, Col, Checkbox, Select, Tooltip } from 'antd';
import isEmpty from 'lodash/isEmpty';
// import { Editable } from 'am-editable';

import { ctAPI } from 'services/base';
import uuid from 'utils/uuid.js';

const { Option } = Select;

const fields = [
  {
    title: '姓名',
    id: 'name',
    width: '30%',
    editable: true,
    formItemProps: {
      rules: [{ required: true, message: '请输入姓名' }]
    }
  }
];

const VariableForm = () => {
  
  return <div className='variable'>
    <Card
      title='Terraform变量'
    >
      {/* <Editable
        defaultData={{ age: 90 }}
        value={[]}
        fields={fields}
        onChange={val => {
        }}
      /> */}
    </Card>
  </div>;
};

export default VariableForm;

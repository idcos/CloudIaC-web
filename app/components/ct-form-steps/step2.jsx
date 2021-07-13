import React, { useState, useEffect } from 'react';
import { Space, Radio, Select, Form, Input, Button, InputNumber, notification, Row, Col } from "antd";

import { ctAPI, sysAPI } from 'services/base';
import history from 'utils/history';
import VariableForm from 'components/variable-form';

export default ({ stepHelper, selection, orgId, vcsId }) => {

  const [form] = Form.useForm();

  const { selectedRows } = selection;
  const [ repoBranches, setRepoBranches ] = useState([]),
    [ ctRunnerList, setCtRunnerList ] = useState([]),
    [ submitLoading, setSubmitLoading ] = useState(false);
  
  useEffect(() => {
    // console.log(1);
  }, []);

  return <div className='variable-wrapper'>
    <VariableForm />
    <div className='btn-wrapper'>
      <Button onClick={() => stepHelper.prev()} disabled={submitLoading}>上一步</Button>
      <Button type='primary' onClick={() => stepHelper.next()}>下一步</Button>
    </div>
  </div>;
};

import React, { useState, useEffect, memo } from 'react';
import { Card, Space, Radio, Input, notification, Descriptions, Menu } from 'antd';
import history from 'utils/history';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { Eb_WP } from 'components/error-boundary';
import AnsiCoderCard from "components/coder/ansi-coder-card/index";

import { pjtAPI, ctAPI } from 'services/base';

const Index = (props) => {
  const { match, panel, routes } = props,
    { params: { orgId } } = match;
  const [ loading, setLoading ] = useState(false),
    [ resultMap, setResultMap ] = useState({
      list: [1],
      total: 0
    }),
    [ query, setQuery ] = useState({
      pageNo: 1,
      pageSize: 10,
      status: panel
    }),
    [ taskLog, setTaskLog ] = useState([]);
    

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    const res = await ctAPI.detailTask({
      orgId
    //   taskId: curTask
    });
    console.log(res, 'res');
  };
  return <div>
    <Card headStyle={{ backgroundColor: '#E3EBEB' }} type={'inner'} bodyStyle={{ padding: 0 }} title={'作业内容'}>
      <AnsiCoderCard value={taskLog} />
    </Card>
  </div>;
};

export default Eb_WP()(memo(Index));

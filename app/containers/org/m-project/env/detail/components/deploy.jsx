// import React, { useState, useEffect, memo } from 'react';
// import { Card, Space, Radio, Input, notification, Descriptions, Menu } from 'antd';
// import history from 'utils/history';
// import { Link } from 'react-router-dom';
// import moment from 'moment';

// import { Eb_WP } from 'components/error-boundary';
// import AnsiCoderCard from "components/coder/ansi-coder-card/index";

// import { pjtAPI, envAPI } from 'services/base';

// const Index = (props) => {
//   const { match, panel, routes } = props,
//     { params: { orgId, projectId, taskId } } = match;
//   const [ loading, setLoading ] = useState(false),
//     [ resultMap, setResultMap ] = useState({
//       list: [],
//       total: 0
//     }),
//     [ query, setQuery ] = useState({
//       pageNo: 1,
//       pageSize: 10,
//       status: panel
//     }),
//     [ taskLog, setTaskLog ] = useState([]);
    

//   useEffect(() => {
//     fetchLastLog();
//   }, []);

//   const fetchLastLog = async () => {
//     const res = await envAPI.envsLastLog({
//       orgId,
//       projectId,
//       taskId
//     //   taskId: curTask
//     });
//     console.log(res, 'res');
//   };
//   return <div>
//     <Card headStyle={{ backgroundColor: 'rgba(230, 240, 240, 0.7)' }} type={'inner'} bodyStyle={{ padding: 0 }} title={'作业内容'}>
//       <AnsiCoderCard value={taskLog} />
//     </Card>
//   </div>;
// };

// export default Eb_WP()(memo(Index));




import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Collapse,
  notification,
  Tag,
  Descriptions,
  Badge,
  List,
  Button,
  Input
} from "antd";
import { ctAPI } from "services/base";
import { CT } from "constants/types";
import { statusTextCls, formatCTRunner } from "utils/util";
import { timeUtils } from "utils/time";
import { useEventSource } from "utils/hooks";
import moment from "moment";
import AnsiCoderCard from "components/coder/ansi-coder-card/index";


const { Panel } = Collapse;
const { Item } = Descriptions;

const items = [
  {
    label: "作业ID",
    key: "guid"
  },
  {
    label: "作业状态",
    key: "status",
    render: (taskInfo) => {
      return (
        <>
          <Badge color={statusTextCls(taskInfo.status).color} />
          <span>{CT.taskStatus[taskInfo.status]}</span>
        </>
      );
    }
  },
  {
    label: "作业类型",
    key: "taskTupe",
    render: (taskInfo) => CT.taskType[taskInfo.taskType]
  },
  {
    label: "创建人",
    key: "creatorName"
  },
  {
    label: "创建时间",
    key: "createdAt",
    render: (taskInfo) => timeUtils.format(taskInfo.createdAt)
  },
  {
    label: "作业描述",
    key: "description"
  },
  {
    label: "仓库地址",
    key: "repoAddr"
  },
  {
    label: "分支",
    key: "repoBranch"
  },
  {
    label: "commitId",
    key: "commitId",
    span: 2
  },
  {
    label: "ct-runner",
    key: "ctServiceId",
    span: 2,
    render: (taskInfo) => {
      const { backendInfo, ctRunnerList } = taskInfo;
      const { ctServiceId } = backendInfo || {};
      return formatCTRunner(ctRunnerList, ctServiceId);
    }
  },
  {
    label: "作业运行时间",
    key: "runTime",
    span: 2,
    render: (taskInfo) => (
      <span>
        {timeUtils.format(taskInfo.createdAt)} ~{" "}
        {timeUtils.format(taskInfo.endAt)}
        耗时
      </span>
    )
  }
];

export default (props) => {
  const { match, routesParams } = props;
  const curTask = Number(match.params.curTask);
  const { params: { orgId, projectId, envId } } = match;
  const { curOrg, linkToRunningDetail, detailInfo, ctRunnerList } = routesParams;
  const [ taskInfo, setTaskInfo ] = useState({}),
    [ comments, setComments ] = useState([]),
    [ loading, setLoading ] = useState(false),
    [ taskLog, setTaskLog ] = useState([]);

  const endRef = useRef();
  const [form] = Form.useForm();
  const [ evtSource, evtSourceInit ] = useEventSource();

  useEffect(() => {
    fetchSse();
    //   fetchComments();
  }, [curTask]);


  const fetchSse = (result) => {
    evtSourceInit(
      {
        onmessage: (data) => {
          setTaskLog((prevLog) =>
            [ ...prevLog, data ]
          );
        }
        // onerror: () => {
        //   fetchInfo();
        // }
      },
      {
        url: `/api/v1/task/log/sse?id=run-c3nvra6cie6gqeidk8qg`,
        options: { withCredentials: true, headers: { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId } }
      }
    );
  };

  return (
    <div className='task'>
      <div className={"tableRender"}>
        <AnsiCoderCard value={taskLog} />
      </div>
    </div>
  );
};


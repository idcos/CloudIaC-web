import { AppstoreFilled, CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, ClockCircleFilled, AlertFilled } from '@ant-design/icons';

export const ORG_USER = {
  role: {
    member: '成员',
    owner: '管理员'
  },
  notificationType: {
    all: '全部',
    failure: '失败'
  }
};

export const SYS = {
  status: {
    passing: '正常'
  }
};
export const PROJECT_ROLE = {
  manager: 'manager',
  approver: 'approver',
  operator: 'operator',
  guest: 'guest'
};
export const AUTO_DESTROY = [
  { name: '12小时', code: '12h' },
  { name: '一天', code: '1d' },
  { name: '三天', code: '3d' },
  { name: '一周', code: '1w' },
  { name: '半个月', code: '15d' },
  { name: '一个月', code: '1m' }
];

export const destoryType = [{
  name: '无限', value: 'infinite'
}, {
  name: '小时/天', value: 'timequantum'
}, {
  name: '具体时间', value: 'time'
}];
export const ENV_STATUS = {
  'active': '活跃', 'failed': '失败', 'inactive': '不活跃'
};
export const SCOPE_ENUM = {
  org: '组织',
  project: '项目',
  template: '云模版',
  env: '环境'
};
export const TASK_STATUS = {
  "pending": '排队',
  "running": '运行中',
  "approving": '审批中',
  "failed": '失败',
  "complete": '成功'
};
export const CT = {
  taskType: {
    'plan': 'plan作业',
    'apply': 'apply作业',
    'destroy': 'destroy作业'
  },
  taskStatus: {
    all: '全部',
    complete: '成功',
    failed: '失败',
    pending: '排队',
    running: '运行中',
    timeout: '超时'
  },
  endTaskStatuList: [
    'complete',
    'failed',
    'timeout'
  ],
  taskStatusIcon: {
    all: <AppstoreFilled/>,
    complete: <CheckCircleFilled/>,
    failed: <CloseCircleFilled/>,
    pending: <ExclamationCircleFilled/>,
    running: <ClockCircleFilled/>,
    timeout: <AlertFilled/>
  }
};

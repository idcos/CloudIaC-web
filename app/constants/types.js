import { AppstoreFilled, CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, ClockCircleFilled, AlertFilled } from '@ant-design/icons';

export const ORG_USER = {
  role: {
    member: '成员',
    admin: '管理员'
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
  { name: '一个月', code: '30d' }
];

export const destoryType = [{
  name: '不限制', value: 'infinite'
}, {
  name: '小时/天', value: 'timequantum'
}, {
  name: '具体时间', value: 'time'
}];
export const ENV_STATUS = {
  'active': '活跃', 
  'failed': '失败', 
  'inactive': '不活跃',
  'running': '部署中',
  'approving': '待审批'
};
export const ENV_STATUS_COLOR = {
  'active': 'success', 
  'failed': 'error', 
  'inactive': 'gold',
  'running': 'cyan',
  'approving': 'processing'
};
export const SCOPE_ENUM = {
  org: '组织',
  project: '项目',
  template: '云模板',
  env: '环境'
};
export const DOCS = {
  quickstart: '快速入门',
  developer: '开发者文档',
  summarize: 'CloudIaC概述',
  organization: '组织',
  tpl: '云模板',
  project: '项目',
  variable: '变量',
  env: '环境',
  vcs: 'VCS',
  role: '用户和角色'
};
export const TASK_STATUS = {
  "pending": '排队',
  "running": '运行中',
  "approving": '待审批',
  "failed": '失败',
  "complete": '成功'
};
export const TASK_STATUS_COLOR = {
  "pending": 'gold',
  "running": 'cyan',
  "approving": 'processing',
  "failed": 'error',
  "complete": 'success'
};
export const TASK_TYPE = {
  'plan': 'plan作业',
  'apply': 'apply作业',
  'destroy': 'destroy作业'
};
export const END_TASK_STATUS_LIST = [
  'failed',
  'complete'
];
export const END_ENV_STATUS_LIST = [
  'active',
  'failed'
];

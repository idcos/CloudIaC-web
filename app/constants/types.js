/**
 * 全局滚动dom id
 */
export const GLOBAL_SCROLL_DOM_ID = 'global_scroll_dom_id';

export const ORG_USER = {
  role: {
    member: '成员',
    admin: '管理员'
  },
  notificationType: {
    failed: '部署失败',
    complete: '部署成功',
    approving: '等待审批',
    running: '新建部署'
  },
  subNavs: {
    email: '邮件',
    wechat: '企业微信',
    dingtalk: '钉钉',
    slack: 'Slack'
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
  'running': '执行中',
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
  "running": '执行中',
  "approving": '待审批',
  "failed": '失败',
  "complete": '成功',
  "rejected": '驳回'
};

export const TASK_STATUS_COLOR = {
  "pending": 'gold',
  "running": 'cyan',
  "approving": 'processing',
  "failed": 'error',
  "complete": 'success',
  "rejected": "warning"
};

export const TASK_TYPE = {
  'plan': 'plan作业',
  'apply': 'apply作业',
  'destroy': 'destroy作业'
};

/** 不需要长轮询获取任务信息的任务状态 */
export const END_TASK_STATUS_LIST = [
  'failed',
  'approving',
  'complete',
  'rejected'
];

export const END_ENV_STATUS_LIST = [
  'active',
  'failed'
];

/** 策略严重等级 */
export const POLICIES_SEVERITY_ENUM = {
  high: '高',
  medium: '中',
  low: '低'
};
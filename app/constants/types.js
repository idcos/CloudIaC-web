
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, CloseSquareOutlined } from '@ant-design/icons';

/**
 * 全局滚动dom id
 */
export const GLOBAL_SCROLL_DOM_ID = 'global_scroll_dom_id';

// Terraform版本自动匹配值
export const TFVERSION_AUTO_MATCH = 'tfversion_auto_match';

export const ORG_USER = {
  role: {
    member: '成员',
    admin: '管理员',
    compliancemanager: '合规管理员'
  },
  eventType: {
    'task.failed': '部署失败',
    'task.complete': '部署成功',
    'task.approving': '等待审批',
    'task.running': '新建部署',
    'task.crondrift': '配置漂移'
  },
  notificationType: {
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
  'active': '#008C5A', 
  'failed': '#DD2B0E', 
  'inactive': '#faad14',
  'running': '#08979c',
  'approving': '#548BC5'
};

export const SCOPE_ENUM = {
  org: '组织',
  project: '项目',
  template: '云模板',
  env: '环境'
};

// 目标类型
export const TARGET_TYPE_ENUM = {
  template: '云模板',
  env: '环境',
  policy: '策略'
};

// 屏蔽类型
export const SUPPRESS_TYPE_ENUM = {
  policy: '屏蔽此策略',
  source: '按来源屏蔽'
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

export const POLICIES_DETECTION = {
  pending: '检测中',
  passed: '通过',
  failed: '失败',
  violated: '不通过',
  suppressed: '已屏蔽'
};
export const POLICIES_DETECTION_COLOR = {
  pending: '#FFBF00',
  passed: '#52C41A',
  failed: '#A7282A',
  violated: '#FF3B30',
  suppressed: '#B3CDFF'
};
export const POLICIES_DETECTION_COLOR_COLLAPSE = {
  pending: '#FFBF00',
  passed: '#00AB9D',
  failed: '#FF3B30',
  violated: '#FF3B30',
  suppressed: '#c1c1c1'
};
export const POLICIES_DETECTION_COLOR_TAG = {
  pending: 'gold',
  passed: 'green',
  failed: 'volcano',
  violated: 'red',
  suppressed: 'purple'
};
export const POLICIES_DETECTION_ICON_COLLAPSE = {
  pending: <SyncOutlined />,
  passed: <CheckCircleOutlined />,
  failed: <CloseCircleOutlined />,
  violated: <CloseCircleOutlined />,
  suppressed: <CloseSquareOutlined />
};
export const DIMENSION_ENUM = {
  module: '所属模块',
  provider: 'Provider',
  type: '资源类型'
};
// 禁止扫描的合规状态
export const SCAN_DISABLE_STATUS = [ 'disable', 'pending' ];
// 禁止查看扫描详情的状态
export const SCAN_DETAIL_DISABLE_STATUS = [ 'disable', 'enable' ];

export const DEPLOY_HISTORY_SOURCE_ENUM = {
  manual: '手动执行',
  driftPlan: '漂移检测',
  driftApply: '自动纠漂',
  webhookPlan: 'PR/MR',
  webhookApply: '分支推送',
  autoDestroy: '分支推送'
};
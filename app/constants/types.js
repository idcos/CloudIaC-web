import { Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, CloseSquareOutlined } from '@ant-design/icons';
import { SeverityLowIcon, SeverityMediumIcon, SeverityHighIcon } from 'components/iconfont';
import { t } from 'utils/i18n';

/**
 * 全局滚动dom id
 */

export const IAC_PUBLICITY_HOST = 'http://10.0.2.134:3080';
export const GLOBAL_SCROLL_DOM_ID = 'global_scroll_dom_id';

// Terraform版本自动匹配值
export const TFVERSION_AUTO_MATCH = 'tfversion_auto_match';

export const ORG_USER = {
  role: {
    member: t('org.role.member'),
    admin: t('org.role.admin'),
    complianceManager: t('org.role.complianceManager')
  },
  eventType: {
    'task.failed': t('org.eventType.task.failed'),
    'task.complete': t('org.eventType.task.complete'),
    'task.approving': t('org.eventType.task.approving'),
    'task.running': t('org.eventType.task.running'),
    'task.crondrift': t('org.eventType.task.crondrift')
  },
  notificationType: {
    email: t('org.notificationType.email'),
    wechat: t('org.notificationType.wechat'),
    dingtalk: t('org.notificationType.dingtalk'),
    slack: t('org.notificationType.slack')
  }
};

export const SYS = {
  status: {
    passing: t('sys.status.normal')
  }
};

export const PROJECT_ROLE = {
  manager: t('project.role.manager'),
  approver: t('project.role.approver'),
  operator: t('project.role.operator'),
  guest: t('project.role.guest')
};

export const AUTO_DESTROY = [
  { name: t('define.autoDestroy.12h'), code: '12h' },
  { name: t('define.autoDestroy.1d'), code: '1d' },
  { name: t('define.autoDestroy.3d'), code: '3d' },
  { name: t('define.autoDestroy.1w'), code: '1w' },
  { name: t('define.autoDestroy.15d'), code: '15d' },
  { name: t('define.autoDestroy.30d'), code: '30d' }
];

export const destoryType = [{
  name: t('define.destoryType.infinite'), value: 'infinite'
}, {
  name: t('define.destoryType.timequantum'), value: 'timequantum'
}, {
  name: t('define.destoryType.time'), value: 'time'
}];

export const ENV_STATUS = {
  'active': t('env.status.active'), 
  'failed': t('env.status.failed'), 
  'inactive': t('env.status.inactive'),
  'destroyed': t('env.status.destroyed'),
  'running': t('env.status.running'),
  'approving': t('env.status.approving')
};

export const ENV_STATUS_COLOR = {
  'active': '#008C5A', 
  'failed': '#DD2B0E', 
  'inactive': '#faad14',
  'destroyed': '#24292F',
  'running': '#08979c',
  'approving': '#0969DA'
};

export const SCOPE_ENUM = {
  org: t('define.scope.org'),
  project: t('define.scope.project'),
  template: t('define.scope.template'),
  env: t('define.scope.env')
};

export const VAR_TYPE_ENUM = {
  terraform: t('define.varType.terraform'),
  environment: t('define.varType.environment')
};

// 目标类型
export const TARGET_TYPE_ENUM = {
  template: t('define.targetType.template'),
  env: t('define.targetType.env'),
  policy: t('define.targetType.policy')
};

// 屏蔽类型
export const SUPPRESS_TYPE_ENUM = {
  policy: t('define.suppressType.policy'),
  source: t('define.suppressType.source')
};

export const DOCS = {
  quickstart: t('define.docs.quickstart'),
  developer: t('define.docs.developer'),
  summarize: t('define.docs.summarize'),
  organization: t('define.docs.organization'),
  tpl: t('define.docs.tpl'),
  project: t('define.docs.project'),
  variable: t('define.docs.variable'),
  env: t('define.docs.env'),
  vcs: t('define.vcs'),
  role: t('define.docs.role')
};

export const TASK_STATUS = {
  "pending": t('task.status.pending'),
  "running": t('task.status.running'),
  "approving": t('task.status.approving'),
  "failed": t('task.status.failed'),
  "complete": t('task.status.complete'),
  "rejected": t('task.status.rejected'),
  "aborted": t('task.status.aborted')
};

export const TASK_STATUS_COLOR = {
  "pending": 'gold',
  "running": 'cyan',
  "approving": 'processing',
  "failed": 'error',
  "complete": 'success',
  "rejected": "warning",
  "aborted": 'error'
};

export const TASK_TYPE = {
  'plan': t('task.type.plan'),
  'apply': t('task.type.apply'),
  'destroy': t('task.type.destroy')
};

/** 不需要长轮询获取任务信息的任务状态 */
export const END_TASK_STATUS_LIST = [
  'failed',
  'approving',
  'complete',
  'rejected',
  'aborted'
];

export const END_ENV_STATUS_LIST = [
  'active',
  'failed'
];

/** 策略严重等级 */
export const POLICIES_SEVERITY_STATUS_ENUM = {
  high: (
    <Space size={4}>
      <SeverityHighIcon />
      <span>{t('policy.severity.high')}</span>
    </Space>
  ),
  medium: (
    <Space size={4}>
      <SeverityMediumIcon />
      <span>{t('policy.severity.medium')}</span>
    </Space>
  ),
  low: (
    <Space size={4}>
      <SeverityLowIcon />
      <span>{t('policy.severity.low')}</span>
    </Space>
  )
};

export const POLICIES_DETECTION = {
  pending: t('policy.detection.status.pending'),
  passed: t('policy.detection.status.passed'),
  failed: t('policy.detection.status.failed'),
  violated: t('policy.detection.status.violated'),
  suppressed: t('policy.detection.status.suppressed')
};
export const POLICIES_DETECTION_COLOR = {
  pending: '#FFBF00',
  passed: '#52C41A',
  failed: '#A7282A',
  violated: '#FF3B30',
  suppressed: '#B3CDFF'
};
export const POLICIES_DETECTION_ICON_COLLAPSE = {
  pending: <SyncOutlined />,
  passed: <CheckCircleOutlined />,
  failed: <CloseCircleOutlined />,
  violated: <CloseCircleOutlined />,
  suppressed: <CloseSquareOutlined />
};
export const DIMENSION_ENUM = {
  module: t('env.resource.mode.module'),
  provider: t('env.resource.mode.provider'),
  type: t('env.resource.mode.type')
};
// 禁止扫描的合规状态
export const SCAN_DISABLE_STATUS = [ 'disable', 'pending' ];
// 禁止查看扫描详情的状态
export const SCAN_DETAIL_DISABLE_STATUS = [ 'disable', 'enable' ];

export const DEPLOY_HISTORY_SOURCE_ENUM = {
  manual: t('task.triggerType.manual'),
  driftPlan: t('task.triggerType.driftPlan'),
  driftApply: t('task.triggerType.driftApply'),
  webhookPlan: t('task.triggerType.webhookPlan'),
  webhookApply: t('task.triggerType.webhookApply'),
  autoDestroy: t('task.triggerType.autoDestroy'),
  api: t('task.triggerType.api')
};
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


export const CT = {
  taskType: {
    'plan': 'plan作业',
    'apply': 'apply作业'
  },
  taskStatus: {
    all: '全部',
    complete: '成功',
    failed: '失败',
    pending: '排队',
    running: '运行中',
    timeout: '超时'
  },
  taskStatusIcon: {
    all: <AppstoreFilled/>,
    complete: <CheckCircleFilled/>,
    failed: <CloseCircleFilled/>,
    pending: <ExclamationCircleFilled/>,
    running: <ClockCircleFilled/>,
    timeout: <AlertFilled/>
  }
};

import { post, getWithArgs } from 'utils/xFetch2';

const taskAPI = {
  // 审批执行计划
  approve: ({ taskId, projectId, orgId, action }) => {
    return post(
      `/api/v1/tasks/${taskId}/approve`,
      {
        action,
      },
      { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId },
    );
  },
  // terraform Output
  getOutput: ({ orgId, projectId, taskId }) => {
    return getWithArgs(
      `/api/v1/tasks/${taskId}/output`,
      {},
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  // 获取环境资源列表
  envsTaskList: ({ envId, orgId, projectId, q, taskType, user, source }) => {
    return getWithArgs(
      `/api/v1/envs/${envId}/tasks`,
      {
        pageSize: 0,
        q,
        taskType,
        user,
        source,
      },
      { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId },
    );
  },
  // 获取环境资源图形列表
  getResourcesGraphList: ({ taskId, orgId, projectId, dimension }) => {
    return getWithArgs(
      `/api/v1/tasks/${taskId}/resources/graph`,
      {
        dimension,
      },
      { 'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId },
    );
  },
  taskComment: ({ orgId, taskId, projectId }) => {
    return getWithArgs(
      `/api/v1/tasks/${taskId}/comment`,
      {},
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  createTaskComment: ({ orgId, taskId, comment, projectId }) => {
    return post(
      `/api/v1/tasks/${taskId}/comment`,
      {
        comment,
      },
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  detail: ({ orgId, projectId, taskId }) => {
    return getWithArgs(
      `/api/v1/tasks/${taskId}`,
      {},
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  getResourcesList: ({ orgId, projectId, taskId, ...restParams }) => {
    return getWithArgs(
      `/api/v1/tasks/${taskId}/resources`,
      {
        pageSize: 0,
        ...restParams,
      },
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  getTaskSteps: ({ orgId, projectId, taskId }) => {
    return getWithArgs(
      `/api/v1/tasks/${taskId}/steps`,
      {},
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  getTaskStepLog: ({ orgId, projectId, taskId, stepId }) => {
    return getWithArgs(
      `/api/v1/tasks/${taskId}/steps/${stepId}/log`,
      {},
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
  // 任务中止
  abortTask: ({ orgId, projectId, taskId }) => {
    return post(
      `/api/v1/tasks/${taskId}/abort`,
      {},
      {
        'IaC-Org-Id': orgId,
        'IaC-Project-Id': projectId,
      },
    );
  },
};

export default taskAPI;

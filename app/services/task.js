import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const taskAPI = {
  taskComment: ({ orgId, taskId, projectId }) => {
    return getWithArgs(`/api/v1/tasks/${taskId}/comment`, {
    }, {
      'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId
    });
  },
  createTaskComment: ({ orgId, taskId, comment, projectId }) => {
    return post(`/api/v1/tasks/${taskId}/comment`, {
      comment
    }, {
      'IaC-Org-Id': orgId, 'IaC-Project-Id': projectId
    });
  },
  detail: ({ orgId, projectId, taskId }) => {
    return getWithArgs(`/api/v1/tasks/${taskId}`, {}, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  },
  getResources: ({ orgId, projectId, taskId, ...restParams }) => {
    return getWithArgs(`/api/v1/tasks/${taskId}/resources`, {
      pageSize: 99999,
      currentPage: 1,
      ...restParams
    }, {
      'IaC-Org-Id': orgId,
      'IaC-Project-Id': projectId
    });
  }
};

export default taskAPI;
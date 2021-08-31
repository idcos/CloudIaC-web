import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const notificationsAPI = {
  notificationList: ({ orgId, ...restParams }) => {
    return getWithArgs('/api/v1/notifications', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  createNotification: ({ orgId, ...restParams }) => {
    return post('/api/v1/notifications', restParams, {
      'IaC-Org-Id': orgId
    });
  },
  delNotification: ({ orgId, id }) => {
    return del(`/api/v1/notifications/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  detailNotification: ({ orgId, notificationId }) => {
    return del(`/api/v1/notifications/${notificationId}`, {}, {
      'IaC-Org-Id': orgId
    });
  }
};

export default notificationsAPI;
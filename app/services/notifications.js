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
  updateNotification: ({ orgId, notificationId, eventType, name, secret, type, url, userIds }) => {
    return put(`/api/v1/notifications/${notificationId}`, {
      eventType, name, secret, type, url, userIds
    }, {
      'IaC-Org-Id': orgId
    });
  },
  delNotification: ({ orgId, id }) => {
    return del(`/api/v1/notifications/${id}`, {}, {
      'IaC-Org-Id': orgId
    });
  },
  detailNotification: ({ orgId, notificationId }) => {
    return getWithArgs(`/api/v1/notifications/${notificationId}`, {}, {
      'IaC-Org-Id': orgId
    });
  }
};

export default notificationsAPI;
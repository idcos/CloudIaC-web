import { notification } from 'antd';

import history from "utils/history";
import getPermission from "utils/permission";
import userAPI from 'services/user';
import projectAPI from 'services/project';

const changeOrg = async ({ orgId, dispatch, needJump = true }) => {
  const userInfoRes = await userAPI.info({
    orgId
  });
  if (userInfoRes.code !== 200) {
    return notification.error({ message: '未能获取用户信息' });
  }
  const { ORG_SET } = getPermission(userInfoRes.result || {});
  const projectsRes = await projectAPI.allEnableProjects({ orgId });
  const projects = projectsRes.result || {};
  if (!ORG_SET && !(projects.list || []).length) {
    return notification.error({ message: '您在该组织下暂无可访问的项目，请尝试切换其它组织' });
  }
  dispatch({
    type: 'global/set-curOrg',
    payload: {
      orgId
    }
  });
  dispatch({
    type: 'global/set-projects',
    payload: projects
  });
  if (needJump) {
    if (ORG_SET) {
      history.push(`/org/${orgId}/m-org-ct`);
    } else {
      history.push(`/org/${orgId}/project/${projects.list[0].id}/m-project-env`);
    }
  }
};

export default changeOrg;
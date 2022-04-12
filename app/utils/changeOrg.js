import { notification } from 'antd';
import history from "utils/history";
import getPermission from "utils/permission";
import { t } from 'utils/i18n';
import userAPI from 'services/user';
import projectAPI from 'services/project';

const changeOrg = async ({ orgId, dispatch, needJump = true, menuType = 'execute' }) => {
  const userInfoRes = await userAPI.info({
    orgId
  });
  if (userInfoRes.code !== 200) {
    return notification.error({ message: t('define.message.notFoundUserInfo') });
  }
  const { ORG_SET } = getPermission(userInfoRes.result || {});
  const projectsRes = await projectAPI.allEnableProjects({ orgId });
  const projects = projectsRes.result || {};
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
    if (menuType === 'compliance') {
      history.push(`/org/${orgId}/compliance/dashboard`);
      return;
    }
    if (!ORG_SET && !(projects.list || []).length) {
      history.push(`/org/${orgId}/m-other-resource`);
      return;
    }
    if (ORG_SET) {
      history.push(`/org/${orgId}/m-org-ct`);
    } else {
      history.push(`/org/${orgId}/project/${projects.list[0].id}/m-project-env`);
    }
  }
};

export default changeOrg;
import { notification } from 'antd';
import history from 'utils/history';
import { t } from 'utils/i18n';
import userAPI from 'services/user';
import projectAPI from 'services/project';

const changeOrg = async ({
  orgId,
  dispatch,
  needJump = true,
  menuType = 'execute',
}) => {
  const userInfoRes = await userAPI.info({
    orgId,
  });
  if (userInfoRes.code !== 200) {
    return notification.error({
      message: t('define.message.notFoundUserInfo'),
    });
  }
  const projectsRes = await projectAPI.allEnableProjects({ orgId });
  const projects = projectsRes.result || {};
  dispatch({
    type: 'global/set-curOrg',
    payload: {
      orgId,
    },
  });
  dispatch({
    type: 'global/set-projects',
    payload: projects,
  });
  if (needJump) {
    if (menuType === 'compliance') {
      history.push(`/org/${orgId}/compliance/dashboard`);
    } else {
      history.push(`/org/${orgId}/m-org-overview`);
    }
  }
};

export default changeOrg;

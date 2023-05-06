import {
  LayoutOutlined,
  InteractionOutlined,
  ProjectOutlined,
  FormOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import getPermission from 'utils/permission';
import { t } from 'utils/i18n';

const getMenus = userInfo => {
  const { ORG_SET, PROJECT_OPERATOR, PROJECT_SET } = getPermission(userInfo);
  return [
    // {
    //   name: t('define.overview'),
    //   key: 'm-org-overview',
    //   icon: <ControlOutlined />
    // },
    {
      name: t('define.scope.project'),
      key: 'm-org-project',
      icon: <ProjectOutlined />,
    },
    {
      name: t('define.scope.template'),
      key: 'm-org-ct',
      icon: <LayoutOutlined />,
      isHide: !ORG_SET && !PROJECT_SET,
    },
    {
      name: t('define.variable'),
      key: 'm-org-variable',
      icon: <InteractionOutlined />,
      isHide: !ORG_SET,
    },
    {
      name: t('define.setting'),
      key: 'm-org-setting',
      icon: <FormOutlined />,
      isHide: !ORG_SET && !PROJECT_OPERATOR,
    },
    {
      name: t('define.resourceQuery'),
      key: 'm-org-resource',
      icon: <SearchOutlined />,
    },
  ].filter(it => !it.isHide);
};

export default getMenus;

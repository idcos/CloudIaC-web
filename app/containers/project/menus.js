import { CodeOutlined, LayoutOutlined, InteractionOutlined, SettingOutlined, ControlOutlined, ProjectOutlined, FormOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import getPermission from "utils/permission";
import { t } from 'utils/i18n';

const getMenus = (userInfo, { projectList }) => {
  const { PROJECT_SET } = getPermission(userInfo);
  return [
    {
      subName: t('define.projectInfo'),
      subKey: 'project',
      isHide: !PROJECT_SET && projectList.length === 0,
      emptyMenuList: [
        {
          name: t('define.createProject'),
          key: 'm-project-create',
          icon: <PlusSquareOutlined />
        }
      ],
      menuList: [
        {
          name: t('define.overview'),
          key: 'm-project-overview',
          icon: <ControlOutlined />
        },
        {
          name: t('define.scope.env'),
          key: 'm-project-env',
          icon: <CodeOutlined />
        },
        {
          name: t('define.scope.template'),
          isHide: !PROJECT_SET,
          key: 'm-project-ct',
          icon: <LayoutOutlined />
        },
        {
          name: t('define.variable'),
          key: 'm-project-variable',
          icon: <InteractionOutlined />
        },
        {
          name: t('define.setting'),
          isHide: !PROJECT_SET,
          key: 'm-project-setting',
          icon: <SettingOutlined />
        },
        {
          name: t('define.resourceQuery'),
          isHide: !PROJECT_SET,
          key: 'm-project-resource',
          icon: <SearchOutlined />
        }
      ]
    }
  ].filter(it => !it.isHide);
};

export default getMenus;

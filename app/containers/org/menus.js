import { CodeOutlined, LayoutOutlined, InteractionOutlined, SettingOutlined, ControlOutlined, ProjectOutlined, FormOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import getPermission from "utils/permission";
import { t } from 'utils/i18n';

const getMenus = (userInfo, { projectList }) => {
  const { ORG_SET, PROJECT_SET, PROJECT_OPERATOR } = getPermission(userInfo);
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
          name: t('define.scope.env'),
          key: 'm-project-env',
          icon: <CodeOutlined />
        },
        {
          name: t('define.scope.template'),
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
        }
      ]
    },
    {
      subName: t('define.orgSet'),
      subKey: 'org',
      emptyMenuList: [],
      isHide: !ORG_SET && !PROJECT_OPERATOR,
      menuList: [
        {
          name: t('define.overview'),
          key: 'm-org-overview',
          icon: <ControlOutlined />
        },
        {
          name: t('define.scope.project'),
          key: 'm-org-project',
          icon: <ProjectOutlined />,
          isHide: !ORG_SET
        },
        {
          name: t('define.scope.template'),
          key: 'm-org-ct',
          icon: <LayoutOutlined />,
          isHide: !ORG_SET
        },
        {
          name: t('define.variable'),
          key: 'm-org-variable',
          icon: <InteractionOutlined />,
          isHide: !ORG_SET
        },
        {
          name: t('define.setting'),
          key: 'm-org-setting',
          icon: <FormOutlined />,
          isHide: !ORG_SET && !PROJECT_OPERATOR
        }
      ]
    },
    {
      subName: '',
      subKey: 'other',
      emptyMenuList: [],
      menuList: [
        {
          name: t('define.overview'),
          key: 'm-other-overview',
          icon: <ControlOutlined />
        },
        {
          name: t('define.resourceQuery'),
          key: 'm-other-resource',
          icon: <SearchOutlined />
        }
      ]
    }
  ].filter(it => !it.isHide);
};

export default getMenus;

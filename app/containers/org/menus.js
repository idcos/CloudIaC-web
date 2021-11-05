import { CodeOutlined, LayoutOutlined, InteractionOutlined, SettingOutlined, ProjectOutlined, FormOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import getPermission from "utils/permission";

const getMenus = (userInfo) => {
  const { ORG_SET, PROJECT_SET } = getPermission(userInfo);
  return [
    {
      subName: '项目信息',
      subKey: 'project',
      emptyMenuList: [
        {
          name: '创建项目',
          key: 'm-project-create',
          icon: <PlusSquareOutlined />
        }
      ],
      menuList: [
        {
          name: '环境',
          key: 'm-project-env',
          icon: <CodeOutlined />
        },
        {
          name: '云模板',
          key: 'm-project-ct',
          icon: <LayoutOutlined />
        },
        {
          name: '变量',
          key: 'm-project-variable',
          icon: <InteractionOutlined />
        },
        {
          name: '设置',
          isHide: !PROJECT_SET,
          key: 'm-project-setting',
          icon: <SettingOutlined />
        }
      ]
    },
    {
      subName: '组织设置',
      subKey: 'org',
      emptyMenuList: [],
      isHide: !ORG_SET,
      menuList: [
        {
          name: '项目',
          key: 'm-org-project',
          icon: <ProjectOutlined />
        },
        {
          name: '云模板',
          key: 'm-org-ct',
          icon: <LayoutOutlined />
        },
        {
          name: '变量',
          key: 'm-org-variable',
          icon: <InteractionOutlined />
        },
        {
          name: '设定',
          key: 'm-org-setting',
          icon: <FormOutlined />
        }
      ]
    },
    {
      subName: '',
      subKey: 'other',
      emptyMenuList: [],
      menuList: [
        {
          name: '资源查询',
          key: 'm-other-resource',
          icon: <SearchOutlined />
        }
      ]
    }
  ];
};

export default getMenus;

import { CodeOutlined, LayoutOutlined, InteractionOutlined, SettingOutlined, ControlOutlined, ProjectOutlined, FormOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import getPermission from "utils/permission";

const getMenus = (userInfo, { projectList }) => {
  const { ORG_SET, PROJECT_SET, PROJECT_OPERATOR } = getPermission(userInfo);
  return [
    {
      subName: '项目信息',
      subKey: 'project',
      isHide: !PROJECT_SET && projectList.length === 0,
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
      isHide: !ORG_SET && !PROJECT_OPERATOR,
      menuList: [
        {
          name: '概览',
          key: 'm-org-overview',
          icon: <ControlOutlined />
        },
        {
          name: '项目',
          key: 'm-org-project',
          icon: <ProjectOutlined />,
          isHide: !ORG_SET
        },
        {
          name: '云模板',
          key: 'm-org-ct',
          icon: <LayoutOutlined />,
          isHide: !ORG_SET
        },
        {
          name: '变量',
          key: 'm-org-variable',
          icon: <InteractionOutlined />,
          isHide: !ORG_SET
        },
        {
          name: '设定',
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
          name: '概览',
          key: 'm-other-overview',
          icon: <ControlOutlined />
        },
        {
          name: '资源查询',
          key: 'm-other-resource',
          icon: <SearchOutlined />
        }
      ]
    }
  ].filter(it => !it.isHide);
};

export default getMenus;

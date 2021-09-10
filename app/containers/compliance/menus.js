import { CodeOutlined, LayoutOutlined, InteractionOutlined, SettingOutlined, ProjectOutlined, FormOutlined, PlusSquareOutlined } from '@ant-design/icons';
import getPermission from "utils/permission";

export const getComplianceMenus = (userInfo) => {
  return [
    {
      subName: 'none',
      subKey: 'none',
      menuList: [
        {
          name: '概览',
          key: 'dashboard',
          icon: <CodeOutlined />
        }],
      icon: <CodeOutlined />
    },
    {
      subName: '合规配置',
      subKey: 'compliance-config',
      emptyMenuList: [],
      menuList: [
        {
          name: '云模板',
          key: 'ct',
          icon: <CodeOutlined />
        },
        {
          name: '环境',
          key: 'env',
          icon: <LayoutOutlined />
        }
      ]
    },
    {
      subName: '策略管理',
      subKey: 'policy-config',
      emptyMenuList: [],
      menuList: [
        {
          name: '策略组',
          key: 'policy-group',
          icon: <ProjectOutlined />
        },
        {
          name: '策略',
          key: 'policy',
          icon: <LayoutOutlined />
        }
      ]
    }
  ];
};

import { 
  CloudOutlined, 
  LayoutOutlined, 
  ClusterOutlined, 
  ControlOutlined,
  GatewayOutlined
} from '@ant-design/icons';

export const getComplianceMenus = () => {
  return [
    {
      subName: 'none',
      subKey: 'none',
      menuList: [
        {
          name: '概览',
          key: 'dashboard',
          icon: <ControlOutlined />
        }],
      icon: <ControlOutlined />
    },
    {
      subName: '合规配置',
      subKey: 'compliance-config',
      emptyMenuList: [],
      menuList: [
        {
          name: '云模板',
          key: 'ct',
          icon: <LayoutOutlined />
        },
        {
          name: '环境',
          key: 'env',
          icon: <CloudOutlined />
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
          icon: <ClusterOutlined />
        },
        {
          name: '策略',
          key: 'policy',
          icon: <GatewayOutlined />
        }
      ]
    }
  ];
};

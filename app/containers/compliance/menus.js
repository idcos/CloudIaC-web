import { 
  CloudOutlined, 
  LayoutOutlined, 
  ClusterOutlined, 
  ControlOutlined,
  GatewayOutlined
} from '@ant-design/icons';
import { t } from 'utils/i18n';

export const getComplianceMenus = () => {
  return [
    {
      subName: 'none',
      subKey: 'none',
      menuList: [
        {
          name: t('define.overview'),
          key: 'dashboard',
          icon: <ControlOutlined />
        }],
      icon: <ControlOutlined />
    },
    {
      subName: t('define.complianceConfig'),
      subKey: 'compliance-config',
      emptyMenuList: [],
      menuList: [
        {
          name: t('define.scope.template'),
          key: 'ct',
          icon: <LayoutOutlined />
        },
        {
          name: t('define.scope.env'),
          key: 'env',
          icon: <CloudOutlined />
        }
      ]
    },
    {
      subName: t('define.policyManagement'),
      subKey: 'policy-config',
      emptyMenuList: [],
      menuList: [
        {
          name: t('define.policyGroup'),
          key: 'policy-group',
          icon: <ClusterOutlined />
        },
        {
          name: t('define.policy'),
          key: 'policy',
          icon: <GatewayOutlined />
        }
      ]
    }
  ];
};

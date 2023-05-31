import { useRequest } from 'ahooks';
import { requestWrapper } from 'utils/request';
import sysAPI from 'services/sys';

export const useRegistryCfg = () => {
  // 查询配置
  const { data: { registryAddrDB, registryAddrCfg } = {} } = useRequest(() =>
    requestWrapper(sysAPI.getRegistryAddr.bind(null)),
  );

  return {
    flag: !!(registryAddrDB || registryAddrCfg),
    registryAddrDB,
    registryAddrCfg,
  };
};

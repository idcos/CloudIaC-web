import { get, post, put, del, getWithArgs } from 'utils/xFetch2';
import sysAPI from 'services/sys';

const stackAPI = {
  list: ({ ...restParams }) => {
    return new Promise((resolve, reject) => {
      sysAPI.getRegistryAddr().then((res) => {
        const { registryAddrDB, registryAddrCfg } = res.result || {};
        let url = registryAddrCfg || registryAddrDB || '';
        if (url.endsWith('/')) {
          url = url.slice(0, -1);
        }
        if (!url) {
          return reject(new Error(`url:'${url}' invalid`));
        }
        getWithArgs(`${url}/api/v1/stacks/search`, restParams, {}).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
    // return getWithArgs('/registry/api/v1/stacks/search', restParams, {});
  },
  detail: (id) => {
    return new Promise((resolve, reject) => {
      sysAPI.getRegistryAddr().then((res) => {
        const { registryAddrDB, registryAddrCfg } = res.result || {};
        let url = registryAddrCfg || registryAddrDB || '';
        if (url.endsWith('/')) {
          url = url.slice(0, -1);
        }
        if (!url) {
          return reject(new Error(`url:'${url}' invalid`));
        }
        getWithArgs(`${url}/api/v1/stacks/${id}/detail`).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
    // return getWithArgs(`/registry/api/v1/stacks/${id}/detail`);
  },
  version: (id) => {
    return new Promise((resolve, reject) => {
      sysAPI.getRegistryAddr().then((res) => {
        const { registryAddrDB, registryAddrCfg } = res.result || {};
        let url = registryAddrCfg || registryAddrDB || '';
        if (url.endsWith('/')) {
          url = url.slice(0, -1);
        }
        if (!url) {
          return reject(new Error(`url:'${url}' invalid`));
        }
        getWithArgs(`${url}/api/v1/stacks/${id}/versions`).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
    // return getWithArgs(`/registry/api/v1/stacks/${id}/versions`);
  },
  readme: (id, params) => {
    return new Promise((resolve, reject) => {
      sysAPI.getRegistryAddr().then((res) => {
        const { registryAddrDB, registryAddrCfg } = res.result || {};
        let url = registryAddrCfg || registryAddrDB || '';
        if (url.endsWith('/')) {
          url = url.slice(0, -1);
        }
        if (!url) {
          return reject(new Error(`url:'${url}' invalid`));
        }
        getWithArgs(`${url}/api/v1/stacks/${id}/readme`).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
    // return getWithArgs(`/registry/api/v1/stacks/${id}/readme`, params);
  }
};


export default stackAPI;

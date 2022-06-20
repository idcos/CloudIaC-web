import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const stackAPI = {
  list: ({ ...restParams }) => {
    return getWithArgs('/registry/api/v1/packs/search', restParams, {});
  },
  detail: (id) => {
    return getWithArgs(`/registry/api/v1/packs/${id}/detail`);
  },
  version: (id) => {
    return getWithArgs(`/registry/api/v1/packs/${id}/versions`);
  },
  readme: (id, params) => {
    return getWithArgs(`/registry/api/v1/packs/${id}/readme`, params);
  }
};


export default stackAPI;
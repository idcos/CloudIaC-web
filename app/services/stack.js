import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const stackAPI = {
  list: ({ ...restParams }) => {
    return getWithArgs('/registry/api/v1/stacks/search', restParams, {});
  },
  detail: (id) => {
    return getWithArgs(`/registry/api/v1/stacks/${id}/detail`);
  },
  version: (id) => {
    return getWithArgs(`/registry/api/v1/stacks/${id}/versions`);
  },
  readme: (id, params) => {
    return getWithArgs(`/registry/api/v1/stacks/${id}/readme`, params);
  }
};


export default stackAPI;
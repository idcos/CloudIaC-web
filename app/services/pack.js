import { get, post, put, del, getWithArgs } from 'utils/xFetch2';

const packAPI = {
  list: ({ ...restParams }) => {
    return getWithArgs('/registry/api/v1/packs/search', restParams, {});
  },
  detail: (id) => {
    return getWithArgs(`/registry/api/v1/packs/${id}/detail`);
  }
};


export default packAPI;
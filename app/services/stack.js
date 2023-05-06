import { getWithArgs } from 'utils/xFetch2';

const stackAPI = {
  list: (url, { ...restParams }) => {
    return getWithArgs(`${url}/api/v1/stacks/search`, restParams, {
      needDefaultHeader: false,
    });
  },
  detail: (url, id) => {
    return getWithArgs(`${url}/api/v1/stacks/${id}/detail`, undefined, {
      needDefaultHeader: false,
    });
  },
  version: (url, id) => {
    return getWithArgs(`${url}/api/v1/stacks/${id}/versions`, undefined, {
      needDefaultHeader: false,
    });
  },
  readme: (url, id, params) => {
    return getWithArgs(`${url}/api/v1/stacks/${id}/readme`, undefined, {
      needDefaultHeader: false,
    });
  },
};

export default stackAPI;

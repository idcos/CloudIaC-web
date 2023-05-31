import { post, put, del, getWithArgs } from 'utils/xFetch2';
const tagsAPI = {
  addTag: ({ objectType, objectId, key, value }) => {
    return post('/api/v1/tags', { objectType, objectId, key, value });
  },

  updateTag: ({ objectType, objectId, key, value, keyId, valueId }) => {
    return put('/api/v1/tags', {
      objectType,
      objectId,
      key,
      value,
      keyId,
      valueId,
    });
  },

  deleteTag: ({ objectType, objectId, keyId, valueId }) => {
    return del('/api/v1/tags', { objectType, objectId, keyId, valueId });
  },

  queryAllTags: q => {
    return getWithArgs('/api/v1/tags', { q });
  },

  queryEnvTags: ({ envId, q }) => {
    return getWithArgs(`/api/v1/envs/${envId}/tags`, { q, pageSize: 100 });
  },
};
export default tagsAPI;

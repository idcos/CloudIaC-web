
export const requestWrapper = (apiFn) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await apiFn();
      if (res.code != 200) {
        throw new Error(res.message);
      }
      const data = res.result || {};
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};
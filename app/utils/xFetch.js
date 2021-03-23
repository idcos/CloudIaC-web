function parseJSON(res) {
  return res.json().then(jsonResult => ({ ...res, jsonResult, httpCode: res.status }));
}

async function xFetch(url, options) {
  const opts = { isEncode: true, ...options, credentials: 'include' };
  const token = localStorage['accessToken'];
  opts.headers = {
    ...opts.headers,
    'access-token': `Bearer ${token}`
  };

  if (opts.isEncode) {
    url = encodeURI(url);
  }
  const fetchResponse = await fetch(url, opts);
  const jsonResponse = await parseJSON(fetchResponse);
  if (jsonResponse.httpCode == 401) {
    // Here for your logout logic.
  } else {
    return jsonResponse.jsonResult;
  }
}

export default xFetch;

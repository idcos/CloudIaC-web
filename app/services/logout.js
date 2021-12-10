export const logout = (url) => {
  localStorage.removeItem('accessToken');
  const callbackUrl = url ? url : window.location.href;
  window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

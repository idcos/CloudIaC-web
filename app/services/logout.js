export const logout = () => {
  localStorage.removeItem('accessToken');
  const callbackUrl = window.location.href;
  window.location.href = `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
};

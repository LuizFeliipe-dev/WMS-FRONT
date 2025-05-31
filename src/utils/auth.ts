
export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('malldre_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const loadUserFromStorage = () => {
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
};

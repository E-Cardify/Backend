export const oneYearFromNow = () => {
  const now = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  return now;
};

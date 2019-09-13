export default data => {
  return data instanceof Error
    ? { text: data.toString(), variant: 'error' }
    : { text: 'Done!', variant: 'success' };
};

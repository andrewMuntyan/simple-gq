export const defaultSubmit = e => {
  e.preventDefault();
  // eslint-disable-next-line no-console
  console.warn('Default Submit handler is triggered');
};

export const defaultOnSMTH = () => {
  // eslint-disable-next-line no-console
  console.warn('Default Change handler is triggered');
};

export const noop = () => {};

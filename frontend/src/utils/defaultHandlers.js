import wait from 'waait';

export const defaultSubmit = e => {
  e.preventDefault();
  // eslint-disable-next-line no-console
  console.warn('Default Submit handler is triggered');
  return wait(5000);
};

export const defaultOnSMTH = async () => {
  // eslint-disable-next-line no-console
  console.warn('Default Change handler is triggered');
  return wait(5000);
};

export const showDevError = e => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn('Huston, we have a trouble!');
    // eslint-disable-next-line no-console
    console.error(e);
    // eslint-disable-next-line no-console
    console.warn('----------------------------');
  }
};

export const noop = () => {};

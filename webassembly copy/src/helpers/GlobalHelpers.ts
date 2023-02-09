export const checkIsNodeEnvironment = () => {
	return typeof window === 'undefined';
};

export const checkIsTestEnvironment = () => {
  return process.env.NODE_ENV === 'test';
};
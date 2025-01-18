import moment from 'moment';

export const todaysDate = () => {
  return moment(new Date()).format('YYYY-MM-DD');
};

export const getSkip = (page = 1, limit = 10) => {
  return (page - 1) * limit;
};

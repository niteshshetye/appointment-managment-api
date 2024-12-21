import moment from 'moment';

export const todaysDate = () => {
  return moment(new Date()).format('YYYY-MM-DD');
};

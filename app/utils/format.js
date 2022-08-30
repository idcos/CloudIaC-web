import moment from "moment";

export const formatDate = (time) => {
  const day = moment().diff(time, "day");
  if (day < 25) {
    return moment(time).fromNow();
  } else {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
  }
};

export const formatNumber = (val) => {
  val = val ? Number(val) : 0;
  if (val <= 10) {
    return val;
  } else if (val <= 20) {
    return '10+';
  } else if (val <= 50) {
    return '20+';
  } else if (val <= 100) {
    return '50+';
  } else if (val <= 200) {
    return '100+';
  } else if (val <= 500) {
    return '200+';
  } else if (val <= 1000) {
    return '500+';
  } else if (val <= 2000) {
    return '1000+';
  } else if (val <= 5000) {
    return '2000+';
  } else if (val <= 10000) {
    return '5000+';
  } else {
    return '10000+';
  }
};
 

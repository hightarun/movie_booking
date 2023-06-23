const moment = require("moment");

// helper function to get duration between 2 dateTime
const durationBetween = (input1, input2) => {
  let diff = moment(input1).diff(moment(input2), "hours", true);
  return diff;
};

// helper function to check if dateTime lies between 2 dateTime
const isBetweenTwoDateTime = (toCheckDate, input1, input2) => {
  return moment(toCheckDate).isBetween(
    moment(input1).local().format(),
    moment(input2).local().format(),
    null,
    []
  );
};

const isAfter = (input1, input2) => {
  return moment(input1).isAfter(moment(input2));
};

module.exports = {
  durationBetween,
  isBetweenTwoDateTime,
  isAfter,
};

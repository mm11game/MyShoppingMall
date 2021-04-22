const yearDayDate = (yeardaydate) => {
  let convertToArray = yeardaydate.split("-");
  let year = convertToArray[0];
  let day = convertToArray[1];
  let date = convertToArray[2].slice(0, 2);
  return year + "-" + day + "-" + date;
};

export default yearDayDate;

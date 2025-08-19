const dateFormat = (dateToFormat: Date) => {
  const date = new Date(dateToFormat);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
};

const dueDateClass = (dueDate: Date) => {
  //   if (!(dueDate instanceof Date) || isNaN(dueDate.getTime())) {
  //     return "";
  //   }
  const myDueDate = new Date(dueDate);
  const now = new Date();
  const nowMs = now.getTime();
  const dueDateMs = myDueDate.getTime();

  // one day in ms

  const oneDayMs = 24 * 60 * 60 * 1000;
  const isWithinOneDay = Math.abs(nowMs - dueDateMs) <= oneDayMs;
  console.log(isWithinOneDay);
  if (isWithinOneDay) {
    return "due-now";
  } else {
    return "not-due";
  }
};

export { dateFormat, dueDateClass };

const dateFormat = (dateToFormat: Date) => {
  const date = new Date(dateToFormat);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
};

export default dateFormat;

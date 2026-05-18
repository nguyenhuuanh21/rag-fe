import moment from "moment";
export const formatDate = (date) => {
  if (date === null) return null;
  return moment(date).format("DD/MM/YYYY HH:mm:ss");
};
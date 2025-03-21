export const formateDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    minute: "numeric",
    hour: "numeric",
  });
};

export const getIdFromPath = () => {
  const path = window.location.pathname;
  return path.split("/").pop();
};

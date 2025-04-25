import axiosInstance from "./axiosInstance";

export const getStatusesAPI = async () => {
  const res = await axiosInstance.get("/master/statuses");
  return res.data.data;
};

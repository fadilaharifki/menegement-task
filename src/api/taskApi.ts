import axiosInstance from "./axiosInstance";

export const getTasks = async () => {
  const res = await axiosInstance.get("9d9895f9-70eb-49d2-99f7-cb3dacca8a94");
  return res.data.data;
};

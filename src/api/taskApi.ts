import { Task } from "@/interface/TaskInterface";
import axiosInstance from "./axiosInstance";
import { v4 as uuidv4 } from "uuid";

export const getTasks = async () => {
  const res = await axiosInstance.get("9d9895f9-70eb-49d2-99f7-cb3dacca8a94");

  return res.data.data.map((task: Task) => ({
    ...task,
    uuid: uuidv4(),
  }));
};

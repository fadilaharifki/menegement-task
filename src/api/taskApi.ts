import { Task } from "@/interface/TaskInterface";
import axiosInstance from "./axiosInstance";
import { v4 as uuidv4 } from "uuid";

export const getTasks = async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data.data;
};

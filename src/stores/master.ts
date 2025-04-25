import { getStatusesAPI } from "@/api/masterApi";
import { defineStore, StoreDefinition } from "pinia";

export interface UseMasterState {
  statuses: string[];
}

export interface UseMasterActions {
  getStatuses(): Promise<void>;
}

export const useMasterStore: StoreDefinition<
  "master",
  UseMasterState,
  {},
  UseMasterActions
> = defineStore("master", {
  state: (): UseMasterState => ({
    statuses: [],
  }),

  actions: {
    async getStatuses() {
      try {
        const data = await getStatusesAPI();
        this.statuses = data;
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    },
  },

  persist: true,
});

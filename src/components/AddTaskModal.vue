<template>
  <Dialog
    header="Add Task"
    :visible="props.visible"
    @update:visible="emit('update:visible', $event)"
    modal
    :style="{ width: '50vw' }"
  >
    <form @submit.prevent="saveTask" class="flex flex-col gap-4">
      <!-- Task Title -->
      <div>
        <label for="title" class="font-semibold text-sm">Title</label>
        <input
          id="title"
          v-model="task.title"
          type="text"
          class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Task Title"
        />
      </div>

      <!-- Developer -->
      <div>
        <label for="developer" class="font-semibold text-sm">Developer</label>
        <input
          id="developer"
          v-model="task.developer"
          type="text"
          class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Developer"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- Status -->
        <div>
          <label for="status" class="font-semibold text-sm">Status</label>
          <select
            id="status"
            v-model="task.status"
            class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="Waiting for Review">Waiting for Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready to Start">Ready to Start</option>
            <option value="Pending Deploy">Pending Deploy</option>
            <option value="Done">Done</option>
            <option value="Stuck">Stuck</option>
          </select>
        </div>

        <!-- Priority -->
        <div>
          <label for="priority" class="font-semibold text-sm">Priority</label>
          <select
            id="priority"
            v-model="task.priority"
            class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <!-- Type -->
        <div>
          <label for="type" class="font-semibold text-sm">Type</label>
          <select
            id="type"
            v-model="task.type"
            class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="Feature Enhancements">Feature Enhancements</option>
            <option value="Bug">Bug</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Due Date -->
        <div>
          <label for="dueDate" class="font-semibold text-sm">Due Date</label>
          <input
            id="dueDate"
            type="date"
            v-model="task.dueDate"
            class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <!-- Estimated SP -->
        <div>
          <label for="estimatedSP" class="font-semibold text-sm"
            >Estimated SP</label
          >
          <input
            id="estimatedSP"
            v-model="task.estimatedSP"
            type="number"
            class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Estimated SP"
          />
        </div>

        <!-- Actual SP -->
        <div>
          <label for="actualSP" class="font-semibold text-sm">Actual SP</label>
          <input
            id="actualSP"
            v-model="task.actualSP"
            type="number"
            class="w-full p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Actual SP"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-2 pt-4">
        <Button
          label="Cancel"
          icon="pi pi-times"
          class="p-button-outlined p-button-sm"
          @click="onClose"
        />
        <Button
          label="Save"
          icon="pi pi-check"
          type="submit"
          class="p-button-sm"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useTaskStore } from "@/stores/task";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const storeTask = useTaskStore();

const props = defineProps<{
  visible: boolean;
}>();
const emit = defineEmits(["update:visible"]);

const task = ref({
  title: "",
  developer: "",
  status: "",
  priority: "",
  type: "",
  dueDate: "",
  estimatedSP: "",
  actualSP: "",
});

const resetTask = () => {
  task.value = {
    title: "",
    developer: "",
    status: "",
    priority: "",
    type: "",
    dueDate: "",
    estimatedSP: "",
    actualSP: "",
  };
};

const saveTask = () => {
  storeTask.createTask({
    uuid: uuidv4(),
    ...task.value,
  } as any);
  emit("update:visible", false);
  resetTask();
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "The task has been saved successfully!",
    life: 3000,
  });
};

const onClose = () => {
  console.log("Dialog closed manually");
  emit("update:visible", false);
  resetTask();
};
</script>

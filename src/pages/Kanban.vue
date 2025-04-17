<template>
  <div class="min-h-screen text-white">
    <div class="flex items-center gap-4 pb-6">
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        @click="toggleShowModal"
      >
        New Task
      </button>
      <SearchInput v-model="searchText" placeholder="Search" />
      <div id="user-dropdown-container" class="relative inline-block">
        <button
          class="text-white bg-blue-600 px-4 py-2 rounded cursor-pointer flex items-center gap-2"
          @click="toggleUserDropdown"
        >
          <span class="pi pi-user"></span> Person
        </button>

        <div
          v-if="showUserDropdown"
          class="absolute left-0 top-full z-10 mt-1 bg-white text-black rounded shadow-lg w-48 max-h-64 overflow-y-auto"
        >
          <div
            v-for="user in availableDevelopers"
            :key="user"
            class="flex items-center px-3 py-2 hover:bg-gray-100"
          >
            <input
              type="checkbox"
              :id="user"
              :value="user"
              v-model="selectedUsers"
              class="mr-2"
            />
            <label :for="user">{{ user }}</label>
          </div>
        </div>
      </div>

      <button
        class="text-white px-4 py-2 rounded cursor-pointer"
        @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
      >
        <span class="pi pi-sort-alt"></span> Sort
      </button>
    </div>

    <div>
      <div class="flex gap-4 overflow-x-auto whitespace-nowrap pb-2">
        <div
          v-for="status in statusList"
          :key="status.label"
          class="bg-slate-800 rounded-lg w-[260px] flex-none overflow-hidden"
        >
          <div :class="`${status.color} p-4 flex items-center justify-between`">
            <h3 class="font-medium">
              {{ status.label }} ({{ getTasksByStatus(status.label).length }})
            </h3>
          </div>

          <!-- Drop area -->
          <div
            class="min-h-[500px] p-2"
            @dragover.prevent
            @drop="handleDrop(status.label)"
            :class="{
              'bg-slate-700/50': dragOverStatus === status.label,
            }"
            @dragenter="dragOverStatus = status.label"
            @dragleave="dragOverStatus = null"
          >
            <div
              v-for="task in getTasksByStatus(status.label)"
              :key="task.id"
              class="bg-slate-700 rounded-lg p-4 mb-3 cursor-move"
              draggable="true"
              @dragstart="handleDragStart(task.title)"
            >
              <h4
                class="font-medium mb-2 truncate overflow-hidden"
                :title="task.title"
              >
                {{ task.title }}
              </h4>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="getPriorityClass(task.priority)"
                >
                  {{ task.priority }}
                </span>
                <span
                  v-if="task.actualSP"
                  class="px-2 py-1 rounded text-xs bg-slate-600"
                >
                  {{ task.actualSP }} SP
                </span>
                <span
                  v-if="task.estimatedSP"
                  class="px-2 py-1 rounded text-xs bg-slate-600"
                >
                  {{ task.estimatedSP }} SP
                </span>
                <span
                  class="px-2 py-1 rounded text-xs"
                  :class="getTypeClass(task.type)"
                >
                  {{ task.type }}
                </span>
              </div>
              <div class="flex items-center justify-between mt-4">
                <div
                  class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs"
                >
                  {{ task.developer.charAt(0) }}
                </div>
                <span
                  v-if="task.dueDate"
                  class="px-2 py-1 rounded text-xs bg-slate-600"
                >
                  {{ task.dueDate }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AddTaskModal v-model:visible="showModal" />
</template>

<script setup lang="ts">
import SearchInput from "../components/SearchInput.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";
import { Task } from "@/interface/TaskInterface";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import axios from "axios";
import { getTasks } from "@/api/taskApi";
import {
  getStatusClass,
  getPriorityClass,
  getTypeClass,
} from "@/utils/ClassFunction";
import { useTaskStore } from "@/stores/task";

const showModal = ref(false);
const tasks = ref<Task[]>([]);
const searchText = ref("");
const selectedSortColumn = ref<string>("title");
const sortOrder = ref<"asc" | "desc">("asc");
const loading = ref<boolean>(false);
const showUserDropdown = ref(false);
const selectedUsers = ref<string[]>([]);

const taskStore = useTaskStore();

const toggleShowModal = () => {
  showModal.value = !showModal.value;
};

const createNewTask = (): Task => ({
  uuid: "",
  title: "",
  avatar: false,
  developer: "",
  status: "",
  priority: "",
  type: "",
  estimatedSP: "",
  actualSP: "",
  isDropdownOpen: false,
  newDeveloper: "",
});

const getDeveloperCount = (dev: string) => {
  if (!dev) return 0;
  return dev.split(",").length;
};

const focusedInput = ref<{
  index: number;
  field: "estimatedSP" | "actualSP";
} | null>(null);

const handleFocus = (index: number, field: "estimatedSP" | "actualSP") => {
  focusedInput.value = { index, field };
};

const handleBlur = () => {
  focusedInput.value = null;
};

const getDisplaySP = (
  value: number | string,
  index: number,
  field: "estimatedSP" | "actualSP"
) => {
  const isFocused =
    focusedInput.value?.index === index && focusedInput.value?.field === field;
  if (typeof value === "number") {
    return isFocused ? value : `${value} SP`;
  }
  return "";
};

const availableDevelopers = ref<string[]>([
  "Isaac",
  "Grace",
  "Charlie",
  "Bob",
  "Alice",
]);

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value;
};

const filteredAndSortedTasks = computed(() => {
  const filtered = taskStore.tasks.filter((task) => {
    const matchTitle = task.title
      .toLowerCase()
      .includes(searchText.value.toLowerCase());

    const matchUser =
      selectedUsers.value.length === 0 ||
      selectedUsers.value.some((user) =>
        task.developer
          .split(",")
          .map((name) => name.trim())
          .includes(user)
      );

    return matchTitle && matchUser;
  });

  const sorted = [...filtered].sort((a, b) => {
    const valueA = a[selectedSortColumn.value];
    const valueB = b[selectedSortColumn.value];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder.value === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder.value === "asc" ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  return sorted;
});

const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.getElementById("user-dropdown-container");
  if (dropdown && !dropdown.contains(event.target as Node)) {
    showUserDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const statusList = [
  { label: "Ready to Start", color: "bg-green-600" },
  { label: "Waiting for Review", color: "bg-orange-600" },
  { label: "In Progress", color: "bg-yellow-600" },
  { label: "Pending Deploy", color: "bg-blue-600" },
  { label: "Done", color: "bg-green-600" },
  { label: "Stuck", color: "bg-red-600" },
];

const taskMap = computed(() => {
  const map = {};

  statusList.forEach((status) => {
    map[status.label] = taskStore.tasks.filter(
      (task) => task.status === status.label
    );
  });

  return map;
});

const draggedTaskId = ref(null);
const dragOverStatus = ref(null);

const handleDragStart = (taskId: string) => {
  draggedTaskId.value = taskId;
};

const handleDrop = (newStatus) => {
  if (!draggedTaskId.value) return;

  const task = taskStore.tasks.find((t) => t.title === draggedTaskId.value);
  if (task) {
    task.status = newStatus;
  }

  draggedTaskId.value = null;
  dragOverStatus.value = null;
};

const getTasksByStatus = (status) => {
  return filteredAndSortedTasks.value.filter((task) => task.status === status);
};
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0 10px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>

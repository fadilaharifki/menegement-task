<template>
  <div class="min-h-screen text-white p-6">
    <div class="flex items-center gap-4 pb-6">
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        @click="addTaskFirst"
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
      <h2 class="text-purple-400 mb-2 cursor-pointer">▼ All Task</h2>
      <table class="w-full text-sm border-separate border-spacing-y-2">
        <thead>
          <tr class="text-left text-gray-400">
            <th>
              <input class="ml-2 mr-2" type="checkbox" />
            </th>
            <th
              class="w-62 cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'title'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('title')"
            >
              Task
            </th>
            <th
              class="w-32 flex justify-center items-center cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'developer'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('developer')"
            >
              Developer
            </th>
            <th
              class="cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'status'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('status')"
            >
              Status
            </th>
            <th
              class="cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'priority'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('priority')"
            >
              Priority
            </th>
            <th
              class="cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'type'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('type')"
            >
              Type
            </th>
            <th
              class="cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'date'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('date')"
            >
              Date
            </th>
            <th
              class="cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'estimatedSP'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('estimatedSP')"
            >
              Estimated SP
            </th>
            <th
              class="cursor-pointer px-4 py-2"
              :class="
                selectedSortColumn === 'actualSP'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-200'
              "
              @click="setSortColumn('actualSP')"
            >
              Actual SP
            </th>
            <th>+</th>
          </tr>
        </thead>
        <tbody class="bg-red-500">
          <tr
            v-for="(task, index) in filteredAndSortedTasks"
            :key="index"
            class="bg-[#1c2035] rounded"
          >
            <td>
              <input
                class="ml-2 mr-2"
                type="checkbox"
                :value="index"
                v-model="selectedTasks"
              />
            </td>
            <td>
              <input
                v-model="task.title"
                type="text"
                class="bg-transparent border border-transparent focus:border-gray-600 rounded px-2 py-1 w-full text-white text-sm outline-none"
                placeholder="New Task"
              />
            </td>
            <td class="flex justify-center items-center gap-1 relative h-8">
              <span>
                <div
                  v-if="!task.developer"
                  class="w-10 h-5 cursor-pointer"
                  @click="toggleDropdown(task)"
                ></div>
                <span
                  v-if="task.developer && task.developer.trim() !== ''"
                  class="flex items-center gap-1 cursor-pointer"
                  @click="toggleDropdown(task)"
                >
                  <span
                    v-for="(dev, i) in task.developer
                      .split(',')
                      .map((dev) => dev.trim())
                      .filter((dev) => dev !== '')"
                    :key="i"
                    class="flex items-center justify-center bg-blue-500 text-white rounded-full w-5 h-5 text-xs font-semibold"
                  >
                    {{ getInitials(dev) }}
                  </span>
                </span>
              </span>

              <span v-if="task.isDropdownOpen">
                <div
                  class="absolute bg-gray-400 text-sm text-white p-1 rounded border border-gray-600 z-10 mt-2"
                  style="top: 100%; left: 0"
                >
                  <ul class="list-none p-0">
                    <li
                      v-for="dev in availableDevelopers"
                      :key="dev"
                      @click="toggleDeveloper(task, dev)"
                      :class="{
                        'bg-gray-500': task.developer
                          .split(',')
                          .map((d) => d.trim())
                          .includes(dev.trim()),
                        'hover:bg-gray-700': !task.developer
                          .split(',')
                          .map((d) => d.trim())
                          .includes(dev.trim()),
                      }"
                      class="cursor-pointer p-2"
                    >
                      {{ dev }}
                    </li>
                  </ul>
                </div>
              </span>
            </td>

            <td>
              <select
                v-model="task.status"
                class="text-white text-xs rounded px-2 py-1 outline-none"
                :class="getStatusClass(task.status)"
              >
                <option value=""></option>
                <option value="Waiting for Review">Waiting for Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready to Start">Ready to Start</option>
                <option value="Pending Deploy">Pending Deploy</option>
                <option value="Done">Done</option>
                <option value="Stuck">Ready to Start</option>
              </select>
            </td>
            <td>
              <select
                v-model="task.priority"
                class="text-white text-xs rounded px-2 py-1 outline-none"
                :class="getPriorityClass(task.priority)"
              >
                <option value=""></option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="Best Effort">Best Effort</option>
              </select>
            </td>
            <td>
              <select
                v-model="task.type"
                class="text-white text-xs rounded px-2 py-1 outline-none"
                :class="getTypeClass(task.type)"
              >
                <option value=""></option>
                <option value="Feature Enhancements">
                  Feature Enhancements
                </option>
                <option value="Other">Other</option>
                <option value="Bug">Bug</option>
              </select>
            </td>
            <td>
              <input
                type="date"
                v-model="task.dueDate"
                class="border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 p-2 rounded appearance-none text-white"
              />
            </td>
            <td>
              <input
                :value="getDisplaySP(task.estimatedSP, index, 'estimatedSP')"
                @focus="handleFocus(index, 'estimatedSP')"
                @blur="handleBlur"
                @input="
                  (e) => (task.estimatedSP = parseFloat(e.target.value) || '')
                "
                type="text"
                class="bg-transparent border border-transparent focus:border-gray-600 rounded px-2 py-1 w-full text-white text-sm outline-none"
              />
            </td>
            <td>
              <input
                :value="getDisplaySP(task.actualSP, index, 'actualSP')"
                @focus="handleFocus(index, 'actualSP')"
                @blur="handleBlur"
                @input="
                  (e) => (task.actualSP = parseFloat(e.target.value) || '')
                "
                type="text"
                class="bg-transparent border border-transparent focus:border-gray-600 rounded px-2 py-1 w-full text-white text-sm outline-none"
              />
            </td>
            <td></td>
          </tr>

          <tr
            class="bg-[#1c2035] h-8 rounded cursor-pointer hover:bg-[#252b48]"
            @click="addTask"
          >
            <td class="flex justify-between items-center h-8">
              <input class="ml-2 mr-2" type="checkbox" />
            </td>
            <td>+ Add task</td>
            <td colspan="8"></td>
          </tr>
        </tbody>

        <tfoot>
          <tr class="text-gray-400">
            <td colspan="7"></td>
            <td>{{ totalEstimatedSP }} SP <span class="text-xs">sum</span></td>
            <td>{{ totalActualSP }} SP <span class="text-xs">sum</span></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchInput from "../components/SearchInput.vue";
import { Task } from "@/interface/TaskInterface";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import axios from "axios";
import { getTasks } from "@/api/taskApi";

const tasks = ref<Task[]>([]);
const searchText = ref("");
const selectedSortColumn = ref<string>("title");
const sortOrder = ref<"asc" | "desc">("asc");
const selectAll = ref(false);
const selectedTasks = ref<number[]>([]);
const loading = ref<boolean>(false);
const showUserDropdown = ref(false);
const selectedUsers = ref<string[]>([]);

watch(selectAll, (val) => {
  if (val) {
    selectedTasks.value = tasks.value.map((_, index) => index);
  } else {
    selectedTasks.value = [];
  }
});

watch(selectedTasks, (val) => {
  selectAll.value = val.length === tasks.value.length;
});

const createNewTask = (): Task => ({
  id: Date.now(),
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

onMounted(async () => {
  loading.value = true;
  try {
    tasks.value = await getTasks();
  } catch (error) {
    console.error("Failed fetch task:", error);
  } finally {
    loading.value = false;
  }
});

const addTaskFirst = () => {
  tasks.value.unshift(createNewTask());
};

const addTask = () => {
  tasks.value.push(createNewTask());
};

const getDeveloperCount = (dev: string) => {
  if (!dev) return 0;
  return dev.split(",").length;
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "Waiting for Review":
      return "bg-orange-600";
    case "In Progress":
      return "bg-yellow-600";
    case "Ready to Start":
      return "bg-green-600";
    case "Pending Deploy":
      return "bg-blue-600";
    case "Done":
      return "bg-gray-600";
    case "Stuck":
      return "bg-red-600";
    default:
      return "bg-zinc-800";
  }
};

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-red-700";
    case "High":
      return "bg-orange-600";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-green-500";
    case "Best Effort":
      return "bg-slate-400";
    default:
      return "bg-zinc-800";
  }
};

const getTypeClass = (type: string) => {
  switch (type) {
    case "Feature Enhancements":
      return "bg-purple-700";
    case "Bug":
      return "bg-red-700";
    case "Other":
      return "bg-blue-700";
    default:
      return "bg-zinc-800";
  }
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

const totalEstimatedSP = computed(() =>
  tasks.value.reduce(
    (sum, task) =>
      typeof task.estimatedSP === "number" ? sum + task.estimatedSP : sum,
    0
  )
);

const totalActualSP = computed(() =>
  tasks.value.reduce(
    (sum, task) =>
      typeof task.actualSP === "number" ? sum + task.actualSP : sum,
    0
  )
);

const availableDevelopers = ref<string[]>([
  "Isaac",
  "Grace",
  "Charlie",
  "Bob",
  "Alice",
]);

const toggleDropdown = (task: Task) => {
  task.isDropdownOpen = !task.isDropdownOpen;
};

const toggleDeveloper = (task: Task, dev: string) => {
  const devList = task.developer.split(",").map((d) => d.trim());

  if (devList.includes(dev)) {
    task.developer = devList.filter((d) => d !== dev).join(", ");
  } else {
    task.developer = [...devList, dev].join(", ");
  }
  task.isDropdownOpen = false;
};

const getInitials = (name: string): string => {
  const names = name.split(" ");
  return names.map((n) => n.charAt(0).toUpperCase()).join("");
};

const setSortColumn = (column: string) => {
  if (selectedSortColumn.value === column) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    selectedSortColumn.value = column;
    sortOrder.value = "asc";
  }
};

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value;
};

const filteredAndSortedTasks = computed(() => {
  const filtered = tasks.value.filter((task) => {
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

<template>
  <div class="p-4 space-y-4">
    <!-- Toolbar -->
    <div class="flex items-center gap-4">
      <button class="bg-blue-600 text-white px-4 py-2 rounded">New Task</button>
      <input
        type="text"
        placeholder="Search task..."
        class="px-3 py-2 border rounded w-64"
      />
      <select class="px-3 py-2 border rounded">
        <option>All Developers</option>
      </select>
      <button class="ml-auto px-3 py-2 border rounded">Sort</button>
    </div>

    <!-- Kanban Columns -->
    <div class="flex gap-4 overflow-x-auto pb-4">
      <div
        v-for="(status, index) in statuses"
        :key="index"
        class="min-w-[250px] bg-gray-100 rounded shadow-sm"
      >
        <div class="px-4 py-2 font-bold border-b">{{ status.label }}</div>
        <div class="p-2 space-y-2">
          <!-- Contoh Card -->
          <div class="bg-white p-3 rounded shadow border">
            <div class="font-medium">New Task</div>
            <div class="text-xs text-gray-600">High · 3 SP · Feature</div>
            <div class="mt-1 text-xs text-gray-400">👤 Dev A</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const statuses = [
  { key: "ready", label: "Ready to start" },
  { key: "inProgress", label: "In Progress" },
  { key: "review", label: "Waiting for review" },
  { key: "done", label: "Done" },
];
</script>

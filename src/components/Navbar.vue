<template>
  <nav class="text-white p-4">
    <div class="container mx-auto flex items-center border-b">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="pb-2 px-5 hover:text-gray-300 flex items-center gap-2"
        :class="{
          'border-b-2 border-blue-500 -mb-px text-white':
            $route.path === item.path,
        }"
      >
        <span :class="item.icon" />
        {{ item.label }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
const navItems = [
  { path: "/", label: "Main Table", icon: "pi pi-home" },
  { path: "/kanban", label: "Kanban", icon: "pi pi-th-large" },
];
</script>

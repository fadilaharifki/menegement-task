<template>
  <nav class="text-white p-4">
    <div class="container mx-auto flex items-center border-b">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="pb-2 px-5 hover:text-gray-300"
        :class="{
          'border-b-2 border-blue-500 -mb-px text-white':
            $route.path === item.path,
        }"
      >
        {{ item.label }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
const navItems = [
  { path: "/", label: "Main Table" },
  { path: "/kanban", label: "Kanban" },
];
</script>

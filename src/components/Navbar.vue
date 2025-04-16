<template>
  <nav class="text-white p-4">
    <div class="container mx-auto flex items-center border-b">
      <router-link
        to="/"
        class="pb-2 px-5 hover:text-gray-300"
        :class="{
          'border-b-2 border-blue-500 -mb-px text-white': $route.path === '/',
        }"
      >
        Main Table
      </router-link>
      <router-link
        to="/about"
        class="pb-2 px-5 hover:text-gray-300"
        :class="{
          'border-b-2 border-blue-500 -mb-px text-white':
            $route.path === '/about',
        }"
      >
        Kanban
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

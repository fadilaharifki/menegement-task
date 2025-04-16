<template>
  <div>
    <Navbar />
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";

export default {
  name: "DefaultLayout",
  components: {
    Navbar,
  },
};
</script>

<style scoped>
/* Optional styling */
</style>

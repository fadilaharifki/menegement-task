<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    class="relative border border-gray-300 rounded px-3 py-2 flex items-center focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition"
  >
    <input
      class="w-full outline-none text-sm bg-transparent"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <span class="pi pi-search text-gray-400 ml-2"></span>
  </div>
</template>

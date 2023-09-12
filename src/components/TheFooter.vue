<script setup lang="ts">
const packageVersion = import.meta.env.PACKAGE_VERSION
</script>

<template>
  <footer class="mt-2 surface-200 flex justify-content-center">
    <p class="text-500 hover:text-700">v{{ packageVersion }}</p>
  </footer>
</template>

<style scoped>
</style>

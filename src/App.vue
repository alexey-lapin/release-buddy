<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <div class="h-full flex flex-column">
    <TheHeader/>
    <div class="flex-grow-1">
      <RouterView/>
    </div>
    <TheFooter/>
  </div>
</template>

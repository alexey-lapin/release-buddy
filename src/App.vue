<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <div class="box mt-0 flex flex-column">
    <TheHeader/>
    <div class="row content flex-grow-1">
      <RouterView/>
    </div>
    <TheFooter/>
  </div>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

.box {
  width: 1140px;
  height: 100%;
}
</style>

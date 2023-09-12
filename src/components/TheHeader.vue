<script setup lang="ts">
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TabMenu from 'primevue/tabmenu'
import type { MenuItem } from 'primevue/menuitem'

const router = useRouter()
const route = useRoute()

const active = ref(0)
const items: Ref<MenuItem[]> = ref([
  {
    label: 'Dependency Graph',
    icon: 'pi pi-fw pi-sitemap',
    route: '/dependency-graph'
  }
])
</script>

<template>
  <div class="mt-3"></div>
  <header class="header">
    <div class="flex gap-2">
<!--      <h1>👨‍👨‍👦 Release Buddy</h1>-->
      <h1>Release Buddy</h1>
      <TabMenu v-model:activeIndex="active" :model="items" />
    </div>
  </header>
</template>

<!--<style scoped>-->
<!--.header {-->
<!--  background-color: #f1f1f1;-->
<!--}-->
<!--</style>-->

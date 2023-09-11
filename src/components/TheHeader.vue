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
    icon: 'pi pi-fw pi-home',
    route: '/dependency-graph'
  }
])
</script>

<template>
  <header class="header">
    <div class="flex">
      <h1>Release Buddy</h1>
      <TabMenu v-model:activeIndex="active" :model="items" />
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #f1f1f1;
}
</style>

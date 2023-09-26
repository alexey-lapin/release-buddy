<script setup lang="ts">
import type {Ref} from 'vue'
import {ref} from 'vue'
import type {MenuItem} from 'primevue/menuitem'
import {useRoute, useRouter} from 'vue-router'
import TabMenu from 'primevue/tabmenu'
import {APP_NAME} from "@/service/Env";

const router = useRouter()
const route = useRoute()

const active = ref(0)
const items: Ref<MenuItem[]> = ref([
  {
    label: 'Dependency Build Graph',
    icon: 'pi pi-fw pi-sitemap',
    to: '/dependency-build-graph'
  },
  {
    label: 'Repo Info',
    icon: 'pi pi-fw pi-info',
    to: '/repo-info'
  }
])
</script>

<template>
  <div class="mt-3"></div>
  <header class="header">
    <div class="flex gap-2">
      <h1 class="px-2" style="cursor: pointer;" @click="router.push('/')">{{ APP_NAME }}</h1>
      <TabMenu v-model:activeIndex="active" :model="items"/>
    </div>
  </header>
</template>

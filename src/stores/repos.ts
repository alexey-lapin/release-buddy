import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type Repo from '@/model/Repo'
import type SelectableItem from '@/model/SelectableItem'

export const useReposStore = defineStore('repos', () => {
  const repos: Ref<Repo[]> = ref([
    { name: 'sspgo_domain', modules: [{ name: 'domain', type: 'LIB', dependencies: [] }] },
    {
      name: 'sspgo_cache',
      modules: [
        { name: 'cache-man-center', type: 'APP', dependencies: [] },
        { name: 'cache-server', type: 'APP', dependencies: ["com.example:domain"] }
      ]
    },
    {
      name: 'sspgo_query',
      modules: [
        { name: 'query-core', type: 'LIB', dependencies: [] },
        { name: 'query-service', type: 'APP', dependencies: ["com.exmaple:query-core", "com.example:domain"] }
      ]
    }
  ])
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const selectableItems = computed(() => {
    const items: SelectableItem[] = []
    repos.value.forEach((repo) => {
      const componentTypesCountArray = repo.modules.reduce(
        (acc, module) => {
          acc[module.type]++
          return acc
        },
        { LIB: 0, APP: 0, MIX: 0 }
      )
      const componentType =
        componentTypesCountArray.LIB === 0
          ? 'APP'
          : componentTypesCountArray.APP === 0
          ? 'LIB'
          : 'MIX'
      items.push({
        name: repo.name,
        itemType: 'REP',
        componentType: componentType,
        repo: repo.name
      })
      repo.modules.forEach((module) => {
        items.push({
          name: module.name,
          itemType: module.type,
          componentType: module.type,
          repo: repo.name
        })
      })
    })
    items.sort((a, b) => a.name.localeCompare(b.name))
    return items
  })
  const getRepoByName = (name: string) => {
    return repos.value.find((repo) => repo.name === name)
  }

  function increment() {
    count.value++
  }

  return { repos, count, doubleCount, selectableItems, getRepoByName, increment }
})

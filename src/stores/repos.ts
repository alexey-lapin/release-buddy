import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type Repo from '@/model/Repo'
import type SelectableItem from '@/model/SelectableItem'

export const useReposStore = defineStore('release-buddy-repos', () => {
  const repos: Ref<Repo[]> = ref([
    {
      repoName: 'repo_domain',
      modules: [{ name: 'domain', type: 'LIB', isRoot: false, dependencies: [] }]
    },
    {
      repoName: 'repo_cache',
      modules: [
        { name: 'cache-man-center', type: 'APP', isRoot: false, dependencies: [] },
        { name: 'cache-server', type: 'APP', isRoot: false, dependencies: ['com.example:domain'] }
      ]
    },
    {
      repoName: 'repo_query',
      modules: [
        { name: 'query-core', type: 'LIB', isRoot: false, dependencies: [] },
        {
          name: 'query-service',
          type: 'APP',
          isRoot: false,
          dependencies: ['com.exmaple:query-core', 'com.example:domain']
        }
      ]
    }
  ])

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
        name: repo.repoName,
        itemType: 'REP',
        componentType: componentType,
        repo: repo.repoName
      })
      repo.modules.forEach((module) => {
        items.push({
          name: module.name,
          itemType: module.type,
          componentType: module.type,
          repo: repo.repoName
        })
      })
    })
    items.sort((a, b) => a.name.localeCompare(b.name))
    return items
  })

  const getRepoByName = (name: string) => {
    return repos.value.find((repo) => repo.repoName === name)
  }

  return { repos, selectableItems, getRepoByName }
})

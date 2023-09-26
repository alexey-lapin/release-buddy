import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type Repo from '@/model/Repo'
import type SelectableItem from '@/model/SelectableItem'
import type TreeItem from '@/model/TreeItem'

export const useReposStore = defineStore('release-buddy-repos', () => {
  const repos: Ref<Repo[]> = ref([
    {
      repoName: 'repo_domain',
      modules: [
        {
          name: 'domain',
          type: 'LIB',
          isRoot: true,
          template: null,
          main: null,
          imageType: null,
          dependencies: []
        }
      ]
    },
    {
      repoName: 'repo_cache',
      modules: [
        {
          name: 'cache-man-center',
          type: 'APP',
          isRoot: false,
          template: null,
          main: null,
          imageType: null,
          dependencies: []
        },
        {
          name: 'cache-server',
          type: 'APP',
          isRoot: false,
          template: null,
          main: null,
          imageType: null,
          dependencies: ['com.example:domain']
        }
      ]
    },
    {
      repoName: 'repo_query',
      modules: [
        {
          name: 'query-core',
          type: 'LIB',
          isRoot: false,
          template: null,
          main: null,
          imageType: null,
          dependencies: []
        },
        {
          name: 'query-service',
          type: 'APP',
          isRoot: false,
          template: null,
          main: null,
          imageType: null,
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

  const treeItems = computed(() => {
    const items: TreeItem[] = []
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
        key: repo.repoName,
        data: {
          name: repo.repoName,
          itemType: 'REP',
          componentType: componentType,
          isRoot: null,
          template: null,
          main: null,
          dependencies: []
        },
        children: repo.modules.map((module) => {
          return {
            key: module.name,
            data: {
              name: module.name,
              itemType: module.type,
              componentType: module.type,
              isRoot: module.isRoot,
              template: module.template,
              main: module.main,
              dependencies: module.dependencies
            }
          }
        })
      })
    })
    return items
  })

  const getRepoByName = (name: string) => {
    return repos.value.find((repo) => repo.repoName === name)
  }

  return { repos, selectableItems, treeItems, getRepoByName }
})

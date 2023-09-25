import type { Ref } from 'vue'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type PersistedSelectedRepo from '@/model/PersistedSelectedRepo'

export const usePreferencesStore = defineStore(
  'release-buddy-preferences',
  () => {
    const selectedRepos: Ref<PersistedSelectedRepo[]> = ref([])
    const markedRepos: Ref<string[]> = ref([])
    const dependencyGraphViewMode: Ref<'TEXT' | 'ITEMS'> = ref('ITEMS')
    const isRepoMarked = (repoName: string) => {
      return markedRepos.value.includes(repoName)
    }
    const markRepo = (repoName: string) => {
      if (!isRepoMarked(repoName)) {
        markedRepos.value.push(repoName)
      }
    }
    const unmarkRepo = (repoName: string) => {
      if (isRepoMarked(repoName)) {
        markedRepos.value = markedRepos.value.filter(
          (markedRepoName) => markedRepoName !== repoName
        )
      }
    }
    const unmarkAllRepos = () => {
      markedRepos.value = []
    }
    return {
      selectedRepos,
      markedRepos,
      isRepoMarked,
      markRepo,
      unmarkRepo,
      unmarkAllRepos,
      dependencyGraphViewMode
    }
  },
  { persist: true }
)

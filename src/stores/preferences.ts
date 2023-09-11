import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type PersistedSelectedRepo from '@/model/PersistedSelectedRepo'

export const usePreferencesStore = defineStore(
  'preferences',
  () => {
    const selectedRepos: Ref<PersistedSelectedRepo[]> = ref([])
    return { selectedRepos }
  },
  { persist: true }
)

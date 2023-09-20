import type {Ref} from 'vue'
import {ref} from 'vue'
import {defineStore} from 'pinia'
import type PersistedSelectedRepo from '@/model/PersistedSelectedRepo'

export const usePreferencesStore = defineStore(
    'preferences',
    () => {
        const selectedRepos: Ref<PersistedSelectedRepo[]> = ref([])
        const dependencyGraphViewMode: Ref<'TEXT'|'ITEMS'> = ref('ITEMS')
        return {selectedRepos, dependencyGraphViewMode}
    },
    {persist: true}
)

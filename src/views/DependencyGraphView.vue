<script setup lang="ts">
import type { AutoCompleteCompleteEvent, AutoCompleteItemSelectEvent } from 'primevue/autocomplete'
import AutoComplete from 'primevue/autocomplete'
import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import type Repo from '@/model/Repo'
import type SelectableItem from '@/model/SelectableItem'
import type PersistedSelectedRepo from '@/model/PersistedSelectedRepo'
import type PhasedPlan from '@/model/PhasedPlan'
import InputSwitch from 'primevue/inputswitch'
import Panel from 'primevue/panel'

import SelectedRepoItem from '@/components/SelectedRepoItem.vue'
import GraphRepoItem from '@/components/GraphRepoItem.vue'
import { useReposStore } from '@/stores/repos'
import { usePreferencesStore } from '@/stores/preferences'
import { createBuildPlan } from '@/service/BuildGraph'
import ItemTypeTag from '@/components/ItemTypeTag.vue'

const autoComplete = ref('')

const reposStore = useReposStore()
const preferencesStore = usePreferencesStore()

const autoCompleteItems: Ref<SelectableItem[]> = ref([])
const selectedItems: Ref<Repo[]> = ref([])
const isTextViewMode: Ref<boolean> = ref(preferencesStore.dependencyGraphViewMode === 'TEXT')
const plan: Ref<PhasedPlan[]> = ref([])

const planStagesCount = computed(() => {
  return plan.value.length
})
const planReposCount = computed(() => {
  return plan.value.flatMap((item) => item.repos).length
})
const planModulesCount = computed(() => {
  return plan.value.flatMap((item) => item.repos).flatMap((repo) => repo.modules).length
})

watch(isTextViewMode, (newValue) => {
  preferencesStore.dependencyGraphViewMode = newValue ? 'TEXT' : 'ITEMS'
})

preferencesStore.selectedRepos.map((repo: PersistedSelectedRepo) => {
  const repoItem = reposStore.getRepoByName(repo.name)
  if (repoItem) {
    selectedItems.value.push(repoItem)
  }
})
plan.value = createBuildPlan(
  reposStore.repos,
  selectedItems.value.flatMap((item) => item.modules.map((m) => m.name))
)

const autoCompleteSearch = (event: AutoCompleteCompleteEvent) => {
  autoCompleteItems.value = event.query
    ? [
        ...reposStore.selectableItems
          .filter(
            (item) =>
              !selectedItems.value.some((selectedItem) => selectedItem.repoName === item.repo)
          )
          .filter((item) => item.name.includes(event.query))
      ]
    : [
        ...reposStore.selectableItems.filter(
          (item) => !selectedItems.value.some((selectedItem) => selectedItem.repoName === item.repo)
        )
      ]
}

const autoCompleteSelect = (event: AutoCompleteItemSelectEvent) => {
  selectedItems.value.push(reposStore.getRepoByName(event.value.repo)!)
  selectedItems.value.sort((a, b) => a.repoName.localeCompare(b.repoName))
  autoComplete.value = ''
  syncSelectedItems(selectedItems.value)
}

const onClear = () => {
  selectedItems.value = []
  syncSelectedItems(selectedItems.value)
  preferencesStore.unmarkAllRepos()
}

const onItemDelete = (name: string) => {
  selectedItems.value = selectedItems.value.filter((item) => item.repoName !== name)
  syncSelectedItems(selectedItems.value)
}

const onMarkAll = () => {
  plan.value.flatMap((item) => item.repos).forEach((repo) => {
    preferencesStore.markRepo(repo.repoName)
  })
}

const onUnmarkAll = () => {
  preferencesStore.unmarkAllRepos()
}

const syncSelectedItems = (repos: Repo[]) => {
  preferencesStore.selectedRepos = repos.map((repo) => {
    return {
      name: repo.repoName
    }
  })
  plan.value = createBuildPlan(
    reposStore.repos,
    selectedItems.value.flatMap((item) => item.modules.map((m) => m.name))
  )
}
</script>

<template>
  <div>
    <span class="mt-4 p-float-label">
      <AutoComplete
        inputId="ac"
        v-model="autoComplete"
        :suggestions="autoCompleteItems"
        optionLabel="name"
        :dropdown="true"
        @complete="autoCompleteSearch"
        @item-select="autoCompleteSelect"
        forceSelection
      >
        <template #option="slotProps">
          <div>
            <ItemTypeTag
              :type="slotProps.option.componentType"
              :label="slotProps.option.itemType"
            />
            {{ slotProps.option.name }}
          </div>
        </template>
      </AutoComplete>
      <label for="ac">Select repo or module</label>
    </span>
    <Panel class="mt-2" header="Selected repos">
      <template #icons>
        <button class="p-panel-header-icon mr-2" @click="onClear">
          <span class="pi pi-trash"></span>
        </button>
      </template>
      <div class="flex flex-wrap gap-2">
        <SelectedRepoItem
          v-for="item in selectedItems"
          :key="item.repoName"
          :repo="item"
          :isDeletable="true"
          @delete="onItemDelete"
        />
      </div>
    </Panel>
    <Panel class="mt-2" header="Repo dependency build stages">
      <template #icons>
        <div class="flex  gap-1">
          <button class="p-panel-header-icon mr-2" @click="onMarkAll">
            <span class="pi pi-check"></span>
          </button>
          <button class="p-panel-header-icon mr-2" @click="onUnmarkAll">
            <span class="pi pi-times"></span>
          </button>
          <label for="ingredient1" class="pt-1">Text Mode</label>
          <InputSwitch inputId="ingredient1" v-model="isTextViewMode" />
        </div>
      </template>
      <div
        v-if="preferencesStore.dependencyGraphViewMode === 'ITEMS'"
        class="flex flex-column gap-2"
      >
        <div v-if="plan.length">
          <h2>Summary</h2>
          <h3>Stages: {{ planStagesCount }}</h3>
          <h3>Repos: {{ planReposCount }}</h3>
          <h3>Modules: {{ planModulesCount }}</h3>
        </div>
        <div v-for="item in plan" :key="item.phase">
          <h2 class="mb-1">Stage {{ item.phase }}</h2>
          <div class="flex flex-wrap gap-2">
            <GraphRepoItem v-for="repo in item.repos" :key="repo.repoName" :repo="repo" />
          </div>
        </div>
      </div>
      <div v-if="preferencesStore.dependencyGraphViewMode === 'TEXT'">
        <div v-if="plan.length">
          <p>Stages: {{ planStagesCount }}</p>
          <p>Repos: {{ planReposCount }}</p>
          <p>Modules: {{ planModulesCount }}</p>
          <p>---</p>
        </div>
        <div v-for="item in plan" :key="item.phase">
          <p>Stage {{ item.phase }}</p>
          <p v-for="repo in item.repos" :key="repo.repoName">
            {{ preferencesStore.isRepoMarked(repo.repoName) ? '+' : '-' }} {{ repo.repoName }}
          </p>
        </div>
      </div>
    </Panel>
  </div>
</template>

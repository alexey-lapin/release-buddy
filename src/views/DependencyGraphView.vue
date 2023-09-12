<script setup lang="ts">
import type { AutoCompleteCompleteEvent, AutoCompleteItemSelectEvent } from 'primevue/autocomplete'
import AutoComplete from 'primevue/autocomplete'
import Panel from 'primevue/panel'
import type { Ref } from 'vue'
import { ref } from 'vue'
import Tag from 'primevue/tag'
import RepoItem from '@/components/RepoItem.vue'
import type Repo from '@/model/Repo'
import { useReposStore } from '@/stores/repos'
import type SelectableItem from '@/model/SelectableItem'
import { usePreferencesStore } from '@/stores/preferences'
import type PersistedSelectedRepo from '@/model/PersistedSelectedRepo'
import type PhasedPlan from '@/model/PhasedPlan'
import { createBuildPlan } from '@/service/BuildGraph'

const autoComplete = ref('')

const reposStore = useReposStore()
const preferencesStore = usePreferencesStore()

const autoCompleteItems: Ref<SelectableItem[]> = ref([])
const selectedItems: Ref<Repo[]> = ref([])

const plan: Ref<PhasedPlan[]> = ref([])

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
            (item) => !selectedItems.value.some((selectedItem) => selectedItem.name === item.repo)
          )
          .filter((item) => item.name.includes(event.query))
      ]
    : [
        ...reposStore.selectableItems.filter(
          (item) => !selectedItems.value.some((selectedItem) => selectedItem.name === item.repo)
        )
      ]
}

const autoCompleteSelect = (event: AutoCompleteItemSelectEvent) => {
  selectedItems.value.push(reposStore.getRepoByName(event.value.repo)!)
  selectedItems.value.sort((a, b) => a.name.localeCompare(b.name))
  autoComplete.value = ''
  syncSelectedItems(selectedItems.value)
}

const onClear = () => {
  selectedItems.value = []
  syncSelectedItems(selectedItems.value)
}

const onItemDelete = (name: string) => {
  selectedItems.value = selectedItems.value.filter((item) => item.name !== name)
  syncSelectedItems(selectedItems.value)
}

const syncSelectedItems = (repos: Repo[]) => {
  preferencesStore.selectedRepos = repos.map((repo) => {
    return {
      name: repo.name
    }
  })
  plan.value = createBuildPlan(
    reposStore.repos,
    selectedItems.value.flatMap((item) => item.modules.map((m) => m.name))
  )
  console.log(plan.value)
}

const getTagClass = (item: SelectableItem) => {
  switch (item.componentType) {
    case 'LIB':
      return 'tag-lib'
    case 'APP':
      return 'tag-app'
    case 'MIX':
      return 'tag-mix'
    default:
      return ''
  }
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
            <Tag :class="getTagClass(slotProps.option)"
              ><p class="mono">{{ slotProps.option.itemType }}</p></Tag
            >
            {{ slotProps.option.name }}
          </div>
        </template>
      </AutoComplete>
      <label for="ac">Enter repo or module</label>
    </span>
    <Panel class="mt-2" header="Selected repos">
      <template #icons>
        <button class="p-panel-header-icon mr-2" @click="onClear">
          <span class="pi pi-trash"></span>
        </button>
      </template>
      <div class="flex flex-wrap gap-2">
        <RepoItem
          v-for="item in selectedItems"
          :key="item.name"
          :item="item"
          :isDeletable="true"
          @delete="onItemDelete"
        />
      </div>
    </Panel>
    <Panel class="mt-2" header="Repo dependency graph">
      <template #icons>
        <button class="p-panel-header-icon mr-2">
          <span class="pi pi-cog"></span>
        </button>
      </template>
      <div class="flex flex-column gap-2">
        <div v-for="item in plan" :key="item.phase">
          <h2 class="mb-1">Stage {{ item.phase }}</h2>
          <div class="flex flex-wrap gap-2">
            <RepoItem
                v-for="repo in item.repos"
                :key="repo.name"
                :item="repo"
                :isDeletable="false"
            />
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<style scoped>
.mono {
  font-family: monospace;
}

.tag-lib {
  background: #f0ad4e;
  color: #fff;
}

.tag-app {
  background: #5bc0de;
  color: #fff;
}

.tag-mix {
  background: linear-gradient(to right, #f0ad4e, #5bc0de);
  color: #fff;
}
</style>

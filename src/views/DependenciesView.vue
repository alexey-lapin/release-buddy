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

let autoComplete = ref('')

let reposStore = useReposStore()

let autoCompleteItems: Ref<SelectableItem[]> = ref([])

let selectedItems: Ref<Repo[]> = ref([])

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
}

const onClear = () => {
  selectedItems.value = []
}

const onItemDelete = (name: string) => {
  selectedItems.value = selectedItems.value.filter((item) => item.name !== name)
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

interface Item {
  name: string
  type: string
}
</script>

<template>
  <div>
    <p>deps</p>
    <AutoComplete
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
    <Panel header="Selected">
      <template #icons>
        <button class="p-panel-header-icon p-link mr-2" @click="onClear">
          <span class="pi pi-trash"></span>
        </button>
      </template>
      <div class="flex flex-wrap gap-2">
        <RepoItem
          v-for="item in selectedItems"
          :key="item.name"
          :item="item"
          @delete="onItemDelete"
        />
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

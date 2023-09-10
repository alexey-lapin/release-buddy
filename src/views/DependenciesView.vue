<script setup lang="ts">
import type { AutoCompleteCompleteEvent } from 'primevue/autocomplete'
import AutoComplete from 'primevue/autocomplete'
import Panel from 'primevue/panel'
import type { Ref } from 'vue'
import { ref } from 'vue'
import Tag from 'primevue/tag'
import RepoItem from '@/components/RepoItem.vue'
import type Repo from '@/model/Repo'

let autocomplete = ref('')
let allItems: Repo[] = [
  { name: 'sspgo_domain', modules: [{ name: 'domain', type: 'LIB' }] },
  {
    name: 'sspgo_cache',
    modules: [
      { name: 'cache-server', type: 'APP' },
      { name: 'cache-man-center', type: 'APP' }
    ]
  }
]
let items: Ref<Repo[]> = ref([])

let selectedItems: Ref<Repo[]> = ref([])

const search = (event: AutoCompleteCompleteEvent) => {
  items.value = event.query ? allItems.filter((item) => item.name.includes(event.query)) : allItems
}

const onItemSelect = (event: any) => {
  selectedItems.value.push(event.value)
  autocomplete.value = ''
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
      v-model="autocomplete"
      :suggestions="items"
      optionLabel="name"
      :dropdown="true"
      @complete="search"
      @item-select="onItemSelect"
      forceSelection
    >
      <template #option="slotProps">
        <div>
          <Tag value="Primary">{{ slotProps.option.type }}</Tag>
          {{ slotProps.option.name }}
        </div>
      </template>
    </AutoComplete>
    <Panel header="Selected">
      <div class="flex flex-wrap gap-2">
        <RepoItem v-for="item in selectedItems" :key="item.name" :item="item" />
      </div>
    </Panel>
  </div>
</template>

<style scoped></style>

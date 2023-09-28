<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReposStore } from '@/stores/repos'
import TreeTable from 'primevue/treetable'
import Button from 'primevue/button'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import ItemTypeTag from '@/components/ItemTypeTag.vue'
import TriStateCheckbox from 'primevue/tristatecheckbox'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import ScrollTop from 'primevue/scrolltop'

const reposStore = useReposStore()

const emptyFilters = {
  name: '',
  itemType: '',
  isRoot: '',
  template: '',
  main: '',
  dependencies: ''
}

const filters = ref({ ...emptyFilters })
const nodes = reposStore.treeItems
const expandedKeys = ref({})
const types = [null, 'LIB', 'APP']
const columns = [
  { key: 'itemType', label: 'Type' },
  { key: 'isRoot', label: 'Root' },
  { key: 'template', label: 'Template' },
  { key: 'main', label: 'Main' },
  { key: 'dependencies', label: 'Deps' }
]
const selectedColumns = ref(['itemType', 'dependencies'])

const totalRepos = computed(() => nodes.length)
const totalModules = computed(() => nodes.flatMap((node) => node.children).length)

const isRootFilter = computed({
  get: () => (filters.value.isRoot == '' ? null : filters.value.isRoot === 'true'),
  set: (newValue) => {
    filters.value.isRoot = newValue == null ? '' : newValue.toString()
  }
})

const onClearFilters = () => {
  filters.value = { ...emptyFilters }
}

const onExpandAll = () => {
  expandedKeys.value = nodes.reduce((acc: { [key: string]: boolean }, node) => {
    acc[node.key] = true
    return acc
  }, {})
}
const onCollapseAll = () => {
  expandedKeys.value = {}
}
</script>

<template>
  <ScrollTop />
  <TreeTable
    v-model:filters="filters"
    :value="nodes"
    v-model:expandedKeys="expandedKeys"
    filterDisplay="row"
    :resizableColumns="true"
  >
    <template #header>
      <div class="flex gap-1">
        <Button outlined label="Clear" icon="pi pi-filter-slash" @click="onClearFilters" />
        <Button outlined label="Expand all" icon="pi pi-window-maximize" @click="onExpandAll" />
        <Button outlined label="Collapse all" icon="pi pi-window-minimize" @click="onCollapseAll" />
        <MultiSelect
          v-model="selectedColumns"
          :options="columns"
          optionLabel="label"
          optionValue="key"
          display="chip"
        />
      </div>
    </template>
    <Column field="name" header="Name" filterMatchMode="contains" headerClass="w-21rem" expander>
      <template #filter>
        <InputText v-model="filters['name']" type="text" class="p-column-filter w-full" />
      </template>
    </Column>
    <Column
      v-if="selectedColumns.includes('itemType')"
      field="itemType"
      header="Type"
      filterMatchMode="contains"
      headerClass="w-6rem"
    >
      <template #filter>
        <Dropdown
          id="type-dropdown"
          v-model="filters['itemType']"
          :options="types"
          class="p-column-filter w-full"
        >
          <template #option="slotProps">
            <ItemTypeTag
              v-if="slotProps.option"
              :type="slotProps.option"
              :label="slotProps.option"
            />
            <ItemTypeTag v-else type="NONE" label="NONE" />
          </template>
          <template #value="slotProps">
            <ItemTypeTag v-if="slotProps.value" :type="slotProps.value" :label="slotProps.value" />
          </template>
        </Dropdown>
      </template>
      <template #body="slotProps">
        <ItemTypeTag
          :type="slotProps.node.data.componentType"
          :label="slotProps.node.data.itemType"
        />
      </template>
    </Column>
    <Column
      v-if="selectedColumns.includes('isRoot')"
      field="isRoot"
      header="Root"
      filterMatchMode="contains"
      headerClass="w-6rem"
    >
      <template #filter>
        <TriStateCheckbox v-model="isRootFilter" />
      </template>
    </Column>
    <Column
      v-if="selectedColumns.includes('template')"
      field="template"
      header="Template"
      filterMatchMode="contains"
    >
      <template #filter>
        <InputText v-model="filters['template']" type="text" class="p-column-filter w-full" />
      </template>
      <template #body="slotProps">
        <p class="long-text">{{ slotProps.node.data.template }}</p>
      </template>
    </Column>
    <Column
      v-if="selectedColumns.includes('main')"
      field="main"
      header="Main"
      filterMatchMode="contains"
    >
      <template #filter>
        <InputText v-model="filters['main']" type="text" class="p-column-filter w-full" />
      </template>
      <template #body="slotProps">
        <p class="long-text">{{ slotProps.node.data.main }}</p>
      </template>
    </Column>
    <Column
      v-if="selectedColumns.includes('dependencies')"
      field="dependencies"
      header="Deps"
      filterMatchMode="contains"
    >
      <template #filter>
        <InputText v-model="filters['dependencies']" type="text" class="p-column-filter w-full" />
      </template>
      <template #body="slotProps">
        <ul v-if="slotProps.node.data.dependencies" class="dependency-list">
          <li v-for="dep in slotProps.node.data.dependencies" :key="dep" class="long-text">
            {{ dep }}
          </li>
        </ul>
      </template>
    </Column>
    <template #footer> Total: {{ totalRepos }} repos, {{ totalModules }} modules</template>
  </TreeTable>
</template>

<style scoped>
.dependency-list {
  list-style-position: inside;
}

.long-text {
  overflow: clip;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.long-text:hover {
  word-break: break-all;
  white-space: normal;
}
</style>

<style>
#type-dropdown > div {
  display: none;
}
</style>

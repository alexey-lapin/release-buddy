<script setup lang="ts">
import Tag from 'primevue/tag'
import type { ItemType, ComponentType } from '@/model/AliasTypes'

const props = defineProps<{
  type: ComponentType
  label: ItemType
}>()

const getTagClass = (type: ComponentType) => {
  switch (type) {
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
  <Tag :class="getTagClass(props.type)">
    <p class="mono">{{ props.label }}</p>
  </Tag>
</template>

<style scoped>
.mono {
  font-family: monospace;
}

.tag-lib {
  background: var(--rb-c-lib);
  color: #fff;
}

.tag-app {
  background: var(--rb-c-app);
  color: #fff;
}

.tag-mix {
  background: linear-gradient(to right, var(--rb-c-lib), var(--rb-c-app));
  color: #fff;
}
</style>

<script setup lang="ts">
import type Module from '@/model/Module'
import ItemTypeTag from '@/components/ItemTypeTag.vue'

const props = defineProps<{
  module: Module
}>()
</script>

<template>
  <table class="table-auto">
    <tbody>
      <tr>
        <td class="font-bold">Name</td>
        <td>{{ props.module?.name }}</td>
      </tr>
      <tr>
        <td class="font-bold">Type</td>
        <td>
          <ItemTypeTag :type="props.module?.type" :label="props.module?.type" />
        </td>
      </tr>
      <tr>
        <td class="font-bold">Is Root</td>
        <td>{{ props.module?.isRoot }}</td>
      </tr>
      <tr>
        <td class="font-bold">Template</td>
        <td>{{ props.module?.template }}</td>
      </tr>
      <tr>
        <td class="font-bold">Main</td>
        <td>{{ props.module?.main }}</td>
      </tr>
      <tr>
        <td class="font-bold">Image Type</td>
        <td>{{ props.module?.imageType }}</td>
      </tr>
      <tr>
        <td class="font-bold">Dependencies</td>
        <td>
          <ul>
            <li v-for="dep in props.module?.dependencies" :key="dep">{{ dep }}</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</template>

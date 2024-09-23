<script setup lang="ts">
  import {
    type TableColumn,
    TableAction,
    type TableRow
  } from '@/components/types';

  interface Props {
    columns: TableColumn[];
    rows: TableRow[];
    actions?: TableAction[];
  }

  interface Emits {
    (event: 'onAction', value: { type: TableAction; value: TableRow }): void;
    (event: 'onSearch', value: string): void;
  }

  defineProps<Props>();

  const emits = defineEmits<Emits>();

  function onSearch(event: Event) {
    emits('onSearch', (event.target as HTMLInputElement).value);
  }
</script>

<template>
  <div class="base-table">
    <div class="base-table__header">
      <slot name="header" />
      <input type="text" placeholder="Search..." @change="onSearch" />
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <template v-for="column in columns" :key="column.key">
            <template v-if="column.key === 'action'">
              <td>
                <button
                  v-for="action in actions"
                  :key="action"
                  @click="emits('onAction', { type: action, value: row })"
                >
                  {{ action }}
                </button>
              </td>
            </template>
            <td v-else-if="column.renderFunction">
              {{ column.renderFunction(row[column.key]) }}
            </td>
            <td v-else>
              {{ row[column.key] }}
            </td>
          </template>
        </tr>
      </tbody>
    </table>
    <div class="base-table__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .base-table {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>

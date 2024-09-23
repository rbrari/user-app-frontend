<script setup lang="ts">
  import {
    type TableColumn,
    TableAction,
    type TableRow
  } from '@/components/types';
  import BaseIcon from '@/components/BaseIcon.vue';

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
      <input type="text" placeholder="Search..." @input="onSearch" />
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
              <td class="action">
                <button
                  v-for="action in actions"
                  :key="action"
                  :class="`base-btn base-btn--action ${action}`"
                  @click="emits('onAction', { type: action, value: row })"
                >
                  <BaseIcon :type="action" :height="18">
                    {{ action }}
                  </BaseIcon>
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
        <tr v-if="!rows.length">
          <td :colspan="columns.length">No data available</td>
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
    overflow: auto;
    @include scrollbar-on-hover;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-block: 0.8rem;
    }

    table {
      width: 100%;
      border-spacing: 0 0.8rem;

      th {
        text-align: left;
        padding: 1.2rem;
        background-color: var(--background-color);
        font-size: 1.4rem;
        font-weight: 500;
        color: var(--text-color);
      }

      tr {
        background-color: var(--color-white);

        td {
          font-size: 1.2rem;
          font-weight: 400;
          color: var(--text-color);

          padding: 1.2rem;
          border-top: 0.1rem solid var(--table-border-color);
          border-bottom: 0.1rem solid var(--table-border-color);

          &.action {
            display: flex;
            gap: 0.4rem;
            text-align: center;
          }

          &:first-child {
            border-left: 0.1rem solid var(--table-border-color);
            border-top-left-radius: 0.6rem;
            border-bottom-left-radius: 0.6rem;
          }

          &:last-child {
            border-right: 0.1rem solid var(--table-border-color);
            border-top-right-radius: 0.6rem;
            border-bottom-right-radius: 0.6rem;
          }
        }
      }
    }
  }
</style>

<script setup lang="ts">
  import BaseTable from '@/components/BaseTable.vue';
  import { TableAction, TableRow } from '@/components/types';
  import { UserAction, type TableUser } from '@/modules/User/helpers';

  interface Props {
    users: TableUser[];
  }

  interface Emits {
    (event: 'onAction', value: { type: TableAction; value: TableUser }): void;
    (event: 'onAction', value: { type: UserAction }): void;
    (event: 'onSearch', value: string): void;
  }

  defineProps<Props>();

  const emits = defineEmits<Emits>();

  const columns = [
    { key: 'action', label: 'Action' },
    { key: 'name', label: 'First Name' },
    { key: 'surname', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'birthday', label: 'Birthday' },
    { key: 'education', label: 'Education Level' },
    {
      key: 'lastUpdated',
      label: 'Updated At',
      renderFunction: (date: string) => new Date(date).toLocaleString()
    }
  ];

  const activeActions: TableAction[] = [TableAction.EDIT, TableAction.DELETE];

  function onAction(data: { type: TableAction; value: TableRow }) {
    emits('onAction', { type: data.type, value: data.value as TableUser });
  }
</script>

<template>
  <div id="users-list">
    <BaseTable
      :columns="columns"
      :rows="users"
      :actions="activeActions"
      @onAction="onAction"
      @onSearch="emits('onSearch', $event)"
    >
      <template #header>
        <button
          class="base-btn base-btn--primary"
          @click="emits('onAction', { type: UserAction.CREATE })"
        >
          + Add User
        </button>
      </template>
    </BaseTable>
  </div>
</template>

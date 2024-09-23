<script setup lang="ts">
  import UserList from '@/modules/User/components/UserList.vue';
  import UserFormModal from '@/modules/User/components/UserFormModal.vue';
  import { ref, onBeforeMount } from 'vue';
  import { useUserStore } from '@/modules/User/store';
  import { TableAction } from '@/components/types';
  import {
    type User,
    UserAction,
    type TableUser
  } from '@/modules/User/helpers';

  const userStore = useUserStore();
  const userFormRef = ref<InstanceType<typeof UserFormModal>>();

  onBeforeMount(() => {
    userStore.loadUsers();
  });

  function onUserListAction(data: {
    type: UserAction | TableAction;
    value?: User;
  }) {
    switch (data.type) {
      case UserAction.CREATE:
      case TableAction.EDIT:
        userFormRef.value?.open(data.value);
        break;
      case TableAction.DELETE:
        if (!data.value?.id) {
          return;
        }
        userStore.deleteUser(data.value.id);
        break;
    }
  }

  function onUserFormAction(user: User) {
    if (user.id) {
      userStore.updateUser(user as TableUser);
    } else {
      userStore.createUser(user);
    }
  }
</script>

<template>
  <div class="users">
    <UserList
      :users="userStore.filteredUsers"
      @onAction="onUserListAction"
      @onSearch="userStore.searchQuery = $event"
    />
    <UserFormModal ref="userFormRef" @onSave="onUserFormAction" />
  </div>
</template>

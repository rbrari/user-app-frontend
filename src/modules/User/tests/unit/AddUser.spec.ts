import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Users from '@/modules/User/Index.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useUserStore } from '@/modules/User/store';
import { EducationLevel, type User } from '@/modules/User/helpers';

describe('AddUser Flow', () => {
  let wrapper: VueWrapper<any>;
  let userStore: ReturnType<typeof useUserStore>;

  const initialUsers: User[] = [
    {
      id: '1',
      name: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      birthday: '1990-05-15',
      education: EducationLevel.Bachelor,
      lastUpdated: '2024-04-01T10:00:00Z'
    }
  ];

  const newUser: User = {
    name: 'Alice',
    surname: 'Brown',
    email: 'alice.brown@example.com',
    birthday: '1992-08-20',
    education: EducationLevel.Master
  };

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      if (key === 'users') {
        return JSON.stringify(initialUsers);
      }
      return null;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    userStore = useUserStore();

    wrapper = mount(Users, {
      global: {
        plugins: [pinia]
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds a new user successfully when valid data is submitted', async () => {
    await userStore.loadUsers();
    expect(userStore.filteredUsers).toHaveLength(initialUsers.length);

    wrapper.vm.onUserFormAction(newUser);

    expect(userStore.filteredUsers).toHaveLength(initialUsers.length + 1);
    expect(userStore.filteredUsers[0].name).toBe('Alice');
  });
});

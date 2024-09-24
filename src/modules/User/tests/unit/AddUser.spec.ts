import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Users from '@/modules/User/Index.vue';
import UserList from '@/modules/User/components/UserList.vue';
import UserFormModal from '@/modules/User/components/UserFormModal.vue';
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
    // Initialize Pinia
    const pinia = createPinia();
    setActivePinia(pinia);

    // Mock localStorage.getItem
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      if (key === 'users') {
        return JSON.stringify(initialUsers);
      }
      if (key === 'setInitialData') {
        return null;
      }
      return null;
    });

    // Mock localStorage.setItem
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Initialize the store
    userStore = useUserStore();

    // Mount the Users component
    wrapper = mount(Users, {
      global: {
        plugins: [pinia],
        components: {
          UserList,
          UserFormModal
        },
        stubs: {
          BaseTable: {
            template: `
              <div>
                <slot name="header"></slot>
                <slot />
              </div>
            `
          }
        }
      }
    });
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  it('adds a new user successfully when valid data is submitted', async () => {
    // Use fake timers to control asynchronous operations
    vi.useFakeTimers();

    // Load initial users
    const loadUsersPromise = userStore.loadUsers();
    vi.runAllTimers(); // Fast-forward timers to resolve setTimeout
    await loadUsersPromise;

    // Verify initial users are loaded
    expect(userStore.filteredUsers).toHaveLength(initialUsers.length);
    expect(userStore.filteredUsers[0].name).toBe('John');

    // Find the UserList component
    const userList = wrapper.findComponent(UserList);
    expect(userList.exists()).toBe(true);

    // Find the "+ Add User" button within UserList
    const addButton = userList.find('button');
    expect(addButton.exists()).toBe(true);
    expect(addButton.text()).toBe('+ Add User');

    // Simulate clicking the "+ Add User" button
    await addButton.trigger('click');

    // Find the UserFormModal component
    const userFormModal = wrapper.findComponent(UserFormModal);
    expect(userFormModal.exists()).toBe(true);

    // Simulate user input by finding and setting each input's value
    // Note: The exact selectors depend on how BaseInput components are structured
    // Assuming BaseInput binds `v-model:data` to `data.value.fieldName`
    // You might need to adjust selectors based on actual DOM structure

    // Example: Setting the 'name' field
    const nameInput = userFormModal.find('input#name');
    await nameInput.setValue(newUser.name);

    // Setting the 'surname' field
    const surnameInput = userFormModal.find('input#surname');
    await surnameInput.setValue(newUser.surname);

    // Setting the 'email' field
    const emailInput = userFormModal.find('input#email');
    await emailInput.setValue(newUser.email);

    // Setting the 'birthday' field
    const birthdayInput = userFormModal.find('input#birthday');
    await birthdayInput.setValue(newUser.birthday);

    // Setting the 'education' field (assuming it's a select)
    const educationSelect = userFormModal.find('select#education');
    await educationSelect.setValue(newUser.education);

    // Simulate form submission
    // Assuming the BaseModal component emits 'onSave' when the form is submitted
    // If there's a submit button, you could also click it
    await userFormModal.find('button[id="base-modal-submit"]').trigger('click');

    // Fast-forward timers to resolve saveUsers
    const saveUsersPromise = vi.runAllTimersAsync();
    await saveUsersPromise;

    // Verify that the new user is added to the store
    expect(userStore.filteredUsers).toHaveLength(initialUsers.length + 1);
    expect(userStore.filteredUsers[0].name).toBe('Alice');
    expect(userStore.filteredUsers[0].id).toBe(String(initialUsers.length + 1));
    expect(userStore.filteredUsers[0].lastUpdated).toBeTruthy();

    // Verify that localStorage.setItem was called to save users
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'users',
      JSON.stringify(userStore.users)
    );

    // Verify that the new user appears in the UserList
    const updatedUserList = wrapper.findComponent(UserList);
    expect(updatedUserList.props('users')).toHaveLength(
      initialUsers.length + 1
    );
    expect(updatedUserList.props('users')[0].name).toBe('Alice');

    // Clean up fake timers
    vi.useRealTimers();
  });

  it('does not add a new user when required fields are missing', async () => {
    // Use fake timers to control asynchronous operations
    vi.useFakeTimers();

    // Load initial users
    const loadUsersPromise = userStore.loadUsers();
    vi.runAllTimers(); // Fast-forward timers to resolve setTimeout
    await loadUsersPromise;

    // Verify initial users are loaded
    expect(userStore.filteredUsers).toHaveLength(initialUsers.length);
    expect(userStore.filteredUsers[0].name).toBe('John');

    // Find the UserList component
    const userList = wrapper.findComponent(UserList);
    expect(userList.exists()).toBe(true);

    // Find the "+ Add User" button within UserList
    const addButton = userList.find('button');
    expect(addButton.exists()).toBe(true);
    expect(addButton.text()).toBe('+ Add User');

    // Simulate clicking the "+ Add User" button
    await addButton.trigger('click');

    // Find the UserFormModal component
    const userFormModal = wrapper.findComponent(UserFormModal);
    expect(userFormModal.exists()).toBe(true);

    // Simulate user input with missing 'name' field
    // Omitting 'name' to trigger validation error
    // Setting other fields as valid

    // const nameInput = userFormModal.find('input#name'); // Omit setting name
    // const surnameInput = userFormModal.find('input#surname');
    await userFormModal.find('input#surname').setValue(newUser.surname);
    await userFormModal.find('input#email').setValue(newUser.email);
    await userFormModal.find('input#birthday').setValue(newUser.birthday);
    await userFormModal.find('select#education').setValue(newUser.education);

    // Simulate form submission
    await userFormModal.find('button[id="base-modal-submit"]').trigger('click');

    // Fast-forward timers to resolve saveUsers
    const saveUsersPromise = vi.runAllTimersAsync();
    await saveUsersPromise;

    // Verify that the user was not added to the store
    expect(userStore.filteredUsers).toHaveLength(initialUsers.length);
    expect(
      userStore.users.find((user) => user.email === newUser.email)
    ).toBeUndefined();

    // Optionally, verify that validation errors are displayed
    // This depends on how BaseInput displays errors
    // For example:
    // const nameError = userFormModal.find('input#name + .error');
    // expect(nameError.exists()).toBe(true);
    // expect(nameError.text()).toBe('Name is required.');

    // Clean up fake timers
    vi.useRealTimers();
  });
});

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  EducationLevel,
  type TableUser,
  type User
} from '@/modules/User/helpers';

export const useUserStore = defineStore('user', () => {
  const users = ref<TableUser[]>([]);
  const searchQuery = ref('');

  const filteredUsers = computed(() => {
    const columns: (keyof User)[] = ['name', 'surname', 'email'];
    return users.value.filter((user) => {
      const values = columns.map((column) =>
        String(user[column] ?? '').toLowerCase()
      );
      return values.some((value) => value.includes(searchQuery.value));
    });
  });

  function setInitialData() {
    if (localStorage.getItem('setInitialData')) {
      return;
    }
    localStorage.setItem('setInitialData', 'true');
    localStorage.setItem('users', JSON.stringify(dummyUsers));
  }

  async function loadUsers() {
    setInitialData();
    const rawData = localStorage.getItem('users');
    const data = JSON.parse(rawData ?? '[]');
    users.value = data;
  }

  async function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users.value));
  }

  function createUser(user: User) {
    users.value.unshift({
      ...user,
      id: String(users.value.length + 1),
      lastUpdated: new Date().toLocaleString()
    });
    saveUsers();
  }

  function updateUser(user: TableUser) {
    const index = users.value.findIndex((u) => u.id === user.id);
    users.value[index] = {
      ...user,
      lastUpdated: new Date().toLocaleString()
    };
    saveUsers();
  }

  function deleteUser(id: string) {
    users.value = users.value.filter((u) => u.id !== id);
    saveUsers();
  }

  return {
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    searchQuery,
    filteredUsers,
    users
  };
});

const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    birthday: '1990-05-15',
    education: EducationLevel.Bachelor,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '2',
    name: 'Jane',
    surname: 'Smith',
    email: 'jane.smith@example.com',
    birthday: '1985-03-10',
    education: EducationLevel.Master,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '3',
    name: 'Michael',
    surname: 'Johnson',
    email: 'michael.johnson@example.com',
    birthday: '1970-07-23',
    education: EducationLevel.HighSchool,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '4',
    name: 'Emily',
    surname: 'Davis',
    email: 'emily.davis@example.com',
    birthday: '2005-01-05',
    education: EducationLevel.Bachelor,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '5',
    name: 'Chris',
    surname: 'Wilson',
    email: 'chris.wilson@example.com',
    birthday: '1998-12-12',
    education: EducationLevel.Master,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '6',
    name: 'Jessica',
    surname: 'Taylor',
    email: 'jessica.taylor@example.com',
    birthday: '1965-09-25',
    education: EducationLevel.HighSchool,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '7',
    name: 'Matthew',
    surname: 'Anderson',
    email: 'matthew.anderson@example.com',
    birthday: '1980-11-03',
    education: EducationLevel.Bachelor,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '8',
    name: 'Olivia',
    surname: 'Thomas',
    email: 'olivia.thomas@example.com',
    birthday: '2003-04-14',
    education: EducationLevel.Master,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '9',
    name: 'David',
    surname: 'Moore',
    email: 'david.moore@example.com',
    birthday: '1978-07-30',
    education: EducationLevel.HighSchool,
    lastUpdated: new Date().toLocaleString()
  },
  {
    id: '10',
    name: 'Sophia',
    surname: 'Jackson',
    email: 'sophia.jackson@example.com',
    birthday: '1995-02-18',
    education: EducationLevel.Bachelor,
    lastUpdated: new Date().toLocaleString()
  }
];

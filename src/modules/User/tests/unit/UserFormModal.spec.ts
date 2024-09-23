import { mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import UserFormModal from '@/modules/User/components/UserFormModal.vue';
import { EducationLevel, type User } from '@/modules/User/helpers';

describe('UserFormModal Component', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(UserFormModal, {
      props: {
        isOpen: true
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('closes the modal when valid data is provided', async () => {
    const validUser: User = {
      name: 'Alice',
      surname: 'Brown',
      email: 'alice.brown@example.com',
      birthday: '1992-08-20',
      education: EducationLevel.Master
    };

    wrapper.vm.isOpen = true;
    wrapper.vm.data = validUser;

    await wrapper.vm.onSave();

    expect(wrapper.vm.isOpen).toBe(false);
  });

  it('keeps the modal open and have errors when invalid data is provided', async () => {
    const invalidUser = {
      name: '',
      surname: 'Brown',
      email: 'alice.brown@example.com',
      birthday: '1992-08-20',
      education: EducationLevel.Master
    };

    wrapper.vm.isOpen = true;
    wrapper.vm.data = invalidUser;

    await wrapper.vm.onSave();

    expect(wrapper.vm.isOpen).toBe(true);
    expect(wrapper.vm.errors.name).toBeTruthy();
    expect(wrapper.vm.errors.name.length).toBeGreaterThan(0);
  });
});

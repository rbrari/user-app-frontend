// tests/components/UserFormModal.spec.ts

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
      },
      global: {
        stubs: ['BaseModal', 'BaseInput']
      }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emits "onSave" with valid data when form is submitted', async () => {
    const validUser: User = {
      name: 'Alice',
      surname: 'Brown',
      email: 'alice.brown@example.com',
      birthday: '1992-08-20',
      education: EducationLevel.Master
    };

    // Simulate user input
    await wrapper.find('input#name').setValue(validUser.name);
    await wrapper.find('input#surname').setValue(validUser.surname);
    await wrapper.find('input#email').setValue(validUser.email);
    await wrapper.find('input#birthday').setValue(validUser.birthday);
    await wrapper.find('select#education').setValue(validUser.education);

    // Simulate form submission
    await wrapper.find('button[type="submit"]').trigger('click');

    // Assert that 'onSave' event was emitted with valid data
    expect(wrapper.emitted('onSave')).toBeTruthy();
    expect(wrapper.emitted('onSave')?.[0]).toEqual([validUser]);
  });

  it('does not emit "onSave" when required fields are missing', async () => {
    // Simulate partial user input (e.g., missing 'name')
    await wrapper.find('input#surname').setValue('Brown');
    await wrapper.find('input#email').setValue('alice.brown@example.com');
    await wrapper.find('input#birthday').setValue('1992-08-20');
    await wrapper.find('select#education').setValue(EducationLevel.Master);

    // Simulate form submission
    await wrapper.find('button[type="submit"]').trigger('click');

    // Assert that 'onSave' event was not emitted
    expect(wrapper.emitted('onSave')).toBeFalsy();

    // Optionally, check for validation errors
    const nameError = wrapper.find('input#name + .error');
    expect(nameError.exists()).toBe(true);
    expect(nameError.text()).toContain('Name is required');
  });
});

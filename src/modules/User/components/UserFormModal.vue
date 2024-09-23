<script setup lang="ts">
  import { ref, reactive, watch } from 'vue';
  import BaseModal from '@/components/BaseModal.vue';
  import BaseInput from '@/components/BaseInput.vue';
  import {
    type User,
    userSchema,
    emptyForm,
    type UserForm,
    EducationLevel
  } from '@/modules/User/helpers';
  import { InputType } from '@/components/types';
  import cloneDeep from 'lodash-es/cloneDeep';

  interface Emits {
    (event: 'onSave', value: User): void;
  }

  const emits = defineEmits<Emits>();

  const isOpen = ref(false);

  const data = ref({ ...emptyForm });

  const errors = ref<Record<string, string[]>>({});

  const touchedFields = reactive<Record<keyof UserForm, boolean>>({
    name: false,
    surname: false,
    email: false,
    education: false,
    birthday: false
  });

  const educationOptions = Object.values(EducationLevel).map((value) => ({
    value,
    label: value
  }));

  function markFieldAsTouched(fieldName: keyof UserForm) {
    touchedFields[fieldName] = true;
  }

  function markForm(isTouched = true) {
    Object.keys(touchedFields).forEach((field) => {
      touchedFields[field as keyof UserForm] = isTouched;
    });
  }

  function resetForm() {
    data.value = emptyForm;
    errors.value = {};
    markForm(false);
  }

  watch(isOpen, (value) => {
    if (!value) {
      resetForm();
    }
  });

  function open(user?: User) {
    if (user) {
      data.value = cloneDeep(user);
    }
    isOpen.value = true;
  }

  function onSave() {
    const result = userSchema.safeParse(data.value);

    console.log(result, 'onSave');
    markForm();

    if (!result.success) {
      errors.value = result.error.flatten().fieldErrors;
    } else {
      errors.value = {};
      emits('onSave', {
        ...data.value,
        ...result.data
      });
      isOpen.value = false;
    }
  }

  defineExpose({
    open
  });
</script>

<template>
  <BaseModal title="User Form" v-model:isOpen="isOpen" @onSave="onSave">
    <div class="form">
      <BaseInput
        id="name"
        label="First Name"
        :errors="errors.name || []"
        :isTouched="touchedFields.name"
        v-model:data="data"
        @markFieldAsTouched="markFieldAsTouched('name')"
      />
      <BaseInput
        id="surname"
        label="Last Name"
        :errors="errors.surname || []"
        :isTouched="touchedFields.surname"
        v-model:data="data"
        @markFieldAsTouched="markFieldAsTouched('surname')"
      />
      <BaseInput
        id="email"
        label="Email"
        :type="InputType.EMAIL"
        :errors="errors.email || []"
        :isTouched="touchedFields.email"
        v-model:data="data"
        @markFieldAsTouched="markFieldAsTouched('email')"
      />
      <BaseInput
        id="birthday"
        label="Birthday"
        :type="InputType.DATE"
        :errors="errors.birthday || []"
        :isTouched="touchedFields.birthday"
        v-model:data="data"
        @markFieldAsTouched="markFieldAsTouched('birthday')"
      />
      <BaseInput
        id="education"
        label="Education Level"
        :type="InputType.SELECT"
        :options="educationOptions"
        :errors="errors.education || []"
        :isTouched="touchedFields.education"
        v-model:data="data"
        @markFieldAsTouched="markFieldAsTouched('education')"
      />
    </div>
  </BaseModal>
</template>

<style scoped>
  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .form-group input,
  .form-group select {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .error {
    color: red;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  button[type='submit'] {
    align-self: flex-end;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
  }
</style>

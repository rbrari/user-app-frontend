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

  function validateData() {
    const result = userSchema.safeParse(data.value);
    errors.value = result.error?.flatten().fieldErrors ?? {};
    return result;
  }

  function onFieldChange(fieldName: keyof UserForm) {
    markFieldAsTouched(fieldName);
    validateData();
  }

  function onSave() {
    const result = validateData();
    markForm();

    if (!Object.values(errors.value).length) {
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
    <div class="user-form">
      <BaseInput
        id="name"
        label="First Name"
        :errors="errors.name || []"
        :isTouched="touchedFields.name"
        isRequired
        v-model:data="data"
        @markFieldAsTouched="onFieldChange('name')"
      />
      <BaseInput
        id="surname"
        label="Last Name"
        :errors="errors.surname || []"
        :isTouched="touchedFields.surname"
        isRequired
        v-model:data="data"
        @markFieldAsTouched="onFieldChange('surname')"
      />
      <BaseInput
        id="email"
        label="Email"
        :type="InputType.EMAIL"
        :errors="errors.email || []"
        :isTouched="touchedFields.email"
        isRequired
        v-model:data="data"
        @markFieldAsTouched="onFieldChange('email')"
      />
      <br />
      <BaseInput
        id="birthday"
        label="Birthday"
        :type="InputType.DATE"
        :errors="errors.birthday || []"
        :isTouched="touchedFields.birthday"
        v-model:data="data"
        @markFieldAsTouched="onFieldChange('birthday')"
      />
      <BaseInput
        id="education"
        label="Education Level"
        :type="InputType.SELECT"
        :options="educationOptions"
        :errors="errors.education || []"
        :isTouched="touchedFields.education"
        v-model:data="data"
        @markFieldAsTouched="onFieldChange('education')"
      />
    </div>
  </BaseModal>
</template>

<style lang="scss" scoped>
  .user-form {
    display: flex;
    flex-direction: row;
    gap: 0.8rem 2.4rem;
    flex-wrap: wrap;

    .base-input {
      width: calc(50% - 1.2rem);

      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }
</style>

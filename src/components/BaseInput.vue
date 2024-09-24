<script setup lang="ts">
  import { InputType } from '@/components/types';

  interface Props {
    id: string;
    type?: InputType;
    errors: string[];
    isTouched: boolean;
    disabled?: boolean;
    label: string;
    options?: { label: string; value: string }[];
    isRequired?: boolean;
  }

  interface Emits {
    (event: 'markFieldAsTouched'): void;
  }

  withDefaults(defineProps<Props>(), {
    type: InputType.TEXT,
    disabled: false,
    options: () => [],
    isRequired: false
  });

  const emits = defineEmits<Emits>();

  defineModel<Record<string, unknown>>('data', {
    required: true
  });
</script>

<template>
  <div class="base-input">
    <label :for="id">{{ label }}</label>
    <select :id v-if="type === InputType.SELECT">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <input
      v-else
      v-model="data[id]"
      @blur="emits('markFieldAsTouched')"
      :type
      :id
    />
    <span class="error" v-if="errors.length && isTouched">{{ errors[0] }}</span>
  </div>
</template>

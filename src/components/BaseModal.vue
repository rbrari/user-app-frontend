<script setup lang="ts">
  interface Props {
    title: string;
  }

  interface Emits {
    (event: 'update:isOpen', value: boolean): void;
    (event: 'onSave'): void;
  }

  withDefaults(defineProps<Props>(), {
    title: 'Base Modal'
  });

  const emits = defineEmits<Emits>();

  const open = defineModel<boolean>('isOpen', {
    required: true
  });

  defineExpose({
    open,
    close
  });
</script>

<template>
  <dialog :open class="base-modal">
    <div class="base-modal__content">
      <header class="base-modal__header">
        <h2>{{ title }}</h2>
        <button @click="open = false">&times;</button>
      </header>
      <main class="base-modal__header">
        <slot></slot>
      </main>
      <footer class="base-modal__footer">
        <button @click="open = false">Cancel</button>
        <button id="base-modal-submit" @click="emits('onSave')">Save</button>
      </footer>
    </div>
  </dialog>
</template>

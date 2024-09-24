<script setup lang="ts">
  import BaseIcon from '@/components/BaseIcon.vue';

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
    <header class="base-modal__header">
      {{ title }}
      <BaseIcon type="close" @click="open = false" />
    </header>
    <main class="base-modal__content">
      <slot></slot>
    </main>
    <footer class="base-modal__footer">
      <button class="base-btn" @click="open = false">Cancel</button>
      <button class="base-btn base-btn--primary" @click="emits('onSave')">
        Save
      </button>
    </footer>
  </dialog>
  <div class="base-modal__overlay" @click="open = false"></div>
</template>

<style lang="scss" scoped>
  .base-modal {
    border: none;
    border-radius: 0.8rem;
    padding: 0;
    background-color: var(--color-white);
    box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
    width: 60rem;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);

    &__overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
      z-index: 1;
    }

    &[open] {
      + .base-modal__overlay {
        display: block;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      max-height: 50rem;
      overflow: auto;
      padding: 1.6rem;
      @include scrollbar-on-hover;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.6rem;
      font-weight: 500;
      font-size: 1.4rem;
      color: var(--color-black);
      border-bottom: 0.1rem solid var(--border-color);

      .base-icon {
        cursor: pointer;
      }
    }

    &__body {
      padding: 1rem;
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.8rem;
      padding: 1rem;
      border-top: 0.1rem solid var(--border-color);
      text-align: right;
    }
  }
</style>

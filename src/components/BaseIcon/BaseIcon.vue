<template>
  <i
    v-html="icon"
    class="base-icon"
    :class="{ 'base-icon--loading': type === 'loading' }"
    :style="style"
  />
</template>

<script setup lang="ts">
import icons, { type Icon } from '@/components/BaseIcon/icons';
import { isDefined } from '@/helpers';
import { computed } from 'vue';

interface Props {
  type: Icon;
  height?: number;
  fill?: boolean;
  styles?: Record<string, string>;
}

const props = defineProps<Props>();

const icon = computed(() => icons[props.type]);

const style = computed(() => ({
  ...(isDefined(props.height) && { height: `${props.height}px` }),
  ...(isDefined(props.height) && { width: `${props.height}px` }),
  ...(props.styles && { ...props.styles })
}));
</script>

<style lang="scss" scoped>
.base-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: auto;

  svg {
    width: auto;
    height: 100%;
  }

  &--loading {
    animation: rotate 1.5s linear infinite;
  }
}
</style>

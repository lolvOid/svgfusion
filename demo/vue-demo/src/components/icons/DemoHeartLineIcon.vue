<template>
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
    :width="computedWidth"
    :height="computedHeight"
  >
    <title v-if="props.title" :id="props.titleId">{{ props.title }}</title>
    <desc v-if="props.desc" :id="props.descId">{{ props.desc }}</desc>
    <path
      :stroke="props.color"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="props.strokeWidth"
      d="M17 4c-3.2 0-5 2.667-5 4 0-1.333-1.8-4-5-4S3 6.667 3 8c0 7 9 12 9 12s9-5 9-12c0-1.333-.8-4-4-4z"
      fill="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.colorClass, props.strokeWidthClass]"
    />
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  import type { SVGAttributes } from 'vue';
  import { computed } from 'vue';

  interface Props extends /* @vue-ignore */ SVGAttributes {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
    width?: string | number;
    height?: string | number;
    size?: string | number;
    color?: string;
    colorClass?: string;
    strokeWidth?: string | number;
    strokeWidthClass?: string;
    isFixedStrokeWidth?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '24',
    color: '#000000',
    colorClass: '',
    strokeWidth: '2',
    strokeWidthClass: '',
    isFixedStrokeWidth: true,
  });

  const computedWidth = computed(() => props.width || props.size);
  const computedHeight = computed(() => props.height || props.size);
</script>

<template>
  <svg
    viewBox="0 -52 1128 1128"
    class="icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-labelledby="`${props.titleId} ${props.descId}`"
    v-bind="$attrs"
    :width="computedWidth"
    :height="computedHeight"
  >
    <title v-if="props.title" :id="props.titleId">{{ props.title }}</title>
    <desc v-if="props.desc" :id="props.descId">{{ props.desc }}</desc>
    <path
      d="M473.184 356.632c-23.048-28.336-64.616-32.632-92.816-9.672-28.248 23.048-32.568 64.528-9.616 92.84l473.328 547.152c22.928 28.248 64.376 32.488 92.776 9.552 28.224-22.992 32.512-64.528 9.528-92.752l-473.2-547.12z"
      :fill="props.color2"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color2Class]"
    />
    <path
      d="M151.4 65.976l-1.056-0.472 54.912 223.104L52.68 460.32l229.128 16.664 116.12 198.2 56.8-139.376 389.6 450.344c22.224 27.4 61.792 31.984 90.072 11.32L151.4 65.976z"
      :fill="props.color"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.colorClass]"
    />
    <path
      d="M150.104 66.304L360.56 158.4 555.752 37.224l-22.52 228.6L708.8 414.016l-224.416 49.24-86.664 212.728-116.152-198.2-229.12-16.672 152.6-171.712z"
      :fill="props.color6"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color6Class]"
    />
    <path
      d="M276.192 225.08l95.368 41.712 88.424-54.888-10.2 103.576 79.568 67.144-101.704 22.312-39.28 96.368-52.616-89.816-103.808-7.52 69.144-77.816z"
      :fill="props.color4"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color4Class]"
    />
    <path
      d="M484.384 463.256l0.528-0.112L152.072 67.152l-1.208-0.528 54.856 222.92-152.48 171.624 228.328 16.616 0.064 0.08 0.648 0.064 115.68 197.464z"
      :fill="props.color5"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color5Class]"
    />
    <path
      d="M434.56 403.408L289.6 230.928l-13.408-5.848 24.896 101.072-69.144 77.816 103.808 7.52 52.616 89.816 39.28-96.368z"
      :fill="props.color3"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color3Class]"
    />
  </svg>
</template>

<script setup lang="ts">
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
    color2?: string;
    color2Class?: string;
    color3?: string;
    color3Class?: string;
    color4?: string;
    color4Class?: string;
    color5?: string;
    color5Class?: string;
    color6?: string;
    color6Class?: string;
    isFixedStrokeWidth?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '24',
    color: '#0085BF',
    colorClass: '',
    color2: '#0092D2',
    color2Class: '',
    color3: '#C9005B',
    color3Class: '',
    color4: '#E5226B',
    color4Class: '',
    color5: '#EF962F',
    color5Class: '',
    color6: '#F5B146',
    color6Class: '',
    isFixedStrokeWidth: true,
  });

  const computedWidth = computed(() => props.width || props.size);
  const computedHeight = computed(() => props.height || props.size);
</script>

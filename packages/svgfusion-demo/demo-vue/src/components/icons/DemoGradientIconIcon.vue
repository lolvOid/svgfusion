<template>
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 511.999 511.999"
    xml:space="preserve"
    role="img"
    :aria-labelledby="`${props.titleId} ${props.descId}`"
    v-bind="$attrs"
    :width="computedWidth"
    :height="computedHeight"
  >
    <title v-if="props.title" :id="props.titleId">{{ props.title }}</title>
    <desc v-if="props.desc" :id="props.descId">{{ props.desc }}</desc>
    <path
      :style="{ fill: props.color }"
      d="M22.276,311.484c-2.199-3.298-7.044-3.298-9.244,0L1.483,328.81C0.516,330.26,0,331.964,0,333.706  v14.983c0,4.875,3.953,8.828,8.828,8.828h17.655c4.875,0,8.828-3.953,8.828-8.828v-14.983c0-1.742-0.516-3.446-1.483-4.897  L22.276,311.484z"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.colorClass]"
    />
    <path
      :style="{ fill: props.color8 }"
      d="M510.517,328.81l-11.551-17.326c-2.199-3.298-7.044-3.298-9.244,0l-11.551,17.326  c-0.967,1.45-1.483,3.154-1.483,4.897v14.982c0,4.875,3.953,8.828,8.828,8.828h17.655c4.875,0,8.828-3.953,8.828-8.828v-14.983  C512,331.964,511.484,330.26,510.517,328.81z"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color8Class]"
    />
    <path
      :style="{ fill: props.color }"
      d="M26.483,154.482c-9.751,0-17.655,7.905-17.655,17.655v105.931c0,9.75,7.904,17.655,17.655,17.655  h44.138V154.482H26.483z"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.colorClass]"
    />
    <path
      :style="{ fill: props.color8 }"
      d="M503.172,278.068V172.137c0-9.75-7.905-17.655-17.655-17.655h-44.138v141.241h44.138  C495.267,295.724,503.172,287.818,503.172,278.068z"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color8Class]"
    />
    <rect
      x="70.621"
      y="154.482"
      :style="{ fill: props.color2 }"
      width="61.793"
      height="141.241"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color2Class]"
    />
    <rect
      x="132.414"
      y="154.482"
      :style="{ fill: props.color3 }"
      width="61.793"
      height="141.241"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color3Class]"
    />
    <rect
      x="194.207"
      y="154.482"
      :style="{ fill: props.color4 }"
      width="61.793"
      height="141.241"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color4Class]"
    />
    <rect
      x="317.793"
      y="154.482"
      :style="{ fill: props.color6 }"
      width="61.793"
      height="141.241"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color6Class]"
    />
    <rect
      x="256"
      y="154.482"
      :style="{ fill: props.color5 }"
      width="61.793"
      height="141.241"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color5Class]"
    />
    <rect
      x="379.586"
      y="154.482"
      :style="{ fill: props.color7 }"
      width="61.793"
      height="141.241"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color7Class]"
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
    color7?: string;
    color7Class?: string;
    color8?: string;
    color8Class?: string;
    isFixedStrokeWidth?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '24',
    color: '#00DCCD',
    colorClass: '',
    color2: '#17D2D0',
    color2Class: '',
    color3: '#24CCD2',
    color3Class: '',
    color4: '#32C5D4',
    color4Class: '',
    color5: '#3CC1D5',
    color5Class: '',
    color6: '#49BBD7',
    color6Class: '',
    color7: '#57B5D9',
    color7Class: '',
    color8: '#63AFDB',
    color8Class: '',
    isFixedStrokeWidth: true,
  });

  const computedWidth = computed(() => props.width || props.size);
  const computedHeight = computed(() => props.height || props.size);
</script>

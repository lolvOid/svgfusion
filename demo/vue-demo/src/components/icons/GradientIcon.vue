<template>
  <svg
    viewBox="0 0 511.999 511.999"
    xmlns="http://www.w3.org/2000/svg"
    v-bind="$attrs"
    :width="props.size || undefined"
    :height="props.size || undefined"
  >
    <title v-if="props.title" :id="props.titleId">{{ props.title }}</title>
    <desc v-if="props.desc" :id="props.descId">{{ props.desc }}</desc>
    <path
      style="fill: #00dccd"
      d="M22.276,311.484c-2.199-3.298-7.044-3.298-9.244,0L1.483,328.81C0.516,330.26,0,331.964,0,333.706
	v14.983c0,4.875,3.953,8.828,8.828,8.828h17.655c4.875,0,8.828-3.953,8.828-8.828v-14.983c0-1.742-0.516-3.446-1.483-4.897
	L22.276,311.484z"
    />
    <path
      style="fill: #63afdb"
      d="M510.517,328.81l-11.551-17.326c-2.199-3.298-7.044-3.298-9.244,0l-11.551,17.326
	c-0.967,1.45-1.483,3.154-1.483,4.897v14.982c0,4.875,3.953,8.828,8.828,8.828h17.655c4.875,0,8.828-3.953,8.828-8.828v-14.983
	C512,331.964,511.484,330.26,510.517,328.81z"
    />
    <path
      style="fill: #00dccd"
      d="M26.483,154.482c-9.751,0-17.655,7.905-17.655,17.655v105.931c0,9.75,7.904,17.655,17.655,17.655
	h44.138V154.482H26.483z"
    />
    <path
      style="fill: #63afdb"
      d="M503.172,278.068V172.137c0-9.75-7.905-17.655-17.655-17.655h-44.138v141.241h44.138
	C495.267,295.724,503.172,287.818,503.172,278.068z"
    />
    <rect
      x="70.621"
      y="154.482"
      style="fill: #17d2d0"
      width="61.793"
      height="141.241"
    />
    <rect
      x="132.414"
      y="154.482"
      style="fill: #24ccd2"
      width="61.793"
      height="141.241"
    />
    <rect
      x="194.207"
      y="154.482"
      style="fill: #32c5d4"
      width="61.793"
      height="141.241"
    />
    <rect
      x="317.793"
      y="154.482"
      style="fill: #49bbd7"
      width="61.793"
      height="141.241"
    />
    <rect
      x="256"
      y="154.482"
      style="fill: #3cc1d5"
      width="61.793"
      height="141.241"
    />
    <rect
      x="379.586"
      y="154.482"
      style="fill: #57b5d9"
      width="61.793"
      height="141.241"
    />
  </svg>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  import type { SVGAttributes } from 'vue';

  interface Props extends /* @vue-ignore */ SVGAttributes {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
    size?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '20',
  });
</script>

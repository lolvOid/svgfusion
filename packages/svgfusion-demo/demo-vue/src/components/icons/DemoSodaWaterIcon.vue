<template>
  <svg
    viewBox="0 0 1024 1024"
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
      d="M754.06 474c-0.93 24.79-6.58 59.51-13.41 81.13 0 0-67.84 272.5-268.15 272.5-205.1 0.03-288.5-273.12-288.5-273.12-9.08-23.19-15.75-62.37-15.75-87.24V230.81a22.61 22.61 0 0 1 22.61-22.61h297.4z"
      :fill="props.color4"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color4Class]"
    />
    <path
      d="M740.65 555.16s-152.07 272.5-268.15 272.5-187.08-273.15-187.08-273.15c-9.08-23.19-15.75-62.37-15.75-87.24V230.81a22.61 22.61 0 0 1 22.61-22.61h196a226.19 226.19 0 0 0-4.51 45.05c0 124.41 100.9 225.26 225.36 225.26a226.49 226.49 0 0 0 44.93-4.51c-0.92 24.82-6.57 59.54-13.41 81.16z"
      :fill="props.color3"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color3Class]"
    />
    <path
      d="M432.19 817.23q114.48-132 108.19-343.79-1.05-35.47-1.86-73A225.83 225.83 0 0 0 754.06 474c-0.93 24.79-6.58 59.51-13.41 81.13 0 0-95.5 272.5-268.15 272.5-13.64 0.03-27.13-3.74-40.31-10.4z"
      :fill="props.color"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.colorClass]"
    />
    <path
      d="M147.79 467.27V230.81a43.09 43.09 0 0 1 43.09-43.09h297.4v41h-297.4a2.13 2.13 0 0 0-2.13 2.13v236.42c0 23.19 6.47 59.7 14.33 79.77 1.08 3.32 2.3 7 4.19 12.29 3.21 9 7.14 19 11.79 29.77a542.77 542.77 0 0 0 49.22 90.47c54.66 80.3 122.4 127.62 204.23 127.62 79.35 0 142.63-46.82 191.76-126.52a512.24 512.24 0 0 0 43.46-90.06c4-10.76 7.33-20.73 10-29.65 1.59-5.26 2.59-8.93 3-10.75 6.54-20.83 11.95-53.69 12.82-76.95l40.93 1.53c-1 26.58-6.91 62.69-14.16 85.94-0.64 2.52-1.77 6.6-3.41 12-2.93 9.71-6.53 20.5-10.83 32.09a552.58 552.58 0 0 1-47 97.29c-55.86 90.61-130.7 146-226.63 146-97.59 0.03-176.45-55.11-238.03-145.5a583.15 583.15 0 0 1-53-97.33c-5-11.61-9.23-22.4-12.72-32.12-1.92-5.35-3.27-9.38-4.06-11.91-9.64-25.06-16.85-66.1-16.85-93.98z"
      fill=""
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
    />
    <path
      d="M461.23 827.66h33.8v157.68h-33.8z"
      :fill="props.color3"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color3Class]"
    />
    <path
      d="M520.38 1000.84H407.74V806.27h112.64z m-71.68-41h30.72V847.23H448.7z"
      fill=""
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
    />
    <path
      d="M305.34 970.12h337.92a20.48 20.48 0 0 1 20.48 20.48 20.48 20.48 0 0 1-20.48 20.48H305.34a20.48 20.48 0 0 1-20.48-20.48 20.48 20.48 0 0 1 20.48-20.48zM448.7 612.73a52.23 52.23 0 1 1 52.22-52.23 52.28 52.28 0 0 1-52.22 52.23z m0-81.92a29.7 29.7 0 1 0 29.7 29.7 29.73 29.73 0 0 0-29.7-29.71zM450 681.25a22.53 22.53 0 1 1 22.53-22.53A22.55 22.55 0 0 1 450 681.25z m0-22.53zM450 771.35a22.53 22.53 0 1 1 22.53-22.53A22.55 22.55 0 0 1 450 771.35z m0-22.53z"
      fill=""
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
    />
    <path
      d="M706.11 478.5c-89.87-29.62-154.73-114.22-154.73-214 0-124.41 100.9-225.26 225.36-225.26h3c89.87 29.62 154.73 114.22 154.73 214 0 124.41-100.9 225.26-225.36 225.26z"
      :fill="props.color2"
      stroke="none"
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
      :class="[props.color2Class]"
    />
    <path
      d="M709.13 501A247.76 247.76 0 0 1 533.85 78 247.84 247.84 0 1 1 884.4 428.47 246.32 246.32 0 0 1 709.13 501z m0-450.51c-111.84 0-202.83 90.94-202.83 202.73S597.29 456 709.13 456 912 365 912 253.26 821 50.53 709.13 50.53z"
      fill=""
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
    />
    <path
      d="M696.33 227.9l-40.69-125.2 18.44-5.98 40.68 125.19 40.71-125.2 18.43 5.98-40.7 125.2 106.55-77.38 11.39 15.67-106.55 77.39 131.69-0.01v19.37l-131.69 0.01 106.53 77.37-11.39 15.67-106.54-77.36 40.69 125.19-18.44 5.99-40.68-125.19-40.71 125.2-18.43-5.99 40.7-125.2-106.55 77.39-11.39-15.68 106.55-77.38-131.69 0.01v-19.37l131.69-0.02-106.53-77.36 11.39-15.68 106.54 77.37z"
      fill=""
      :vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"
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
    isFixedStrokeWidth?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '24',
    color: '#C15BFF',
    colorClass: '',
    color2: '#D1FF02',
    color2Class: '',
    color3: '#E7D8FF',
    color3Class: '',
    color4: '#FFFFFF',
    color4Class: '',
    isFixedStrokeWidth: true,
  });

  const computedWidth = computed(() => props.width || props.size);
  const computedHeight = computed(() => props.height || props.size);
</script>

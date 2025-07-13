<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-green-600 mb-2">
          SVGFusion Vue Demo
        </h1>
        <p class="text-gray-600">Generated Vue components from SVG files</p>
      </header>

      <main class="space-y-8">
        <section class="bg-white p-6 rounded-lg shadow-sm">
          <div class="flex flex-wrap gap-6 justify-center">
            <div class="flex flex-col items-center space-y-2">
              <label class="font-semibold text-gray-700">Size</label>
              <input
                v-model.number="size"
                type="number"
                min="16"
                max="128"
                class="w-20 px-2 py-1 text-sm border rounded text-center"
                placeholder="24"
              />
            </div>

            <div class="flex flex-col items-center space-y-2">
              <label class="font-semibold text-gray-700">Width</label>
              <input
                v-model.number="width"
                type="number"
                min="0"
                class="w-20 px-2 py-1 text-sm border rounded text-center"
                placeholder="auto"
              />
            </div>

            <div class="flex flex-col items-center space-y-2">
              <label class="font-semibold text-gray-700">Height</label>
              <input
                v-model.number="height"
                type="number"
                min="0"
                class="w-20 px-2 py-1 text-sm border rounded text-center"
                placeholder="auto"
              />
            </div>

            <div class="flex flex-col items-center space-y-2">
              <label class="font-semibold text-gray-700">Stroke Width</label>
              <input
                v-model.number="strokeWidth"
                type="number"
                min="0.5"
                max="5"
                step="0.1"
                class="w-20 px-2 py-1 text-sm border rounded text-center"
                placeholder="1.5"
              />
            </div>

            <div class="flex flex-col items-center space-y-2">
              <label class="font-semibold text-gray-700">Primary Color</label>
              <input
                v-model="color"
                type="color"
                class="w-12 h-10 border-none rounded cursor-pointer"
              />
            </div>

            <div class="flex flex-col items-center space-y-2">
              <label class="font-semibold text-gray-700">Secondary Color</label>
              <input
                v-model="color2"
                type="color"
                class="w-12 h-10 border-none rounded cursor-pointer"
              />
            </div>

            <div class="flex flex-col items-center space-y-2">
              <label class="font-semibold text-gray-700"
                >Fixed Stroke Width</label
              >
              <button
                @click="isFixedStrokeWidth = !isFixedStrokeWidth"
                :class="`w-12 h-6 rounded-full transition-colors duration-200 relative ${
                  isFixedStrokeWidth ? 'bg-green-500' : 'bg-gray-300'
                }`"
              >
                <div
                  :class="`w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 absolute top-0.5 ${
                    isFixedStrokeWidth ? 'translate-x-6' : 'translate-x-0.5'
                  }`"
                />
              </button>
              <span class="text-xs text-gray-500">
                {{ isFixedStrokeWidth ? 'Enabled' : 'Disabled' }}
              </span>
            </div>
          </div>
        </section>

        <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="icon in icons"
            :key="icon.name"
            class="bg-white p-6 rounded-lg shadow-sm border hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <div class="flex flex-col items-center space-y-4">
              <component
                :is="icon.component"
                :size="size"
                :width="width"
                :height="height"
                :color="color"
                :color2="color2"
                :strokeWidth="strokeWidth"
                :title="icon.name"
                :isFixedStrokeWidth="isFixedStrokeWidth"
              />
              <span class="text-sm text-gray-600 font-medium">{{
                icon.name
              }}</span>
            </div>
          </div>
        </section>

        <section class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Size Variations
          </h2>
          <div class="flex gap-8 justify-center items-end flex-wrap">
            <div
              v-for="iconSize in [16, 24, 32, 48, 64]"
              :key="iconSize"
              class="flex flex-col items-center space-y-2"
            >
              <DemoGradientIconIcon :size="iconSize" />
              <span class="text-xs text-gray-500">{{ iconSize }}px</span>
            </div>
          </div>
        </section>
      </main>

      <footer class="mt-12 pt-8 border-t border-gray-200 text-center">
        <p class="text-sm text-gray-500">
          Generated by SVGFusion • Composition API • Script Setup
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DemoGoldPersonIcon,
  DemoGradientIconIcon,
  DemoMagicTypeFilledColorSecondaryIcon,
  DemoBackCardColorIcon,
  DemoBrowserifyIconIcon,
  DemoGooglePlusCircleIcon,
  DemoSodaWaterIcon,
  DemoHeartLineIcon,
} from './components/icons';

const size = ref(48);
const width = ref('');
const height = ref('');
const strokeWidth = ref(1.5);
const color = ref('#3498db');
const color2 = ref('#e74c3c');
const isFixedStrokeWidth = ref(false);

const icons = [
  { component: DemoGoldPersonIcon, name: 'Gold Person' },
  { component: DemoGradientIconIcon, name: 'Gradient Icon' },
  { component: DemoMagicTypeFilledColorSecondaryIcon, name: 'Magic Icon' },
  { component: DemoBackCardColorIcon, name: 'Back Card' },
  { component: DemoBrowserifyIconIcon, name: 'Browserify' },
  { component: DemoGooglePlusCircleIcon, name: 'Google Plus' },
  { component: DemoSodaWaterIcon, name: 'Soda Water' },
  { component: DemoHeartLineIcon, name: 'HearLine' },
];
</script>

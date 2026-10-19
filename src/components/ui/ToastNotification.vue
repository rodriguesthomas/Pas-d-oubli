<script setup>
import { useToast } from '../../composables/useToast';

const { isVisible, message } = useToast();
</script>

<template>
  <transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="translate-y-16 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-16 opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 max-w-sm"
    >
      <div
        class="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0"
      >
        <i class="fa-solid fa-check text-xs"></i>
      </div>
      <span class="text-xs font-medium">{{ message }}</span>
    </div>
  </transition>
</template>

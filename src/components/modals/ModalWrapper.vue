<script setup>
defineProps({
  show: Boolean,
  maxWidthClass: {
    type: String,
    default: 'max-w-md'
  }
});

const emit = defineEmits(['close']);
</script>

<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" 
    @click.self="emit('close')"
  >
    <div :class="`bg-white rounded-3xl p-6 sm:p-8 w-full ${maxWidthClass} shadow-2xl relative transition-transform duration-200`">
      <button 
        @click="emit('close')" 
        class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
        aria-label="Fermer"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
      <slot />
    </div>
  </div>
</template>
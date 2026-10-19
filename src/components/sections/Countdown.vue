<script setup>
import { useCountdown } from '../../composables/useCountdown';

const { days, hours, minutes, seconds } = useCountdown("2027-05-23T09:00:00");
</script>

<template>
  <div class="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
    <div class="absolute -top-3 right-6 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
      Top Départ 2027
    </div>

    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
        <i class="fa-regular fa-clock text-xl"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-white">Compte à rebours</h3>
        <p class="text-xs text-slate-300">Départ de la première marche à 09h00</p>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
      <div class="bg-black/40 border border-white/10 rounded-2xl p-3">
        <span class="block text-2xl sm:text-3xl font-black font-mono text-emerald-400">{{ days }}</span>
        <span class="text-[10px] sm:text-xs uppercase font-semibold text-slate-300">Jours</span>
      </div>
      <div class="bg-black/40 border border-white/10 rounded-2xl p-3">
        <span class="block text-2xl sm:text-3xl font-black font-mono text-white">{{ hours }}</span>
        <span class="text-[10px] sm:text-xs uppercase font-semibold text-slate-300">Heures</span>
      </div>
      <div class="bg-black/40 border border-white/10 rounded-2xl p-3">
        <span class="block text-2xl sm:text-3xl font-black font-mono text-white">{{ minutes }}</span>
        <span class="text-[10px] sm:text-xs uppercase font-semibold text-slate-300">Min</span>
      </div>
      <div class="bg-black/40 border border-white/10 rounded-2xl p-3">
        <span class="block text-2xl sm:text-3xl font-black font-mono text-emerald-400">{{ seconds }}</span>
        <span class="text-[10px] sm:text-xs uppercase font-semibold text-slate-300">Sec</span>
      </div>
    </div>
  </div>
</template>
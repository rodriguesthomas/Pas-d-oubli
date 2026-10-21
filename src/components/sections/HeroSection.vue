<script setup>
import { useModal } from '../../composables/useModal';
import Countdown from '../sections/Countdown.vue';

const { openModal } = useModal();
</script>

<template>
  <section id="hero" class="relative bg-emerald-700 text-white pt-16 pb-24 overflow-hidden">
    <div class="absolute inset-0 pointer-events-none"></div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center  py-1.5 rounded-full">
            Événement Caritatif & Éco-responsable • 1ère Édition
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Ensemble <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300">créons nos souvenirs</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Une grande journée sportive, conviviale et solidaire au profit de <strong>France Alzheimer 37</strong>.
          </p>

          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm font-medium">
            <div class="flex items-center gap-2 bg-white text-emerald-800 px-4 py-2.5 rounded-xl  shadow-sm">
              <i class="fa-regular fa-calendar-days text-emerald-600 text-lg"></i>
              <span>Dimanche <strong class="text-emerald-900">23 mai 2027</strong></span>
            </div>
            <div class="flex items-center gap-2 bg-white text-emerald-800 px-4 py-2.5 rounded-xl  shadow-sm">
              <i class="fa-regular fa-calendar-days text-emerald-600 text-lg"></i>
              <span>Salle des fêtes d'<strong>Athée-sur-Cher (37)</strong></span>
            </div>
          </div>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a href="#epreuves" class="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-center shadow-lg">
              <i class="fa-solid fa-ticket mr-2"></i>Je m'inscris en ligne
            </a>
            <button 
              @click="openModal('don')" 
              class="w-full sm:w-auto px-6 py-3.5 bg-rose-400/70 hover:bg-rose-500/30 backdrop-blur-md text-white font-bold rounded-xl hover:border-rose-400 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <i class="fa-solid fa-heart text-rouge-300 text-lg"></i>
              <span>Faire un don direct</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-5">
          <Countdown />
        </div>
      </div>
    </div>
  </section>
</template>
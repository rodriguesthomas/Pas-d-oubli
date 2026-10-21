<script setup>
import { RACES } from '../../data/races';
import { useModal } from '../../composables/useModal';

const { openModal } = useModal();

const handleDetails = (race) => {
  openModal('details', race);
};

const handleRegister = (race) => {
  openModal('inscription', race);
};
</script>

<template>
  <section id="epreuves" class="py-20 bg-slate-100/70 border-y border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Choisissez votre défi solidaire</h2>
        <p class="text-slate-600 mt-2 text-sm sm:text-base">
          Tarif simple et transparent : 1 € par kilomètre parcouru (gratuit pour les moins de 10 ans). 100 % reversé à France Alzheimer 37.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div 
          v-for="race in RACES" 
          :key="race.id" 
          class="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-lg transition duration-200"
        >
          <!-- Entête de carte -->
          <div :class="`p-5  ${race.themeGradient} text-white flex justify-between items-center`">
            <div>
              <span class="text-xs uppercase font-extrabold tracking-wider text-emerald-100">{{ race.ageTag }}</span>
              <h3 class="text-2xl font-black">{{ race.name }}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
              <i :class="race.icon"></i>
            </div>
          </div>

          <!-- Corps de la carte -->
          <div class="p-6 flex-1 flex flex-col justify-between gap-6">
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="text-slate-500"><i class="fa-solid fa-clock text-emerald-600 mr-2"></i>Départ</span>
                <span class="font-bold text-slate-800">{{ race.departure }}</span>
              </div>
              <div v-if="race.track" class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="text-slate-500"><i class="fa-solid fa-road text-emerald-600 mr-2"></i>Parcours</span>
                <span class="font-bold text-slate-800">{{ race.track }}</span>
              </div>
              <div v-if="race.pace" class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="text-slate-500"><i class="fa-solid fa-person-walking text-emerald-600 mr-2"></i>Allure</span>
                <span class="font-bold text-slate-800">{{ race.pace }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500"><i class="fa-solid fa-user-check text-emerald-600 mr-2"></i>Condition</span>
                <span :class="race.isAlertCondition ? 'text-amber-800 bg-amber-50' : 'text-slate-800'" class="font-semibold text-xs px-2 py-0.5 rounded">
                  {{ race.condition }}
                </span>
              </div>
            </div>

            <div>
              <div class="flex items-baseline justify-between mb-4">
                <span class="text-xs text-slate-500">Tarif solidaire</span>
                <span class="text-2xl font-black" :class="race.price === 0 ? 'text-emerald-600' : 'text-slate-900'">
                  {{ race.price === 0 ? 'GRATUIT' : `${race.price} €` }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <button @click="handleDetails(race)" class="py-2.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
                  <i class="fa-solid fa-circle-info mr-1"></i>Détails
                </button>
                <button @click="handleRegister(race)" class="py-2.5 px-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
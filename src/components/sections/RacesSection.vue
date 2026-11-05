<script setup>
import { ref } from 'vue';

const epreuves = ref([
  {
    id: 1,
    public: '+16 ANS',
    titre: 'Course 10 km',
    headerBg: 'bg-[#0f8b54]',
    lignes: [
      { label: 'Départ', val: '09h45' },
      { label: 'Parcours', val: 'Chemin et route' },
      { label: 'Condition', val: 'PPS / FFA requis', badge: true, badgeBg: 'bg-amber-100 text-amber-900' }
    ],
    prix: '10 €'
  },
  {
    id: 2,
    public: '+16 ANS',
    titre: 'Course 6 km',
    headerBg: 'bg-[#0f8b54]',
    lignes: [
      { label: 'Départ', val: '10h00' },
      { label: 'Parcours', val: 'Route' },
      { label: 'Condition', val: 'PPS / FFA requis', badge: true, badgeBg: 'bg-amber-100 text-amber-900' }
    ],
    prix: '6 €'
  },
  {
    id: 3,
    public: '10-16 ANS',
    titre: 'Course 3 km',
    headerBg: 'bg-[#0f8b54]',
    lignes: [
      { label: 'Départ', val: '11h00' },
      { label: 'Parcours', val: 'Route' },
      { label: 'Condition', val: 'Autorisation parentale', badge: true, badgeBg: 'bg-amber-100 text-amber-900' }
    ],
    prix: '3 €'
  },
  {
    id: 4,
    public: 'TOUS PUBLICS',
    titre: 'Marche 6 km',
    headerBg: 'bg-[#14b8a6]',
    lignes: [
      { label: 'Départ', val: '09h00' },
      { label: 'Allure', val: 'Libre' },
      { label: 'Condition', val: 'Non requis' }
    ],
    prix: '6 €'
  },
  {
    id: 5,
    public: 'TOUS PUBLICS',
    titre: 'Marche 3 km',
    headerBg: 'bg-[#14b8a6]',
    lignes: [
      { label: 'Départ', val: '09h15' },
      { label: 'Allure', val: 'Libre' },
      { label: 'Condition', val: 'Non requis' }
    ],
    prix: '3 €'
  },
  {
    id: 6,
    public: '-10 ANS',
    titre: 'Course 1,2 km',
    headerBg: 'bg-[#f59e0b]',
    lignes: [
      { label: 'Départ', val: '11h20' },
      { label: 'Condition', val: 'Autorisation parentale' }
    ],
    prix: 'Gratuit'
  }
]);

const selectedEpreuve = ref(null);
const openDetails = (epreuve) => {
  selectedEpreuve.value = epreuve;
};
</script>

<template>
  <section id="epreuves" class="py-12 bg-transparent">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <div 
          v-for="epreuve in epreuves" 
          :key="epreuve.id"
          class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition duration-200 overflow-hidden flex flex-col justify-between"
        >
          <!-- En-tête coloré plein -->
          <div :class="[epreuve.headerBg, 'px-6 pt-6 pb-5 text-white flex flex-col justify-center']">
            <span class="text-xs sm:text-sm font-black tracking-wider uppercase text-emerald-100/90 mb-1">
              {{ epreuve.public }}
            </span>
            <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {{ epreuve.titre }}
            </h3>
          </div>

          <!-- Corps de la carte -->
          <div class="p-6 flex-1 flex flex-col justify-between space-y-6">
            <!-- Liste en rangées avec séparateur fin -->
            <div class="divide-y divide-slate-100">
              <div 
                v-for="(ligne, idx) in epreuve.lignes" 
                :key="idx"
                class="py-3 flex items-center justify-between text-base"
              >
                <!-- Libellé à gauche -->
                <span class="text-slate-500 font-normal">
                  {{ ligne.label }}
                </span>

                <!-- Valeur à droite : badge ou texte gras -->
                <span 
                  v-if="ligne.badge"
                  :class="[ligne.badgeBg, 'px-3 py-1 rounded-md text-sm font-semibold tracking-wide inline-block']"
                >
                  {{ ligne.val }}
                </span>
                <span 
                  v-else
                  class="font-black text-slate-900 tracking-tight"
                >
                  {{ ligne.val }}
                </span>
              </div>
            </div>

            <!-- Pied de carte : Prix et bouton Détails -->
            <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span class="text-xl font-black text-slate-900 font-mono">{{ epreuve.prix }}</span>
              </div>

              <button 
                @click="openDetails(epreuve)"
                class="group relative inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-900 hover:text-emerald-700 transition cursor-pointer py-1"
              >
                <span>Détails</span>
                <span class="absolute bottom-0 left-0 w-8 h-[2px] bg-slate-900 group-hover:w-full group-hover:bg-emerald-600 transition-all duration-200"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modale de détails -->
    <div v-if="selectedEpreuve" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button 
          @click="selectedEpreuve = null" 
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer text-lg"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>

        <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md">
          {{ selectedEpreuve.public }}
        </span>

        <h3 class="text-2xl font-black text-slate-900 mt-2 uppercase tracking-tight">
          {{ selectedEpreuve.titre }}
        </h3>

        <div class="divide-y divide-slate-100 my-5 py-2 border-y border-slate-100 text-sm">
          <div v-for="(ligne, idx) in selectedEpreuve.lignes" :key="idx" class="py-2.5 flex justify-between items-center">
            <span class="text-slate-500">{{ ligne.label }}</span>
            <span 
              v-if="ligne.badge"
              :class="[ligne.badgeBg, 'px-2.5 py-0.5 rounded text-xs font-semibold']"
            >
              {{ ligne.val }}
            </span>
            <span v-else class="font-black text-slate-900">
              {{ ligne.val }}
            </span>
          </div>
          <div class="py-2.5 flex justify-between items-center">
            <span class="text-slate-500">Tarif</span>
            <span class="text-emerald-700 font-black text-base">{{ selectedEpreuve.prix }}</span>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            @click="selectedEpreuve = null"
            class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
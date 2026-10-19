<script setup>
import ModalWrapper from './ModalWrapper.vue';
import { useModal } from '../../composables/useModal';
import { useToast } from '../../composables/useToast';

const { activeModal, closeModal } = useModal();
const { triggerToast } = useToast();

const racesList = [
  {
    name: 'Course Nature 10 km',
    desc: 'Départ 09h45 • PPS requis',
    price: '10 €',
  },
  {
    name: 'Course Populaire 6 km',
    desc: 'Départ 10h00 • Chrono',
    price: '6 €',
  },
  {
    name: 'Course Jeunes 3 km (10-16 ans)',
    desc: 'Départ 11h00',
    price: '3 €',
  },
  {
    name: 'Course Enfants 1,2 km (< 10 ans)',
    desc: 'Départ 11h20 • Encadrée',
    price: 'Gratuit',
    isFree: true,
  },
  {
    name: 'Marche Solidaire 6 km',
    desc: 'Départ 09h00 • Allure libre',
    price: '6 €',
  },
  {
    name: 'Marche Solidaire 3 km',
    desc: 'Départ 09h15 • Boucle douce',
    price: '3 €',
  },
];

const handleHelloAssoRedirect = () => {
  closeModal();
  triggerToast('Redirection vers la billetterie HelloAsso...');
};
</script>

<template>
  <ModalWrapper
    :show="activeModal === 'inscription'"
    maxWidthClass="max-w-md"
    @close="closeModal"
  >
    <div class="text-center mb-6">
      <div
        class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl"
      >
        <i class="fa-solid fa-ticket"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900">
        Inscriptions Pas d'oubli 2027
      </h3>
      <p class="text-xs text-slate-500 mt-1">
        Billetterie sécurisée HelloAsso sans commission.
      </p>
    </div>

    <!-- Liste des épreuves -->
    <div class="space-y-2.5 mb-6 text-left">
      <div
        v-for="(race, index) in racesList"
        :key="index"
        class="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-emerald-500 transition"
      >
        <div>
          <div class="font-bold text-sm text-slate-900">{{ race.name }}</div>
          <div class="text-xs text-slate-500">{{ race.desc }}</div>
        </div>
        <span
          :class="
            race.isFree
              ? 'text-emerald-600 text-xs font-black uppercase'
              : 'text-emerald-700 font-bold text-sm'
          "
        >
          {{ race.price }}
        </span>
      </div>
    </div>

    <!-- Bouton HelloAsso -->
    <button
      @click="handleHelloAssoRedirect"
      class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow"
    >
      <span>Accéder à HelloAsso</span>
      <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
    </button>

    <p class="text-[11px] text-center text-slate-400 mt-3">
      Ouverture complète des inscriptions début 2027.
    </p>
  </ModalWrapper>
</template>

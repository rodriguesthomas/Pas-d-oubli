<script setup>
import { ref } from 'vue';
import ModalWrapper from './ModalWrapper.vue';
import { useModal } from '../../composables/useModal';
import { useToast } from '../../composables/useToast';

const { activeModal, closeModal } = useModal();
const { triggerToast } = useToast();

const selectedAmount = ref(25);
const amounts = [10, 25, 50];

const confirmDonation = () => {
  closeModal();
  triggerToast("Merci pour votre générosité ! Redirection vers la page de don...");
};
</script>

<template>
  <ModalWrapper :show="activeModal === 'don'" @close="closeModal">
    <div class="text-center mb-6">
      <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 text-xl">
        <i class="fa-solid fa-heart"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900">Faire un don solidaire</h3>
      <p class="text-xs text-slate-500 mt-1">Vous souhaitez soutenir France Alzheimer 37 ?</p>
    </div>

    <div class="grid grid-cols-3 gap-3 mb-6">
      <button 
        v-for="amt in amounts" 
        :key="amt"
        @click="selectedAmount = amt" 
        :class="selectedAmount === amt ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-800' : 'border border-slate-200 text-slate-800'"
        class="py-3 rounded-xl font-bold text-center transition"
      >
        {{ amt }} €
      </button>
    </div>

    <div class="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 mb-6">
      <i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i>
      Un don de <strong>{{ selectedAmount }} €</strong> ne coûte que 
      <strong>{{ (selectedAmount * 0.34).toFixed(2).replace('.', ',') }} €</strong> après déduction fiscale de 66%.
    </div>

    <button @click="confirmDonation" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2">
      <span>Confirmer mon don en ligne</span>
      <i class="fa-solid fa-shield-heart"></i>
    </button>
  </ModalWrapper>
</template>
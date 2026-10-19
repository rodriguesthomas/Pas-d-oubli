<script setup>
import ModalWrapper from './ModalWrapper.vue';
import { useModal } from '../../composables/useModal';

const { activeModal, modalPayload, openModal, closeModal } = useModal();

const proceedToRegister = () => {
  const race = modalPayload.value;
  closeModal();
  openModal('inscription', race);
};
</script>

<template>
  <ModalWrapper
    :show="activeModal === 'details'"
    maxWidthClass="max-w-lg"
    @close="closeModal"
  >
    <div v-if="modalPayload" class="space-y-4 text-left">
      <h3 class="text-xl font-bold text-slate-900">{{ modalPayload.name }}</h3>
      <p class="text-slate-600 text-sm leading-relaxed">
        {{ modalPayload.detailsText }}
      </p>

      <div class="pt-4 border-t border-slate-100 flex justify-end">
        <button
          @click="proceedToRegister"
          class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition"
        >
          S'inscrire à cette épreuve
        </button>
      </div>
    </div>
  </ModalWrapper>
</template>

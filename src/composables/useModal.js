import { ref, watch } from 'vue';

const activeModal = ref(null); // 'inscription' | 'don' | 'benevole' | 'details' | null
const modalPayload = ref(null);

export function useModal() {
  const openModal = (id, payload = null) => {
    activeModal.value = id;
    modalPayload.value = payload;
  };

  const closeModal = () => {
    activeModal.value = null;
    modalPayload.value = null;
  };

  // Bloque le défilement de l'arrière-plan
  watch(activeModal, (val) => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = val ? 'hidden' : '';
    }
  });

  return { activeModal, modalPayload, openModal, closeModal };
}
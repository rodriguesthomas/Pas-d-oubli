<script setup>
import { ref } from 'vue';
import ModalWrapper from './ModalWrapper.vue';
import { useModal } from '../../composables/useModal';
import { useToast } from '../../composables/useToast';

const { activeModal, closeModal } = useModal();
const { triggerToast } = useToast();

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  poles: [],
  message: '',
});

const handleSubmit = () => {
  closeModal();
  triggerToast(
    'Candidature bénévole bien reçue ! Merci pour votre engagement.'
  );
  form.value = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    poles: [],
    message: '',
  };
};
</script>

<template>
  <ModalWrapper
    :show="activeModal === 'benevole'"
    maxWidthClass="max-w-lg"
    @close="closeModal"
  >
    <div class="text-center mb-6">
      <div
        class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl"
      >
        <i class="fa-solid fa-hand-holding-heart"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900">
        Rejoindre l'équipe bénévole
      </h3>
      <p class="text-xs text-slate-500 mt-1">
        Les champs marqués d'un astérisque (*) sont obligatoires.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-3.5 text-left">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
            >Nom *</label
          >
          <input
            v-model="form.nom"
            required
            type="text"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
            >Prénom *</label
          >
          <input
            v-model="form.prenom"
            required
            type="text"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
            placeholder="Votre prénom"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
          >Adresse e-mail *</label
        >
        <input
          v-model="form.email"
          required
          type="email"
          class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
          placeholder="exemple@email.fr"
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
          >Numéro de téléphone *</label
        >
        <input
          v-model="form.telephone"
          required
          type="tel"
          class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
          placeholder="06 00 00 00 00"
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
          >Quel(s) pôle(s) vous intéresse(nt) ? *</label
        >
        <div class="space-y-1.5 text-xs text-slate-700">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value="Parcours"
              v-model="form.poles"
              class="accent-emerald-600 w-4 h-4 rounded"
            />
            <span>Parcours</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value="Réapprovisionnement"
              v-model="form.poles"
              class="accent-emerald-600 w-4 h-4 rounded"
            />
            <span>Réapprovisionnement</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value="Animation"
              v-model="form.poles"
              class="accent-emerald-600 w-4 h-4 rounded"
            />
            <span>Animation</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              value="Remise des médailles"
              v-model="form.poles"
              class="accent-emerald-600 w-4 h-4 rounded"
            />
            <span>Remise des médailles</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
          >Message (facultatif)</label
        >
        <textarea
          v-model="form.message"
          rows="2"
          class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
          placeholder="Vos disponibilités..."
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition"
      >
        Préparer ma demande
      </button>
    </form>
  </ModalWrapper>
</template>

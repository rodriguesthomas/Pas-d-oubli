<script setup>
import { ref } from 'vue';
import { useToast } from '../../composables/useToast';

const { triggerToast } = useToast();

const form = ref({
  nom: '',
  email: '',
  sujet: 'question',
  message: '',
});

const handleSubmit = () => {
  triggerToast(
    'Votre message a bien été envoyé. Nous vous répondrons sous 48h.'
  );
  form.value = {
    nom: '',
    email: '',
    sujet: 'question',
    message: '',
  };
};
</script>

<template>
  <section id="contact" class="py-16 bg-slate-100/60">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md"
      >
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-slate-900">
            Une question ? Écrivez-nous[cite: 1]
          </h3>
          <p class="text-slate-600 text-sm mt-1">
            L'équipe de l'association Pas d'oubli vous répond sous 48h.[cite: 1]
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-bold uppercase text-slate-600 mb-1"
                >Votre Nom & Prénom[cite: 1]</label
              >
              <input
                v-model="form.nom"
                required
                type="text"
                placeholder="Ex. Thomas Conceicao"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label
                class="block text-xs font-bold uppercase text-slate-600 mb-1"
                >Votre Adresse Email[cite: 1]</label
              >
              <input
                v-model="form.email"
                required
                type="email"
                placeholder="Ex. contact@exemple.fr"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
              >Objet du message[cite: 1]</label
            >
            <select
              v-model="form.sujet"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:border-emerald-600 outline-none"
            >
              <option value="question">
                Question sur les courses[cite: 1]
              </option>
              <option value="sponsor">Devenir sponsor / mécène[cite: 1]</option>
              <option value="presse">Presse & Médias[cite: 1]</option>
              <option value="autre">Autre demande[cite: 1]</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1"
              >Votre Message[cite: 1]</label
            >
            <textarea
              v-model="form.message"
              required
              rows="4"
              placeholder="Comment pouvons-nous vous aider ?"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow"
          >
            <i class="fa-solid fa-paper-plane"></i>
            <span>Envoyer mon message[cite: 1]</span>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

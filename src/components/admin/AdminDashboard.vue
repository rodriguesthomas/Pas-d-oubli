<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import { useToast } from '../../composables/useToast';

const { triggerToast } = useToast();

// État d'authentification
const user = ref(null);
const authLoading = ref(true);
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');

// Données de l'admin
const currentTab = ref('messages');
const messages = ref([]);
const faqs = ref([]);
const volunteers = ref([]);
const selectedMessage = ref(null);

const showFaqModal = ref(false);
const faqForm = ref({ question: '', reponse: '' });

const availabilityLabels = {
  jour_j: 'Le jour J (dimanche)',
  veille: 'La veille (samedi)',
  les_deux: 'Tout le week-end',
  avant: 'En amont / Préparation'
};

const poleLabels = {
  communication: 'Communication',
  animation: 'Animation',
  parcours: 'Parcours',
  infrastructures: 'Infrastructures',
  dossards: 'Retrait dossards',
  sponsor: 'Sponsors',
  logistique: 'Logistique'
};

// Connexion
const handleLogin = async () => {
  loginError.value = '';
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value
  });

  if (error) {
    loginError.value = 'Identifiants incorrects.';
  } else {
    user.value = data.user;
    loadData();
  }
};

// Déconnexion
const handleLogout = async () => {
  await supabase.auth.signOut();
  user.value = null;
  window.location.hash = ''; // Redirige vers l'accueil
};

// Vérification de la session au chargement
onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  user.value = data.session?.user || null;
  authLoading.value = false;

  if (user.value) {
    loadData();
  }
});

const loadData = async () => {
  const { data: msgData } = await supabase.from('messages').select('*').order('id', { ascending: false });
  if (msgData) messages.value = msgData;

  const { data: faqData } = await supabase.from('faqs').select('*').order('id', { ascending: false });
  if (faqData) faqs.value = faqData;

  const { data: volData } = await supabase.from('volunteers').select('*').order('id', { ascending: false });
  if (volData) volunteers.value = volData;
};

// Logique existante messages / FAQ / bénévoles
const selectMsg = async (msg) => {
  selectedMessage.value = msg;
  if (!msg.read) {
    msg.read = true;
    await supabase.from('messages').update({ read: true }).eq('id', msg.id);
  }
};

const deleteMsg = async (id) => {
  await supabase.from('messages').delete().eq('id', id);
  messages.value = messages.value.filter(m => m.id !== id);
  if (selectedMessage.value?.id === id) selectedMessage.value = null;
  triggerToast('Message supprimé.');
};

const deleteVolunteer = async (id) => {
  await supabase.from('volunteers').delete().eq('id', id);
  volunteers.value = volunteers.value.filter(v => v.id !== id);
  triggerToast('Candidature retirée.');
};

const openFaqModalFromMessage = (msg) => {
  faqForm.value = { question: msg.message, reponse: '' };
  showFaqModal.value = true;
};

const handleSaveFaq = async () => {
  if (!faqForm.value.question || !faqForm.value.reponse) return;

  const { data, error } = await supabase.from('faqs').insert([faqForm.value]).select();
  if (!error && data) {
    faqs.value.unshift(data[0]);
    showFaqModal.value = false;
    faqForm.value = { question: '', reponse: '' };
    triggerToast('Question ajoutée à la FAQ !');
  }
};

const deleteFaq = async (id) => {
  await supabase.from('faqs').delete().eq('id', id);
  faqs.value = faqs.value.filter(f => f.id !== id);
  triggerToast('Question retirée de la FAQ.');
};
</script>

<template>
  <!-- Chargement initial -->
  <div v-if="authLoading" class="min-h-screen flex items-center justify-center bg-slate-100">
    <i class="fa-solid fa-circle-notch fa-spin text-2xl text-emerald-600"></i>
  </div>

  <!-- ÉCRAN 1 : FORMULAIRE DE CONNEXION (si non connecté) -->
  <div v-else-if="!user" class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
      <div class="text-center mb-6">
        <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto text-xl mb-3">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900">Espace réservé</h2>
        <p class="text-xs text-slate-500 mt-1">Connexion requise pour accéder aux messages et à la FAQ.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Adresse e-mail</label>
          <input 
            v-model="loginEmail" 
            required 
            type="email" 
            placeholder="admin@pasdoubli.fr"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
          />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Mot de passe</label>
          <input 
            v-model="loginPassword" 
            required 
            type="password" 
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
          />
        </div>

        <p v-if="loginError" class="text-xs text-rose-600 font-semibold text-center">
          {{ loginError }}
        </p>

        <button 
          type="submit" 
          class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition cursor-pointer"
        >
          Se connecter
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="/" class="text-xs text-slate-400 hover:text-slate-600">
          <i class="fa-solid fa-arrow-left mr-1"></i>Retour au site
        </a>
      </div>
    </div>
  </div>

  <!-- ÉCRAN 2 : TABLEAU DE BORD (si authentifié) -->
  <div v-else class="min-h-screen bg-slate-100 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- En-tête avec bouton Déconnexion -->
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Espace Administration</h1>
          <p class="text-xs text-slate-500">Connecté en tant que {{ user.email }}</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/" class="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-3.5 py-2 rounded-xl hover:bg-emerald-50 transition">
            <i class="fa-solid fa-globe mr-1.5"></i>Voir le site
          </a>
          <button 
            @click="handleLogout" 
            class="text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <i class="fa-solid fa-right-from-bracket mr-1.5"></i>Déconnexion
          </button>
        </div>
      </div>

      <!-- Onglets -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <button 
          @click="currentTab = 'messages'" 
          :class="currentTab === 'messages' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'"
          class="px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
        >
          Messages ({{ messages.length }})
        </button>
        <button 
          @click="currentTab = 'benevoles'" 
          :class="currentTab === 'benevoles' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'"
          class="px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
        >
          Candidatures Bénévoles ({{ volunteers.length }})
        </button>
        <button 
          @click="currentTab = 'faq'" 
          :class="currentTab === 'faq' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'"
          class="px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
        >
          FAQ ({{ faqs.length }})
        </button>
      </div>

      <!-- VUE 1 : MESSAGES -->
      <div v-if="currentTab === 'messages'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-[620px] overflow-y-auto shadow-xs">
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            @click="selectMsg(msg)"
            :class="[
              selectedMessage?.id === msg.id ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50',
              !msg.read ? 'font-bold bg-white' : 'text-slate-600'
            ]"
            class="p-4 cursor-pointer transition flex items-start justify-between gap-3"
          >
            <div class="overflow-hidden space-y-1">
              <div class="flex items-center gap-2">
                <span v-if="!msg.read" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="text-sm truncate text-slate-900 font-bold">{{ msg.nom }}</span>
              </div>
              <div class="text-xs text-emerald-700 font-medium truncate flex items-center gap-1.5">
                <i class="fa-regular fa-envelope text-[11px]"></i>
                <span>{{ msg.email }}</span>
              </div>
              <div class="text-xs text-slate-500 truncate">{{ msg.message }}</div>
            </div>
            <span class="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">
              {{ new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}
            </span>
          </div>
          <div v-if="messages.length === 0" class="p-8 text-center text-slate-400 text-xs">
            Aucun message reçu.
          </div>
        </div>

        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs min-h-[380px]">
          <template v-if="selectedMessage">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
              <div>
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {{ selectedMessage.sujet }}
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-2">{{ selectedMessage.nom }}</h3>
                <p class="text-sm text-slate-600 mt-1 flex items-center gap-2">
                  <i class="fa-solid fa-envelope text-emerald-600"></i>
                  <a :href="`mailto:${selectedMessage.email}`" class="text-emerald-700 hover:underline font-semibold">
                    {{ selectedMessage.email }}
                  </a>
                </p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="openFaqModalFromMessage(selectedMessage)"
                  class="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-circle-question"></i>
                  <span>Ajouter à la FAQ</span>
                </button>
                <button 
                  @click="deleteMsg(selectedMessage.id)"
                  class="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition border border-rose-200 cursor-pointer"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {{ selectedMessage.message }}
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <a 
                :href="`mailto:${selectedMessage.email}?subject=Re: Course Pas d'oubli&body=Bonjour ${selectedMessage.nom},%0D%0A%0D%0A`"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <i class="fa-solid fa-reply"></i>
                <span>Répondre par e-mail</span>
              </a>
            </div>
          </template>
          <div v-else class="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
            <i class="fa-regular fa-envelope-open text-4xl mb-2 text-slate-300"></i>
            <p class="text-xs">Sélectionnez un message dans la colonne de gauche.</p>
          </div>
        </div>
      </div>

      <!-- VUE 2 : BÉNÉVOLES -->
      <div v-if="currentTab === 'benevoles'" class="space-y-4">
        <div class="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
          <div 
            v-for="b in volunteers" 
            :key="b.id" 
            class="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 transition"
          >
            <div class="space-y-2">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="font-bold text-slate-900 text-base">{{ b.prenom }} {{ b.nom }}</span>
                <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  {{ availabilityLabels[b.disponibilites] || b.disponibilites }}
                </span>
                <span class="text-xs text-slate-400">
                  {{ new Date(b.created_at).toLocaleDateString('fr-FR') }}
                </span>
              </div>

              <div class="flex flex-wrap gap-1.5 pt-0.5">
                <span 
                  v-for="pole in b.poles" 
                  :key="pole"
                  class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                >
                  <i class="fa-solid fa-check text-emerald-600 mr-1 text-[10px]"></i>
                  {{ poleLabels[pole] || pole }}
                </span>
              </div>

              <div class="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
                <a :href="`mailto:${b.email}`" class="text-emerald-700 hover:underline flex items-center gap-1.5 font-medium">
                  <i class="fa-regular fa-envelope"></i>{{ b.email }}
                </a>
                <a :href="`tel:${b.telephone}`" class="text-slate-700 hover:underline flex items-center gap-1.5 font-medium">
                  <i class="fa-solid fa-phone"></i>{{ b.telephone }}
                </a>
              </div>

              <p v-if="b.remarques" class="text-xs text-slate-600 italic bg-slate-50 border border-slate-100 p-2.5 rounded-xl max-w-2xl mt-1">
                « {{ b.remarques }} »
              </p>
            </div>

            <div class="flex items-center gap-2 self-end lg:self-center">
              <a 
                :href="`mailto:${b.email}?subject=Association Pas d'oubli - Votre candidature bénévole&body=Bonjour ${b.prenom},%0D%0A%0D%0ANous vous remercions pour votre proposition d'aide sur l'événement Pas d'oubli...`"
                class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <i class="fa-solid fa-reply"></i>
                <span>Contacter</span>
              </a>
              <button 
                @click="deleteVolunteer(b.id)" 
                class="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                title="Supprimer la candidature"
              >
                <i class="fa-solid fa-trash text-sm"></i>
              </button>
            </div>
          </div>

          <div v-if="volunteers.length === 0" class="p-12 text-center text-slate-400 text-xs">
            Aucune candidature bénévole enregistrée pour le moment.
          </div>
        </div>
      </div>

      <!-- VUE 3 : FAQ -->
      <div v-if="currentTab === 'faq'" class="space-y-4">
        <div class="flex justify-end">
          <button 
            @click="faqForm = { question: '', reponse: '' }; showFaqModal = true" 
            class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <i class="fa-solid fa-plus"></i>
            <span>Créer une question manuelle</span>
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          <div v-for="item in faqs" :key="item.id" class="p-5 flex items-start justify-between gap-4">
            <div class="space-y-1.5">
              <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                {{ item.question }}
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-4">{{ item.reponse }}</p>
            </div>
            <button 
              @click="deleteFaq(item.id)" 
              class="text-slate-400 hover:text-rose-600 p-2 text-sm transition cursor-pointer"
              title="Supprimer"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div v-if="faqs.length === 0" class="p-8 text-center text-slate-400 text-xs">
            La FAQ est vide.
          </div>
        </div>
      </div>

      <!-- MODALE FAQ -->
      <div v-if="showFaqModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
          <button @click="showFaqModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          <h3 class="text-lg font-black text-slate-900 mb-1">Ajouter à la FAQ</h3>
          <p class="text-xs text-slate-500 mb-4">Sera directement visible sur la page d'accueil.</p>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Question</label>
              <input v-model="faqForm.question" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Réponse publique</label>
              <textarea v-model="faqForm.reponse" rows="4" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600"></textarea>
            </div>
            <button @click="handleSaveFaq" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer">
              Publier sur la FAQ
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
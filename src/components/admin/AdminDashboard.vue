<script setup>
import { ref, onMounted } from 'vue';

const messages = ref([]);
const selectedMessage = ref(null);
const filter = ref('all'); // 'all', 'unread', 'read'

// Clé de stockage (partagée entre formulaires et page admin)
const STORAGE_KEY = 'pas_doubli_contact_messages';

const loadMessages = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    messages.value = JSON.parse(data);
  } else {
    // Exemples par défaut si vide
    messages.value = [
      {
        id: '1',
        nom: 'Camille Martin',
        email: 'camille@exemple.fr',
        sujet: 'sponsor',
        message: 'Bonjour, notre entreprise aimerait devenir sponsor pour l’édition 2027.',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ];
  }
};

const saveMessages = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value));
};

const openMessage = (msg) => {
  selectedMessage.value = msg;
  if (!msg.read) {
    msg.read = true;
    saveMessages();
  }
};

const deleteMessage = (id) => {
  messages.value = messages.value.filter(m => m.id !== id);
  if (selectedMessage.value?.id === id) {
    selectedMessage.value = null;
  }
  saveMessages();
};

const getSubjectLabel = (key) => {
  const map = {
    question: 'Question sur les courses',
    sponsor: 'Devenir sponsor / mécène',
    presse: 'Presse & Médias',
    autre: 'Autre demande'
  };
  return map[key] || key;
};

// Écoute les nouveaux messages envoyés depuis un autre onglet en temps réel
onMounted(() => {
  loadMessages();
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) loadMessages();
  });
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Espace Administration</h1>
          <p class="text-xs text-slate-500">Boîte de réception des messages du site</p>
        </div>
        <a href="/" class="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-3.5 py-2 rounded-xl hover:bg-emerald-50 transition">
          <i class="fa-solid fa-arrow-left mr-1.5"></i>Retour au site
        </a>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <!-- Liste des messages (Gauche) -->
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <span class="font-bold text-sm text-slate-800">
              Messages ({{ messages.length }})
            </span>
            <div class="flex gap-1 text-xs">
              <button 
                @click="filter = 'all'" 
                :class="filter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'"
                class="px-2.5 py-1 rounded-lg font-semibold transition"
              >
                Tous
              </button>
              <button 
                @click="filter = 'unread'" 
                :class="filter === 'unread' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200'"
                class="px-2.5 py-1 rounded-lg font-semibold transition"
              >
                Non lus
              </button>
            </div>
          </div>

          <div class="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            <div 
              v-for="msg in messages.filter(m => filter === 'all' || !m.read)" 
              :key="msg.id"
              @click="openMessage(msg)"
              :class="[
                selectedMessage?.id === msg.id ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50',
                !msg.read ? 'font-bold bg-white' : 'text-slate-600'
              ]"
              class="p-4 cursor-pointer transition flex items-start justify-between gap-3"
            >
              <div class="overflow-hidden">
                <div class="flex items-center gap-2">
                  <span v-if="!msg.read" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  <span class="text-sm truncate text-slate-900">{{ msg.nom }}</span>
                </div>
                <div class="text-xs text-slate-500 font-medium truncate mt-0.5">
                  {{ getSubjectLabel(msg.sujet) }}
                </div>
                <div class="text-xs text-slate-400 truncate mt-1">
                  {{ msg.message }}
                </div>
              </div>
              <span class="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">
                {{ new Date(msg.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}
              </span>
            </div>

            <div v-if="messages.length === 0" class="p-8 text-center text-xs text-slate-400">
              Aucun message reçu pour le moment.
            </div>
          </div>
        </div>

        <!-- Détail du message sélectionné (Droite) -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs min-h-[350px]">
          <template v-if="selectedMessage">
            <div class="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {{ getSubjectLabel(selectedMessage.sujet) }}
                </span>
                <h3 class="text-lg font-black text-slate-900 mt-2">{{ selectedMessage.nom }}</h3>
                <p class="text-xs text-slate-500">
                  <a :href="`mailto:${selectedMessage.email}`" class="text-emerald-700 hover:underline">
                    {{ selectedMessage.email }}
                  </a>
                  • Reçu le {{ new Date(selectedMessage.date).toLocaleString('fr-FR') }}
                </p>
              </div>

              <button 
                @click="deleteMessage(selectedMessage.id)"
                class="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition border border-rose-200"
              >
                <i class="fa-solid fa-trash mr-1"></i>Supprimer
              </button>
            </div>

            <div class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {{ selectedMessage.message }}
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <a 
                :href="`mailto:${selectedMessage.email}?subject=RE: ${getSubjectLabel(selectedMessage.sujet)}`"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <i class="fa-solid fa-reply"></i>
                <span>Répondre par email</span>
              </a>
            </div>
          </template>

          <div v-else class="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
            <i class="fa-regular fa-envelope-open text-4xl mb-2 text-slate-300"></i>
            <p class="text-xs">Sélectionnez un message à gauche pour afficher son contenu.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
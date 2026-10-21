<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import { useToast } from '../../composables/useToast';

const { triggerToast } = useToast();

const currentTab = ref('messages');
const messages = ref([]);
const faqs = ref([]);
const selectedMessage = ref(null);

const showFaqModal = ref(false);
const faqForm = ref({ question: '', reponse: '' });

// Charger les messages et les FAQ depuis Supabase
const loadData = async () => {
  const { data: msgData } = await supabase.from('messages').select('*').order('id', { ascending: false }); //
  if (msgData) messages.value = msgData;

  const { data: faqData } = await supabase.from('faqs').select('*').order('id', { ascending: false }); //
  if (faqData) faqs.value = faqData;
};

// Marquer comme lu
const selectMsg = async (msg) => {
  selectedMessage.value = msg;
  if (!msg.read) {
    msg.read = true;
    await supabase.from('messages').update({ read: true }).eq('id', msg.id); //
  }
};

// Supprimer un message
const deleteMsg = async (id) => {
  await supabase.from('messages').delete().eq('id', id); //
  messages.value = messages.value.filter(m => m.id !== id);
  if (selectedMessage.value?.id === id) selectedMessage.value = null;
  triggerToast("Message supprimé.");
};

// Préparer l'ajout d'une question à la FAQ
const openFaqModalFromMessage = (msg) => {
  faqForm.value = {
    question: msg.message,
    reponse: ''
  };
  showFaqModal.value = true;
};

// Sauvegarder dans la FAQ
const handleSaveFaq = async () => {
  if (!faqForm.value.question || !faqForm.value.reponse) return;

  const { data, error } = await supabase
    .from('faqs')
    .insert([faqForm.value])
    .select(); //

  if (!error && data) {
    faqs.value.unshift(data[0]);
    showFaqModal.value = false;
    faqForm.value = { question: '', reponse: '' };
    triggerToast("Question publiée sur le site !");
  }
};

// Supprimer un élément FAQ
const deleteFaq = async (id) => {
  await supabase.from('faqs').delete().eq('id', id); //
  faqs.value = faqs.value.filter(f => f.id !== id);
  triggerToast("Question retirée de la FAQ.");
};

onMounted(loadData);
</script>

<template>
  <div class="min-h-screen bg-slate-100 p-4 sm:p-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Administration & Base de données</h1>
          <p class="text-xs text-slate-500">Données synchronisées avec Supabase</p>
        </div>
        <a href="/" class="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-3.5 py-2 rounded-xl hover:bg-emerald-50 transition">
          <i class="fa-solid fa-arrow-left mr-1.5"></i>Retour au site
        </a>
      </div>

      <!-- Sélecteur d'onglets -->
      <div class="flex gap-2 mb-6">
        <button 
          @click="currentTab = 'messages'" 
          :class="currentTab === 'messages' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'"
          class="px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
        >
          Messages Reçus ({{ messages.length }})
        </button>
        <button 
          @click="currentTab = 'faq'" 
          :class="currentTab === 'faq' ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700'"
          class="px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
        >
          Gestion FAQ ({{ faqs.length }})
        </button>
      </div>

      <!-- ONGLET 1 : MESSAGES -->
      <div v-if="currentTab === 'messages'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-[600px] overflow-y-auto shadow-xs">
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
            <div class="overflow-hidden">
              <div class="flex items-center gap-2">
                <span v-if="!msg.read" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="text-sm truncate text-slate-900">{{ msg.nom }}</span>
              </div>
              <div class="text-xs text-slate-500 font-medium truncate mt-0.5">{{ msg.sujet }}</div>
              <div class="text-xs text-slate-400 truncate mt-1">{{ msg.message }}</div>
            </div>
            <span class="text-[10px] text-slate-400 flex-shrink-0">
              {{ new Date(msg.created_at).toLocaleDateString('fr-FR') }}
            </span>
          </div>

          <div v-if="messages.length === 0" class="p-8 text-center text-slate-400 text-xs">
            Aucun message dans la base.
          </div>
        </div>

        <!-- Détail du message -->
        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs min-h-[350px]">
          <template v-if="selectedMessage">
            <div class="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 class="text-lg font-black text-slate-900">{{ selectedMessage.nom }}</h3>
                <p class="text-xs text-slate-500">{{ selectedMessage.email }}</p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="openFaqModalFromMessage(selectedMessage)"
                  class="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  <i class="fa-solid fa-plus-circle mr-1"></i>Ajouter à la FAQ
                </button>
                <button 
                  @click="deleteMsg(selectedMessage.id)"
                  class="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition border border-rose-200 cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {{ selectedMessage.message }}
            </div>
          </template>
          <div v-else class="h-64 flex items-center justify-center text-slate-400 text-xs">
            Sélectionnez un message pour voir son contenu et le basculer en FAQ.
          </div>
        </div>
      </div>

      <!-- ONGLET 2 : FAQ -->
      <div v-if="currentTab === 'faq'" class="space-y-4">
        <div class="flex justify-end">
          <button 
            @click="faqForm = { question: '', reponse: '' }; showFaqModal = true" 
            class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <i class="fa-solid fa-plus mr-1.5"></i>Nouvelle question manuelle
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          <div v-for="item in faqs" :key="item.id" class="p-5 flex items-start justify-between gap-4">
            <div class="space-y-1">
              <h4 class="font-bold text-slate-900 text-sm">{{ item.question }}</h4>
              <p class="text-xs text-slate-600 leading-relaxed">{{ item.reponse }}</p>
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
            La FAQ est vide pour le moment.
          </div>
        </div>
      </div>

      <!-- MODALE CRÉATION FAQ -->
      <div v-if="showFaqModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
          <button @click="showFaqModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>

          <h3 class="text-lg font-black text-slate-900 mb-4">Publier sur la FAQ</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Question</label>
              <input 
                v-model="faqForm.question" 
                type="text" 
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Votre Réponse publique</label>
              <textarea 
                v-model="faqForm.reponse" 
                rows="4" 
                placeholder="Rédigez la réponse qui sera visible par tous les visiteurs sur le site..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
              ></textarea>
            </div>
            <button 
              @click="handleSaveFaq" 
              class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer"
            >
              Enregistrer dans la base de données
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
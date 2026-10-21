<script setup>
import { ref, computed, watch } from 'vue';
import { supabase } from '../../services/supabase';
import { useModal } from '../../composables/useModal';
import { useToast } from '../../composables/useToast';

const { activeModal, closeModal } = useModal();
const { triggerToast } = useToast();

const loading = ref(false);

// Définition de tous les pôles existants
const allPolesMap = {
  communication: { id: 'communication', label: 'Communication', desc: 'Réseaux sociaux, photos/vidéos, presse et affichage' },
  animation: { id: 'animation', label: 'Animation', desc: 'Accueil des familles, animation sono, protocole et médailles' },
  parcours: { id: 'parcours', label: 'Parcours', desc: 'Signaleurs, sécurité des carrefours, gestion des ravitaillements' },
  infrastructures: { id: 'infrastructures', label: 'Mise en place des infrastructures', desc: 'Montage des barnums, barriérage, signalétique et scène' },
  dossards: { id: 'dossards', label: 'Retrait des dossards', desc: 'Accueil des inscrits, vérification des pièces et remise des sacs' },
  sponsor: { id: 'sponsor', label: 'Sponsor & Partenariats', desc: 'Démarchage et suivi des partenaires locaux et mécènes' },
  logistique: { id: 'logistique', label: 'Logistique générale', desc: 'Gestion des approvisionnements, stockage et transports' }
};

// Association disponibilité -> liste des pôles autorisés
const polesByAvailability = {
  jour_j: ['communication', 'animation', 'parcours', 'infrastructures'],
  veille: ['dossards', 'infrastructures'],
  les_deux: ['communication', 'animation', 'parcours', 'infrastructures', 'dossards'],
  avant: ['communication', 'animation', 'sponsor', 'logistique']
};

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  disponibilites: 'jour_j',
  poles: ['parcours'],
  remarques: ''
});

// Pôles visibles selon la disponibilité active
const availablePoles = computed(() => {
  const poleKeys = polesByAvailability[form.value.disponibilites] || [];
  return poleKeys.map(key => allPolesMap[key]);
});

// Nettoyer les pôles sélectionnés s'ils n'existent plus dans le nouveau choix
watch(() => form.value.disponibilites, () => {
  const allowed = polesByAvailability[form.value.disponibilites] || [];
  form.value.poles = form.value.poles.filter(p => allowed.includes(p));
  if (form.value.poles.length === 0 && allowed.length > 0) {
    form.value.poles = [allowed[0]];
  }
});

const togglePole = (id) => {
  if (form.value.poles.includes(id)) {
    form.value.poles = form.value.poles.filter(p => p !== id);
  } else {
    form.value.poles.push(id);
  }
};

const handleSubmit = async () => {
  if (form.value.poles.length === 0) {
    triggerToast("Veuillez sélectionner au moins un pôle d'activité.");
    return;
  }

  loading.value = true;
  try {
    const { error } = await supabase
      .from('volunteers')
      .insert([{
        nom: form.value.nom,
        prenom: form.value.prenom,
        email: form.value.email,
        telephone: form.value.telephone,
        disponibilites: form.value.disponibilites,
        poles: form.value.poles,
        remarques: form.value.remarques
      }]);

    if (error) throw error;

    triggerToast("Merci pour votre engagement ! Votre candidature a bien été enregistrée.");
    closeModal();
    form.value = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      disponibilites: 'jour_j',
      poles: ['parcours'],
      remarques: ''
    };
  } catch (err) {
    console.error(err);
    triggerToast("Erreur lors de l'enregistrement de votre candidature.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div 
    v-if="activeModal === 'benevole'" 
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
  >
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
      <button 
        @click="closeModal" 
        class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
      >
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>

      <div class="mb-6">
        <span class="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Engagement bénévole
        </span>
        <h3 class="text-xl font-black text-slate-900 mt-2">Rejoindre l'équipe</h3>
        <p class="text-xs text-slate-500 mt-1">Participez à la réussite de l'événement solidaire du 23 mai 2027.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nom / Prénom -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Prénom</label>
            <input 
              v-model="form.prenom" 
              required 
              type="text" 
              placeholder="Lucas" 
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Nom</label>
            <input 
              v-model="form.nom" 
              required 
              type="text" 
              placeholder="Dupont" 
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
            />
          </div>
        </div>

        <!-- Contact -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Email</label>
            <input 
              v-model="form.email" 
              required 
              type="email" 
              placeholder="lucas@exemple.fr" 
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
            />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Téléphone</label>
            <input 
              v-model="form.telephone" 
              required 
              type="tel" 
              placeholder="06 12 34 56 78" 
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" 
            />
          </div>
        </div>

        <!-- Sélecteur de disponibilité -->
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Vos disponibilités</label>
          <select 
            v-model="form.disponibilites" 
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-medium focus:border-emerald-600 outline-none"
          >
            <option value="jour_j">Le jour J (dimanche 23 mai)</option>
            <option value="veille">La veille (samedi 22 mai)</option>
            <option value="les_deux">Les deux (samedi & dimanche)</option>
            <option value="avant">En amont (préparation & organisation)</option>
          </select>
        </div>

        <!-- Pôles adaptés dynamiquement -->
        <div>
          <label class="block text-xs font-bold uppercase text-slate-700 mb-2">
            Missions souhaitées (selon votre disponibilité)
          </label>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            <div 
              v-for="pole in availablePoles" 
              :key="pole.id"
              @click="togglePole(pole.id)"
              :class="form.poles.includes(pole.id) ? 'border-emerald-600 bg-emerald-50/70' : 'border-slate-200 bg-slate-50/50'"
              class="p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none"
            >
              <div 
                :class="form.poles.includes(pole.id) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white'"
                class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
              >
                <i v-if="form.poles.includes(pole.id)" class="fa-solid fa-check text-white text-[10px]"></i>
              </div>
              <div>
                <span class="text-xs font-bold text-slate-900 block">{{ pole.label }}</span>
                <span class="text-[11px] text-slate-500">{{ pole.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Remarques -->
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Remarques ou compétences particulières (optionnel)</label>
          <textarea 
            v-model="form.remarques" 
            rows="2" 
            placeholder="Ex. Permis B, diplôme de secourisme, expérience sur les courses..." 
            class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
          ></textarea>
        </div>

        <button 
          :disabled="loading" 
          type="submit" 
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <i class="fa-solid fa-paper-plane"></i>
          <span>{{ loading ? 'Enregistrement...' : 'Envoyer ma candidature' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
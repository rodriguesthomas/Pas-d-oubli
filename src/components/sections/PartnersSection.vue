<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import { useModal } from '../../composables/useModal';

const { openModal } = useModal();
const sponsors = ref([]);
const loading = ref(true);

const fetchSponsors = async () => {
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('id', { ascending: true });

  if (!error && data) {
    sponsors.value = data;
  }
  loading.value = false;
};

onMounted(fetchSponsors);
</script>

<template>
  <section id="partenaires" class="py-20 bg-transparent border-t border-slate-200/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Encart Bénévoles -->
      <div id="benevoles" class="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white mb-16 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-emerald-300">Mobilisation</span>
          <h3 class="text-2xl sm:text-3xl font-black mt-1">Envie de vivre l'aventure de l'intérieur ?</h3>
          <p class="text-emerald-100 text-sm sm:text-base mt-2 max-w-xl">
            Signaleurs, ravitaillement, accueil : rejoignez notre équipe bénévole pour faire de cette première édition une réussite !
          </p>
        </div>
        <button 
          @click="openModal('benevole')" 
          class="flex-shrink-0 px-6 py-3.5 bg-white text-emerald-900 font-bold text-sm rounded-xl hover:bg-slate-100 transition shadow-md cursor-pointer"
        >
          <i class="fa-solid fa-hand-holding-heart mr-2"></i>Devenir bénévole
        </button>
      </div>

      <!-- Partenaires & Mécènes -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-emerald-700 bg-white border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-xs">
          Soutiens & Mécénat d'Entreprise
        </span>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">Ils soutiennent l'événement</h3>
        <p class="text-slate-700 mt-2 text-sm font-medium">
          Entreprises, commerçants : associez votre image à une action positive avec une déduction d'impôt de <strong>60%</strong>.
        </p>
      </div>

      <!-- Grille dynamique des sponsors -->
      <div v-if="loading" class="text-center py-10 text-slate-400">
        <i class="fa-solid fa-circle-notch fa-spin text-2xl text-emerald-600"></i>
      </div>

      <div v-else-if="sponsors.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-6 items-stretch">
        <div 
          v-for="s in sponsors" 
          :key="s.id" 
          class="rounded-2xl border border-white/80 bg-white/95 backdrop-blur-xs p-5 flex flex-col items-center justify-center text-center shadow-xs transition hover:shadow-md"
        >
          <div class="h-14 flex items-center justify-center mb-2">
            <img 
              v-if="s.logo_url" 
              :src="s.logo_url" 
              :alt="s.nom" 
              class="max-h-12 max-w-[120px] object-contain"
            />
            <i v-else class="fa-solid fa-handshake-simple text-2xl text-emerald-700"></i>
          </div>
          <span class="font-extrabold text-xs text-slate-900 line-clamp-1">{{ s.nom }}</span>
          <span v-if="s.description" class="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{{ s.description }}</span>
        </div>
      </div>

      <div v-else class="text-center py-8 text-slate-400 text-xs">
        Aucun partenaire enregistré pour l'instant.
      </div>

    </div>
  </section>
</template>
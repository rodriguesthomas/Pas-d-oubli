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
      
      <!-- En-tête Partenaires & Mécènes -->
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ils soutiennent l'événement
        </h3>
        <!-- <p class="text-slate-700 mt-2 text-sm sm:text-base font-medium">
          Entreprises, commerçants : associez votre image à une action positive avec une déduction d'impôt de <strong class="text-slate-900 font-bold">60%</strong>.
        </p> -->
      </div>

      <!-- État : Chargement -->
      <div v-if="loading" class="text-center py-12 text-slate-400">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-emerald-600"></i>
      </div>

      <!-- État : Grille dynamique des sponsors -->
      <div 
        v-else-if="sponsors.length > 0" 
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch"
      >
        <div 
          v-for="s in sponsors" 
          :key="s.id" 
          class="rounded-2xl border border-white/80 bg-white/90 backdrop-blur-xs p-5 flex flex-col items-center justify-center text-center shadow-xs transition hover:shadow-md hover:-translate-y-0.5 duration-200"
        >
          <div class="h-16 w-full flex items-center justify-center mb-3 p-1">
            <img 
              v-if="s.logo_url" 
              :src="s.logo_url" 
              :alt="s.nom" 
              class="max-h-14 max-w-[130px] object-contain"
              loading="lazy"
            />
            <div v-else class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <i class="fa-solid fa-handshake-simple text-xl"></i>
            </div>
          </div>
          <span class="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">
            {{ s.nom }}
          </span>
          <span v-if="s.description" class="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {{ s.description }}
          </span>
        </div>
      </div>

      <!-- État : Aucun sponsor -->
      <div v-else class="text-center py-10 bg-white/60 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs sm:text-sm">
        Aucun partenaire enregistré pour l'instant.
      </div>

      <!-- Encart Appel Bénévoles (placé avec un espacement supérieur équilibré) -->
      <div 
        id="benevoles" 
        class="mt-16 sm:mt-20 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div class="space-y-2 text-center sm:text-left">
          <h3 class="text-2xl sm:text-3xl font-black tracking-tight">
            Envie de vivre l'aventure de l'intérieur ?
          </h3>
          <p class="text-emerald-100 text-sm sm:text-base max-w-xl leading-relaxed">
            Signaleurs, ravitaillement, accueil : rejoignez notre équipe bénévole pour faire de cette première édition une réussite !
          </p>
        </div>

        <button 
          @click="openModal('benevole')" 
          type="button"
          class="flex-shrink-0 px-7 py-3.5 bg-white text-emerald-900 font-bold text-sm rounded-xl hover:bg-slate-100 transition shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
        >
          <i class="fa-solid fa-hand-holding-heart text-base"></i>
          <span>Devenir bénévole</span>
        </button>
      </div>

    </div>
  </section>
</template>
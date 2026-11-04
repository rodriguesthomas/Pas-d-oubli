<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { supabase } from '../../services/supabase';

const currentAmount = ref(0);
const goalAmount = ref(1000);
const loading = ref(true);
let subscription = null;

const percentage = computed(() => {
  if (!goalAmount.value || goalAmount.value === 0) return 0;
  const p = Math.round((currentAmount.value / goalAmount.value) * 100);
  return Math.min(Math.max(p, 0), 100);
});

const formattedCurrent = computed(() => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(currentAmount.value);
});

const formattedGoal = computed(() => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(goalAmount.value);
});

const loadFundraisingData = async () => {
  const { data, error } = await supabase
    .from('fundraising')
    .select('current_amount, goal_amount')
    .eq('id', 1)
    .single();

  if (!error && data) {
    currentAmount.value = Number(data.current_amount) || 0;
    goalAmount.value = Number(data.goal_amount) || 5000;
  }
  loading.value = false;
};

onMounted(() => {
  loadFundraisingData();

  // Écoute des mises à jour en direct depuis Supabase
  subscription = supabase
    .channel('fundraising_realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'fundraising', filter: 'id=eq.1' },
      (payload) => {
        if (payload.new) {
          currentAmount.value = Number(payload.new.current_amount) || 0;
          goalAmount.value = Number(payload.new.goal_amount) || 5000;
        }
      }
    )
    .subscribe();
});

onUnmounted(() => {
  if (subscription) supabase.removeChannel(subscription);
});
</script>

<template>
  <section id="cagnotte" class="py-16 sm:py-20 bg-transparent">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="relative bg-slate-100/70 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-emerald-500/20 overflow-hidden">
        
        <!-- Décorations lumineuses en arrière-plan -->
        
        <div class="relative z-10 text-center max-w-2xl mx-auto">

          <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-emerald-600 mt-1">
            Chaque euro compte pour France Alzheimer 37
          </h2>
          <p class="text-emerald-400 text-sm sm:text-base mt-2">
            Grâce à vos inscriptions, vos dons et l'engagement de nos mécènes, suivez l'avancée de la cagnotte reversée à l'association.
          </p>

          <!-- Montant principal -->
          <div class="mt-8 mb-6">
            <div v-if="loading" class="py-4">
              <i class="fa-solid fa-circle-notch fa-spin text-3xl text-emerald-400"></i>
            </div>
            <div v-else class="flex flex-col items-center">
              <span class="text-5xl sm:text-6xl font-black font-mono tracking-tight text-emerald-600 drop-shadow-sm">
                {{ formattedCurrent }}
              </span>
              <span class="text-xs sm:text-sm font-semibold text-emerald-400 mt-1 uppercase tracking-wider">
                sur un objectif de {{ formattedGoal }}
              </span>
            </div>
          </div>

          <!-- Jauge de progression -->
          <div class="w-full bg-black/40 rounded-full h-4 sm:h-5 p-1 border border-white/10 shadow-inner relative overflow-hidden mb-3">
            <div 
              class="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-[#34d399] rounded-full transition-all duration-700 ease-out shadow-md"
              :style="{ width: `${percentage}%` }"
            ></div>
          </div>

          <div class="flex items-center justify-between text-xs font-bold text-emerald-400 px-1 mb-8">
            <span>0 €</span>
            <span class="bg-emerald-800/80 px-2.5 py-0.5 rounded-full border border-emerald-400 font-mono text-emerald-300">
              {{ percentage }}% atteint
            </span>
            <span>{{ formattedGoal }}</span>
          </div>

          <!-- Bouton don direct -->
          <div class="flex justify-center">
            <a 
              href="#don" 
              class="inline-flex items-center gap-2 px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm rounded-xl shadow-lg transition duration-200 hover:scale-105"
            >
              <i class="fa-solid fa-heart"></i>
              Participer à la collecte
            </a>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>
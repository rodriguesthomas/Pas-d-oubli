<script setup>
import { ref } from 'vue';

const activeTab = ref('matin');
</script>

<template>
  <section id="programme" class="py-20 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-10">
        <span class="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full">
          Planning du Jour J
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Le Programme de la Journée</h2>
        <p class="text-slate-600 mt-2 text-sm sm:text-base">Une matinée d'efforts et de sourires suivie d'un après-midi d'échanges.</p>

        <!-- Sélecteur d'onglets -->
        <div class="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 mt-6">
          <button 
            @click="activeTab = 'matin'" 
            :class="activeTab === 'matin' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'" 
            class="px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2"
          >
            <i class="fa-solid fa-sun text-amber-500"></i>Matinée Sportive (8h - 12h15)
          </button>
          <button 
            @click="activeTab = 'aprem'" 
            :class="activeTab === 'aprem' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'" 
            class="px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2"
          >
            <i class="fa-solid fa-hand-holding-heart text-emerald-600"></i>Après-midi Village (12h15 - 17h)
          </button>
        </div>
      </div>

      <!-- Programme Matin -->
      <div v-show="activeTab === 'matin'" class="space-y-3.5">
        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
          <span class="font-mono font-bold text-emerald-700 w-16">08h00</span>
          <div>
            <h4 class="font-bold text-slate-900">Ouverture du site aux bénévoles</h4>
            <p class="text-xs text-slate-500">Briefing des signaleurs, poste Croix-Rouge et balisages finaux.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
          <span class="font-mono font-bold text-emerald-700 w-16">08h30</span>
          <div>
            <h4 class="font-bold text-slate-900">Accueil des participants & Retrait des dossards</h4>
            <p class="text-xs text-slate-500">Café d'accueil et inauguration de l'espace France Alzheimer 37.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex gap-4">
          <span class="font-mono font-bold text-emerald-700 w-16">09h00</span>
          <div>
            <span class="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">Départ</span>
            <h4 class="font-bold text-slate-900 mt-1">Marche Solidaire 6 km</h4>
            <p class="text-xs text-slate-600">Départ groupé pour les marcheurs, familles et poussettes dans les sentiers.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex gap-4">
          <span class="font-mono font-bold text-emerald-700 w-16">09h45</span>
          <div>
            <span class="text-[10px] uppercase font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">Départ</span>
            <h4 class="font-bold text-slate-900 mt-1">Course Nature 10 km</h4>
            <p class="text-xs text-slate-600">Épreuve reine chronométrée au cœur des coteaux et des sentiers athégiens.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex gap-4">
          <span class="font-mono font-bold text-teal-700 w-16">10h00</span>
          <div>
            <span class="text-[10px] uppercase font-bold bg-teal-600 text-white px-2 py-0.5 rounded">Départ</span>
            <h4 class="font-bold text-slate-900 mt-1">Course Populaire 6 km</h4>
            <p class="text-xs text-slate-600">L'épreuve rapide et festive ouverte aux coureurs réguliers comme débutants.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-4">
          <span class="font-mono font-bold text-amber-700 w-16">11h00</span>
          <div>
            <span class="text-[10px] uppercase font-bold bg-amber-600 text-white px-2 py-0.5 rounded">Départs Jeunesse</span>
            <h4 class="font-bold text-slate-900 mt-1">Courses 3 km & 1,5 km Enfants</h4>
            <p class="text-xs text-slate-600">Encadrement assuré par le Centre de Loisirs. Médaille souvenir à l'arrivée.</p>
          </div>
        </div>
      </div>

      <!-- Programme Après-midi -->
      <div v-show="activeTab === 'aprem'" class="space-y-3.5">
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-4">
          <span class="font-mono font-bold text-emerald-700 w-16">12h15</span>
          <div>
            <span class="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">Convivialité</span>
            <h4 class="font-bold text-slate-900 mt-1">Déjeuner Partagé, Buvette & Crêpes</h4>
            <p class="text-xs text-slate-600">Restauration sur place et stand crêpes des jeunes du Centre Aéré.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white border border-emerald-200 shadow-sm flex gap-4">
          <span class="font-mono font-bold text-emerald-700 w-16">13h45</span>
          <div>
            <span class="text-[10px] uppercase font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">Conférence</span>
            <h4 class="font-bold text-slate-900 mt-1">« Sport, Mémoire & Bien Vieillir »</h4>
            <p class="text-xs text-slate-600">Animée par France Alzheimer 37 avec échanges et questions/réponses.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
          <span class="font-mono font-bold text-emerald-700 w-16">14h30</span>
          <div>
            <h4 class="font-bold text-slate-900">Ateliers Mémoire & Jeux Géants en Bois</h4>
            <p class="text-xs text-slate-500">Activités intergénérationnelles sur l'esplanade du village.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex gap-4">
          <span class="font-mono font-bold text-emerald-200 w-16">16h15</span>
          <div>
            <h4 class="font-bold text-white">Remise du Chèque Symbolique & Clôture</h4>
            <p class="text-xs text-emerald-100">Annonce officielle des fonds récoltés pour France Alzheimer 37.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
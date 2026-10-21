<script setup>
import { useModal } from '../../composables/useModal';

const { openModal } = useModal();
</script>

<template>
  <section id="partenaires" class="py-20 bg-transparent border-t border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Encart Appel Bénévoles -->
      <div id="benevoles" class="bg-gradient-to-br from-emerald-700 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white mb-16 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span class="text-xs uppercase font-bold tracking-widest text-emerald-300">Mobilisation </span>
          <h3 class="text-2xl sm:text-3xl font-black mt-1">Envie de vivre l'aventure de l'intérieur ?</h3>
          <p class="text-emerald-100 text-sm sm:text-base mt-2 max-w-xl">
            Signaleurs, ravitaillement, accueil : rejoignez notre équipe bénévole pour faire de cette première édition une réussite !
          </p>
        </div>
        <button 
          @click="openModal('benevole')" 
          class="flex-shrink-0 px-6 py-3.5 bg-white text-emerald-800 font-bold text-sm rounded-xl hover:bg-slate-100 transition shadow"
        >
          <i class="fa-solid fa-hand-holding-heart mr-2"></i>Devenir bénévole 
        </button>
      </div>

      <!-- Partenaires & Sponsors -->
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-emerald-700 bg-white border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full">
          Soutiens & Mécénat d'Entreprise 
        </span>
        <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">Ils soutiennent l'événement </h3>
        <p class="text-slate-600 mt-2 text-sm">
          Entreprises, commerçants : associez votre image à une action positive avec une déduction d'impôt de <strong>60%</strong>. 
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
        <div class="h-28 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center hover:bg-white transition shadow-sm">
          <i class="fa-solid fa-landmark text-2xl text-slate-700 mb-1"></i>
          <span class="font-extrabold text-xs text-slate-800">Mairie d'Athée-sur-Cher </span>
          <span class="text-[10px] text-slate-400">Soutien institutionnel </span>
        </div>

        <div class="h-28 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 flex flex-col items-center justify-center text-center hover:bg-white transition shadow-sm">
          <i class="fa-solid fa-hand-holding-medical text-2xl text-emerald-600 mb-1"></i>
          <span class="font-extrabold text-xs text-emerald-950">France Alzheimer 37 </span>
          <span class="text-[10px] text-emerald-700">Partenaire bénéficiaire </span>
        </div>

        <div class="h-28 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center hover:bg-white transition shadow-sm">
          <i class="fa-solid fa-building-columns text-2xl text-emerald-800 mb-1"></i>
          <span class="font-extrabold text-xs text-slate-800">BNP Paribas </span>
          <span class="text-[10px] text-slate-400">Partenaire Bancaire </span>
        </div>

        <div class="h-28 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center hover:bg-white transition shadow-sm">
          <i class="fa-solid fa-store text-2xl text-slate-700 mb-1"></i>
          <span class="font-extrabold text-xs text-slate-800">Artisans & Commerçants </span>
          <span class="text-[10px] text-slate-400">Dotations / Ravito & Logistique</span>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-slate-950 text-white text-xs py-12 border-t border-slate-800 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <!-- Présentation -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7">
              <img src="./../../assets/logo.png">
            </div>
            <span class="text-white font-black text-base tracking-tight">PAS D'OUBLI</span>
          </div>
          <p class="text-slate-400 leading-relaxed">
            Association loi 1901 organisant des courses caritatives au profit de la lutte contre Alzheimer. 
          </p>
          <p class="text-[11px] text-slate-500 font-mono">RNA : W372021480 • Athée-sur-Cher </p>
        </div>

        <!-- Liens rapides -->
        <div>
          <h4 class="text-white font-bold uppercase tracking-wider mb-3">Navigation </h4>
          <ul class="space-y-2 text-slate-400">
            <li><a href="#cause" class="hover:text-emerald-400 transition">France Alzheimer 37 </a></li>
            <li><a href="#epreuves" class="hover:text-emerald-400 transition">Épreuves (10k, 6k, 3k, 1.5k) </a></li>
            <li><a href="#programme" class="hover:text-emerald-400 transition">Programme du 23 mai 2027 </a></li>
            <li><a href="#infos" class="hover:text-emerald-400 transition">Accès & Dossards </a></li>
          </ul>
        </div>

        <!-- Engagements -->
        <div>
          <h4 class="text-white font-bold uppercase tracking-wider mb-3">Engagements </h4>
          <ul class="space-y-2 text-slate-400">
            <li>100% des bénéfices reversés </li>
            <li>Ravitaillements éco-conçus </li>
            <li>Parcours sécurisés</li>
            <li>Eévènements intergénérationnels</li>
          </ul>
        </div>

        <!-- Contact direct -->
        <div>
          <h4 class="text-white font-bold uppercase tracking-wider mb-3">Contact </h4>
          <p class="text-slate-300 font-medium">Association PAS D'OUBLI </p>
          <p class="text-slate-400">Président : Thomas Rodrigues da Conceicao </p>
          <p class="text-slate-400">Vice-présidente : Lucie Rodrigues da Conceicao </p>
          <p class="text-slate-400 mt-1">
            <a href="mailto:rodrigues.thomas2005@gmail.com" class="text-emerald-400 hover:underline">
              association.pas.doubli@gmail.com
              rodrigues.thomas2005@gmail.com 
              
            </a>
          </p>
        </div>
      </div>

      <div class="pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <div>© 2027 Association Pas d'oubli • Tous droits réservés. </div>
        <div>Événement caritatif au profit de France Alzheimer 37. </div>
      </div>
    </div>
  </footer>
</template>
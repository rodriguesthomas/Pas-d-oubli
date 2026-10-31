<script setup>
import { useCountdown } from '../../composables/useCountdown';

const { days, hours, minutes, seconds } = useCountdown("2027-05-23T09:00:00");
</script>

<template>
  <!-- Hexagone agrandi (480px / 560px sur grand écran) et statique -->
  <div 
    class="relative w-[320px] sm:w-[420px] lg:w-[460px] aspect-[1/1.15] flex items-center justify-center select-none"
  >
    <!-- 1. Liseré externe vert menthe -->
    <div 
      class="absolute inset-0 bg-[#34d399]/40 [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]"
    ></div>

    <!-- 2. Contour vert vif intermédiaire -->
    <div 
      class="absolute inset-[8px] sm:inset-[10px] bg-[#10b981]/60 [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)]"
    ></div>

    <!-- 3. Fond sombre intérieur -->
    <div 
      class="relative w-[calc(100%-24px)] h-[calc(100%-24px)] bg-[#06422e]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)] shadow-2xl"
    >
    

      <!-- Titre & Date -->
      <h3 class="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
        <i class="fa-regular fa-clock text-emerald-400 text-xl"></i>
        Compte à rebours
      </h3>
      <p class="text-xs sm:text-sm text-emerald-200/80 mb-6 sm:mb-8">Départ le 23 mai 2027 à 09h00</p>

      <!-- Grille des 3 compteurs principaux -->
      <div class="grid grid-cols-4 gap-3 w-full max-w-[400px]">
        <div class="bg-[#042f20]/80 border border-emerald-500/20 rounded-2xl py-3 px-1 text-center shadow-inner">
          <span class="block text-3xl sm:text-3xl font-black font-mono text-emerald-300 leading-tight">
            {{ days }}
          </span>
          <span class="text-[9px] sm:text-xs uppercase font-bold text-emerald-200/60 tracking-wider">Jours</span>
        </div>

        <div class="bg-[#042f20]/80 border border-emerald-500/20 rounded-2xl py-3 px-1 text-center shadow-inner">
          <span class="block text-3xl sm:text-3xl font-black font-mono text-white leading-tight">
            {{ hours }}
          </span>
          <span class="text-[9px] sm:text-xs uppercase font-bold text-emerald-200/60 tracking-wider">Heures</span>
        </div>

        <div class="bg-[#042f20]/80 border border-emerald-500/20 rounded-xl py-3 px-1 text-center shadow-inner">
          <span class="block text-3xl sm:text-3xl font-black font-mono text-white leading-tight">
            {{ minutes }}
          </span>
          <span class="text-[9px] sm:text-xs uppercase font-bold text-emerald-200/60 tracking-wider">Min</span>
        </div>

        <div class="bg-[#042f20]/80 border border-emerald-500/20 rounded-xl py-3 px-1 text-center shadow-inner">
          <span class="block text-3xl sm:text-3xl font-black font-mono text-white leading-tight">
            {{ seconds }}
          </span>
          <span class="text-[9px] sm:text-xs uppercase font-bold text-emerald-200/60 tracking-wider">Sec</span>
        </div>
      </div>

      
    </div>
  </div>
</template>
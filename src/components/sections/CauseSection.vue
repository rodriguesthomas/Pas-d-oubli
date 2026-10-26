<script setup>
import logoUrl from '../../assets/logo.png';
import logoFAUrl from '../../assets/logoFA';

const pillars = [
  {
    icon: 'fa-solid fa-house-chimney-medical',
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Accueil de jour',
    desc: 'Offrir des lieux d\'accueil adaptés permettant aux personnes fragilisées de conserver une vie sociale et d\'échanger en toute bienveillance.'
  },
  {
    icon: 'fa-solid fa-hands-holding-child',
    color: 'bg-teal-100 text-teal-700',
    title: 'Soutenir & former les aidants',
    desc: 'Donner du répit aux proches, conjoints et enfants avec des groupes de parole animés par des psychologues formés en Touraine.'
  },
  {
    icon: 'fa-solid fa-microscope',
    color: 'bg-blue-100 text-blue-700',
    title: 'Recherche Médicale',
    desc: 'Accompagner les programmes scientifiques nationaux visant à mieux comprendre, diagnostiquer plus tôt et traiter la maladie neuro-évolutive.'
  },
  {
    icon: 'fa-solid fa-heart-pulse',
    color: 'bg-amber-100 text-amber-700',
    title: 'Faire vivre l\'association France Alzheimer 37',
    desc: 'Permettre à l\'association France Alzheimer 37 de subvenir à ses besoins pour pouvoir aider les malades et aidants'
  }
];
</script>

<template>
  <section id="cause" class="py-20 bg-transparent">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-emerald-700 bg-white border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full">
          Notre Mission de Cœur 
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Pourquoi courons-nous pour France Alzheimer 37 ? </h2>
        <p class="text-slate-600 mt-2 text-sm sm:text-base">
          L’intégralité des bénéfices générés par nos actions sera reversée à France Alzheimer 37 afin de contribuer à ses missions. 
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <!-- Carte Partenariat -->
        <div class="md:col-span-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-3xl p-8 border border-emerald-100 flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center p-2">
                <img :src="logoUrl" alt="Logo Pas d'oubli" class="w-full h-full object-contain" />
              </div>
              <span class="text-2xl font-black text-slate-400">+ </span>
              <div class="px-3 py-2 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">
                  <img :src="logoFAUrl" alt= "logo-france-alzheimer"/>
                </div>
              </div>
            </div>

            <h3 class="text-xl font-bold text-slate-900 mb-3">Un partenariat transparent & engagé </h3>
            <p class="text-slate-600 text-sm leading-relaxed mb-4">
              France Alzheimer 37 est la seule association départementale reconnue d'utilité publique dédiée aux personnes malades et à leurs familles. 
            </p>
            <p class="text-slate-600 text-sm leading-relaxed">
              Le dimanche 23 mai 2027, les représentants de l'association seront présents sur le village pour informer, échanger et animer des ateliers interactifs. 
            </p>
          </div>

          
        </div>

        <!-- Piliers d'actions -->
        <div class="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            v-for="(pillar, idx) in pillars" 
            :key="idx" 
            class="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 transition shadow-sm hover:shadow"
          >
            <div :class="`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${pillar.color}`">
              <i :class="pillar.icon"></i>
            </div>
            <h4 class="font-bold text-slate-900 mb-1.5 text-base">{{ pillar.title }} </h4>
            <p class="text-slate-600 text-xs leading-relaxed">{{ pillar.desc }} </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
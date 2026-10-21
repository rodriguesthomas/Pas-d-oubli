<script setup>
import logoUrl from '../../assets/logo.png';
</script>

<template>
  <section id="association" class="py-20 bg-transparent">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span
          class="text-emerald-700 bg-white border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full"
        >
          À propos de nous 
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
          L'association Pas d'oubli 
        </h2>
        <p class="text-slate-600 mt-2 text-sm sm:text-base">
          Une aventure humaine, solidaire et porteuse d’espoir. 
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div
          class="lg:col-span-7 space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base"
        >
          <p>
            Née de la volonté de se mobiliser face à la maladie d’Alzheimer,
            notre association a pour objectif de sensibiliser le public, de
            soutenir la recherche et de contribuer à la lutte contre cette
            maladie qui touche tant de personnes et de familles. 
          </p>
          <p>
            Notre nom porte un double sens.  Pas d’Oubli, c’est ne pas
            oublier les personnes atteintes de la maladie d’Alzheimer, leurs
            histoires, leurs souvenirs et tout ce qui fait leur identité.[cite:
            1] Mais c’est aussi le « pas » que chacun peut faire pour agir,
            avancer et participer à une cause qui nous concerne tous. 
            Chaque geste compte, chaque mobilisation a du sens et chaque pas
            nous rapproche d’un avenir où la maladie sera mieux comprise et
            mieux combattue. 
          </p>
          <p>
            C’est dans cet esprit que nous organiserons des actions et des
            événements solidaires, notamment une course ouverte à
            <strong>tous</strong>, mêlant sport, partage et engagement. 
            À travers ces initiatives, nous souhaitons rassembler les
            générations, sensibiliser le plus grand nombre et transformer notre
            mobilisation en un soutien concret. 
          </p>
          <p>
            Derrière chaque personne touchée par Alzheimer, il y a une vie, des
            souvenirs, des proches et souvent un aidant qui avance dans
            l’ombre.  Il y a des familles qui cherchent des réponses,
            des personnes qui ont besoin d’être accompagnées et une recherche
            qu’il est essentiel de continuer à soutenir.  Nous ne
            pouvons pas effacer la maladie, mais nous pouvons choisir d’agir
            face à elle. 
          </p>
        </div>

        <div
          class="lg:col-span-5 bg-slate-50 rounded-3xl p-8 border border-slate-200 flex items-center justify-center"
        >
          <img
            :src="logoUrl"
            alt="Logo de l'association Pas d'oubli"
            class="max-h-80 w-auto object-contain drop-shadow"
          />
        </div>
      </div>
    </div>
  </section>
</template>

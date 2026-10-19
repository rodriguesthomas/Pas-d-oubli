<script setup>
const features = [
  {
    icon: 'fa-solid fa-mug-hot text-emerald-400',
    title: 'Buvette & Restauration',
    desc: "Café d'accueil, sandwichs frais locaux, jus de fruits artisanaux et fouées locaux.",
  },
  {
    icon: 'fa-solid fa-dice text-amber-400',
    title: 'Animation sur la maladie',
    desc: 'Stands organisés pour sensibiliser et informer sur la maladie, animés par les bénévoles de France Alzheimer 37.',
  },
  {
    icon: 'fa-solid fa-camera text-teal-400',
    title: 'Photocall Souvenir',
    desc: 'Repartez avec votre cliché de la journée avec votre dossard ou votre médaille.',
  },
  {
    icon: 'fa-solid fa-shield-halved text-rose-400',
    title: 'Poste de Secours',
    desc: 'Dispositif Prévisionnel de Secours assuré par la Croix-Rouge française.',
  },
];
</script>

<template>
  <section
    id="village"
    class="py-20 bg-emerald-950 text-white relative overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Colonne gauche -->
        <div class="lg:col-span-6 space-y-6">
          <span
            class="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold"
          >
            Projet Intergénérationnel[cite: 1]
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Un village festif[cite: 1]
          </h2>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            Parce que la solidarité unit toutes les générations.[cite: 1]
          </p>

          <div class="space-y-4 pt-2">
            <div
              class="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div
                class="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-lg flex-shrink-0"
              >
                🥞[cite: 1]
              </div>
              <div>
                <h4 class="font-bold text-white text-base">
                  Stand Gourmand & Crêpes pour leur camp d'été[cite: 1]
                </h4>
                <p class="text-slate-300 text-xs mt-1">
                  100% des recettes financent le séjour d'été des jeunes du
                  centre.[cite: 1]
                </p>
              </div>
            </div>

            <div
              class="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div
                class="w-10 h-10 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-lg flex-shrink-0"
              >
                🎯[cite: 1]
              </div>
              <div>
                <h4 class="font-bold text-white text-base">
                  Encadrement des Courses Enfants & Jeux[cite: 1]
                </h4>
                <p class="text-slate-300 text-xs mt-1">
                  Échauffement ludique, maquillage, jeux géants et remise des
                  médailles.[cite: 1]
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Grille droite -->
        <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="(feat, index) in features"
            :key="index"
            class="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center"
          >
            <i :class="`${feat.icon} text-3xl mb-3`"></i>
            <h4 class="font-bold text-lg text-white">
              {{ feat.title }}[cite: 1]
            </h4>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              {{ feat.desc }}[cite: 1]
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

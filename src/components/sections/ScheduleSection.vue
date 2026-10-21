<script setup>
import { ref } from 'vue';
import { useModal } from '../../composables/useModal';

const activeTab = ref('matin');
const { openModal } = useModal();

const morningSchedule = [
  {
    time: '08h00',
    title: 'Ouverture du site aux bénévoles',
    desc: 'Briefing des signaleurs, poste Croix-Rouge et balisages finaux.',
    details: 'Accueil des bénévoles avec collation, répartition des postes stratégiques sur les parcours et vérification des dispositifs de sécurité.'
  },
  {
    time: '08h30',
    title: 'Accueil des participants & Retrait des dossards',
    desc: "Café d'accueil et inauguration de l'espace France Alzheimer 37.",
    details: "Retrait des dossards sur présentation d'une pièce d'identité et de l'attestation PPS. Café et viennoiseries offerts."
  },
  {
    time: '09h00',
    tag: 'Départ',
    title: 'Marche Solidaire 6 km',
    desc: 'Départ groupé pour les marcheurs, familles et poussettes dans les sentiers.',
    details: 'Circuit nature accessible à tous les rythmes sans certificat médical. 1 ravitaillement prévu sur le tracé.'
  },
  {
    time: '09h45',
    tag: 'Départ',
    title: 'Course Nature 10 km',
    desc: 'Épreuve reine chronométrée au cœur des coteaux et des sentiers athégiens.',
    details: 'Tracé vallonné alternant routes communales et chemins de terre. Parcours chronométré avec puce électronique.'
  },
  {
    time: '10h00',
    tag: 'Départ',
    title: 'Course Populaire 6 km',
    desc: "L'épreuve rapide et festive ouverte aux coureurs réguliers comme débutants.",
    details: 'Boucle accessible dès 14 ans. Ambiance festive et ravitaillement gourmand à l’arrivée.'
  },
  {
    time: '11h00',
    tag: 'Départs Jeunesse',
    title: 'Courses 3 km & 1,5 km Enfants',
    desc: 'Encadrement assuré par le Centre de Loisirs. Médaille souvenir à l\'arrivée.',
    details: 'Épreuves entièrement sécurisées dans le centre-bourg avec remise de médailles pour chaque jeune arrivant.'
  }
];

const afternoonSchedule = [
  {
    time: '12h15',
    tag: 'Convivialité',
    title: 'Déjeuner Partagé, Buvette & Crêpes',
    desc: 'Restauration sur place et stand crêpes des jeunes du Centre Aéré.',
    details: 'Restauration locale, tables de pique-nique et vente de crêpes au profit du séjour d’été des enfants.'
  },
  {
    time: '13h45',
    tag: 'Conférence',
    title: '« Sport, Mémoire & Bien Vieillir »',
    desc: 'Animée par France Alzheimer 37 avec échanges et questions/réponses.',
    details: 'Intervention d’experts et de bénévoles sur l’impact de l’activité physique pour préserver ses fonctions cognitives.'
  },
  {
    time: '14h30',
    title: 'Ateliers Mémoire & Jeux Géants en Bois',
    desc: 'Activités intergénérationnelles sur l\'esplanade du village.',
    details: 'Jeux d’adresse et de logique en accès libre pour les enfants, les aînés et leurs accompagnants.'
  },
  {
    time: '16h15',
    title: 'Remise du Chèque Symbolique & Clôture',
    desc: 'Annonce officielle des fonds récoltés pour France Alzheimer 37.',
    details: 'Discours des organisateurs, annonce du montant total reversé à l’association et verre de l’amitié.'
  }
];

const handleItemClick = (item) => {
  openModal('details', {
    name: `${item.time} — ${item.title}`,
    detailsText: item.details
  });
};
</script>

<template>
  <section id="programme" class="py-20 bg-transparent">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="text-center mb-10">
        <span class="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full">
          Planning du Jour J
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Le Programme de la Journée</h2>
        <p class="text-slate-600 mt-2 text-sm">Cliquez sur un horaire pour afficher tous les détails.</p>

        <!-- Sélecteur d'onglets -->
        <div class="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 mt-6">
          <button 
            @click="activeTab = 'matin'" 
            :class="activeTab === 'matin' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'" 
            class="px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-sun text-amber-500"></i>Matinée Sportive (8h - 12h15)
          </button>
          <button 
            @click="activeTab = 'aprem'" 
            :class="activeTab === 'aprem' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'" 
            class="px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-hand-holding-heart text-emerald-600"></i>Après-midi Village (12h15 - 17h)
          </button>
        </div>
      </div>

      <!-- Programme Matin -->
      <div v-show="activeTab === 'matin'" class="space-y-3.5">
        <div 
          v-for="(item, idx) in morningSchedule" 
          :key="idx"
          @click="handleItemClick(item)"
          class="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 hover:bg-emerald-50 hover:border-emerald-700 flex items-start justify-between gap-4 cursor-pointer transition-all duration-200 group shadow-xs hover:shadow-md"
        >
          <div class="flex gap-4 items-start">
            <span class="font-mono font-extrabold text-slate-600 group-hover:text-emerald-800 w-16 pt-0.5 transition-colors">
              {{ item.time }}
            </span>
            <div>
              <span 
                v-if="item.tag" 
                class="text-[10px] uppercase font-bold bg-slate-600 text-white group-hover:bg-emerald-700 px-2 py-0.5 rounded transition-colors"
              >
                {{ item.tag }}
              </span>
              <h4 class="font-bold text-slate-600 group-hover:text-emerald-950 mt-1 transition-colors">
                {{ item.title }}
              </h4>
              <p class="text-xs text-slate-500 group-hover:text-slate-700 mt-0.5 transition-colors">
                {{ item.desc }}
              </p>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all text-sm mt-1"></i>
        </div>
      </div>

      <!-- Programme Après-midi -->
      <div v-show="activeTab === 'aprem'" class="space-y-3.5">
        <div 
          v-for="(item, idx) in afternoonSchedule" 
          :key="idx"
          @click="handleItemClick(item)"
          class="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 hover:bg-emerald-50 hover:border-emerald-700 flex items-start justify-between gap-4 cursor-pointer transition-all duration-200 group shadow-xs hover:shadow-md"
        >
          <div class="flex gap-4 items-start">
            <span class="font-mono font-extrabold text-slate-600 group-hover:text-emerald-800 w-16 pt-0.5 transition-colors">
              {{ item.time }}
            </span>
            <div>
              <span 
                v-if="item.tag" 
                class="text-[10px] uppercase font-bold bg-slate-600 text-white group-hover:bg-emerald-700 px-2 py-0.5 rounded transition-colors"
              >
                {{ item.tag }}
              </span>
              <h4 class="font-bold text-slate-600 group-hover:text-emerald-950 mt-1 transition-colors">
                {{ item.title }}
              </h4>
              <p class="text-xs text-slate-500 group-hover:text-slate-700 mt-0.5 transition-colors">
                {{ item.desc }}
              </p>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all text-sm mt-1"></i>
        </div>
      </div>
    </div>
  </section>
</template>
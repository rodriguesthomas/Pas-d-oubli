<script setup>
// Infos pratiques, parkings et retraits
</script>

<template>
  <section id="infos" class="py-20 bg-slate-50 bg-transparent" >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-emerald-700 bg-white border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full">
          Venir à Athée-sur-Cher 
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Infos Pratiques & Logistique </h2>
        <p class="text-slate-600 mt-2 text-sm sm:text-base">
          Tout est mis en œuvre pour faciliter votre accueil dès votre arrivée sur la commune. 
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Carte 1 -->
        <div class="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-map-location-dot"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Lieu du Rendez-vous </h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            <strong>Salle des fêtes communale</strong><br>
            Rue des Écoles / Complexe sportif<br>
            37270 Athée-sur-Cher 
          </p>
          <div class="pt-2 text-xs text-slate-500 space-y-1">
            <p><i class="fa-solid fa-car mr-2 text-emerald-600"></i>À 20 min de Tours et 15 min d'Amboise </p>
            <p><i class="fa-solid fa-square-parking mr-2 text-emerald-600"></i>Parkings gratuits fléchés à l'entrée </p>
          </div>
        </div>

        <!-- Carte 2 -->
        <div class="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-id-card"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Retrait des Dossards </h3>
          <div class="text-slate-600 text-sm space-y-2">
            <div><strong class="text-slate-800">Samedi 22 mai :</strong> 15h00 à 18h30 </div>
            <div><strong class="text-slate-800">Dimanche 23 mai :</strong> Dès 08h00 (jusqu'à 30 min avant le départ) </div>
          </div>
          <p class="text-xs text-slate-400">Pensez à votre pièce d'identité et attestation PPS. </p>
        </div>

        <!-- Carte 3 -->
        <div class="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-bath"></i>
          </div>
          <h3 class="text-xl font-bold text-slate-900">Services aux Coureurs </h3>
          <ul class="text-slate-600 text-sm space-y-2">
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i>Consigne sécurisée gratuite </li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i>Sanitaires et vestiaires </li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i>Paiement CB & espèces </li>
            <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i>Zéro plastique à usage unique </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
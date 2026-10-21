<script setup>
import { ref, onMounted } from 'vue';

// Import de l'image de fond depuis src/assets/
import fondUrl from './assets/fond.png';

// Composants de mise en page
import TopBanner from './components/layout/TopBanner.vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

// Sections du site
import HeroSection from './components/sections/HeroSection.vue';
import AboutSection from './components/sections/AboutSection.vue';
import CauseSection from './components/sections/CauseSection.vue';
import RacesSection from './components/sections/RacesSection.vue';
import ScheduleSection from './components/sections/ScheduleSection.vue';
import VillageSection from './components/sections/VillageSection.vue';
import PracticalSection from './components/sections/PracticalSection.vue';
import PartnersSection from './components/sections/PartnersSection.vue';
import ContactSection from './components/sections/ContactSection.vue';

// Espace d'administration
import AdminDashboard from './components/admin/AdminDashboard.vue';
import FaqSection from './components/sections/FaqSection.vue';

// Modales & Notifications
import RegistrationModal from './components/modals/RegistrationModal.vue';
import DonationModal from './components/modals/DonationModal.vue';
import VolunteerModal from './components/modals/VolunteerModal.vue';
import DetailsModal from './components/modals/DetailsModal.vue';
import ToastNotification from './components/ui/ToastNotification.vue';

const isAdmin = ref(window.location.hash === '#admin');

onMounted(() => {
  window.addEventListener('hashchange', () => {
    isAdmin.value = window.location.hash === '#admin';
  });
});
</script>

<template>
  <div v-if="isAdmin">
    <AdminDashboard />
  </div>

  <div v-else class="min-h-screen w-full flex flex-col font-sans text-slate-800 bg-white">
    <TopBanner />
    <AppHeader />

    <main class="w-full flex-1">
      <!-- 1. Le Hero conserve son propre fond sombre -->
      <HeroSection />

      <!-- 2. Zone avec l'image fond.png fixe et répétition désactivée -->
      <div 
        class="relative w-full bg-fixed bg-center bg-no-repeat bg-cover"
        :style="{ backgroundImage: `url(${fondUrl})` }"
      >
        <!-- Voile léger pour maintenir le contraste et la lisibilité du texte -->
        <div class="absolute inset-0 bg-white/40 pointer-events-none"></div>

        <!-- Sections superposées à l'image -->
        <div class="relative z-10">
          <AboutSection />
          <CauseSection />
          <RacesSection />
          <ScheduleSection />
          <VillageSection />
          <PracticalSection />
          <PartnersSection />
          <ContactSection />
          <FaqSection />
        </div>
      </div>
    </main>

    <AppFooter />

    <!-- Modales & Notifications globales -->
    <RegistrationModal />
    <DonationModal />
    <VolunteerModal />
    <DetailsModal />
    <ToastNotification />
  </div>
</template>
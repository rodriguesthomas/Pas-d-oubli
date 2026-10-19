<script setup>
import TopBanner from './components/layout/TopBanner.vue';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';

import HeroSection from './components/sections/HeroSection.vue';
import AboutSection from './components/sections/AboutSection.vue';
import CauseSection from './components/sections/CauseSection.vue';
import RacesSection from './components/sections/RacesSection.vue';
import ScheduleSection from './components/sections/ScheduleSection.vue';
import VillageSection from './components/sections/VillageSection.vue';
import PracticalSection from './components/sections/PracticalSection.vue';
import PartnersSection from './components/sections/PartnersSection.vue';
import ContactSection from './components/sections/ContactSection.vue';

import RegistrationModal from './components/modals/RegistrationModal.vue';
import DonationModal from './components/modals/DonationModal.vue';
import VolunteerModal from './components/modals/VolunteerModal.vue';
import DetailsModal from './components/modals/DetailsModal.vue';
import ToastNotification from './components/ui/ToastNotification.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-800 bg-white">
    <TopBanner />
    <AppHeader />

    <main class="flex-1">
      <HeroSection />
      <AboutSection />
      <CauseSection />
      <RacesSection />
      <ScheduleSection />
      <VillageSection />
      <PracticalSection />
      <PartnersSection />
      <ContactSection />
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

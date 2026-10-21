<script setup>
import { ref } from 'vue';
import logoUrl from '../../assets/logo.png';

const isMobileMenuOpen = ref(false);
const toggleMenu = () => (isMobileMenuOpen.value = !isMobileMenuOpen.value);
const closeMenu = () => (isMobileMenuOpen.value = false);
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
    >
      <a href="#hero" class="flex items-center gap-3">
        <div class="w-12 h-12 flex-shrink-0">
          <img
            :src="logoUrl"
            alt="Logo officiel Pas d'oubli"
            class="w-full h-full object-contain"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-xl font-black tracking-tight text-slate-900"
            >PAS D'OUBLI</span
          >
          <span
            class="text-[11px] font-semibold text-emerald-600 tracking-wider uppercase"
            >Athée-sur-Cher • 37</span
          >
        </div>
      </a>

      <!-- Desktop Nav -->
      <nav
        class="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700"
      >
        <a href="#association" class="hover:text-emerald-700 transition"
          >L'association</a
        >
        <a href="#epreuves" class="hover:text-emerald-700 transition"
          >Les Épreuves</a
        >
        <a href="#programme" class="hover:text-emerald-700 transition"
          >Programme</a
        >
        <a href="#village" class="hover:text-emerald-700 transition"
          >Village & Animations</a
        >
        <a href="#infos" class="hover:text-emerald-700 transition"
          >Infos Pratiques</a
        >
        <a href="#partenaires" class="hover:text-emerald-700 transition"
          >Partenaires</a
        >
        <a href="#contact" class="hover:text-emerald-700 transition">Contact</a>
      </nav>

      <div class="hidden lg:flex items-center">
        <a
          href="#epreuves"
          class="bg-emerald-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm"
        >
          <i class="fa-solid fa-person-running"></i>
          <span>Je m'inscris</span>
        </a>
      </div>

      <!-- Hamburger mobile -->
      <button
        @click="toggleMenu"
        class="lg:hidden p-2 text-slate-700"
        aria-label="Menu"
      >
        <i class="fa-solid fa-bars text-2xl"></i>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-show="isMobileMenuOpen"
      class="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3"
    >
      <a
        @click="closeMenu"
        href="#association"
        class="block text-slate-700 font-medium py-1"
        >L'association</a
      >
      <a
        @click="closeMenu"
        href="#epreuves"
        class="block text-slate-700 font-medium py-1"
        >Les Épreuves</a
      >
      <a
        @click="closeMenu"
        href="#programme"
        class="block text-slate-700 font-medium py-1"
        >Programme</a
      >
      <a
        @click="closeMenu"
        href="#village"
        class="block text-slate-700 font-medium py-1"
        >Village & Animations</a
      >
      <a
        @click="closeMenu"
        href="#infos"
        class="block text-slate-700 font-medium py-1"
        >Infos Pratiques</a
      >
      <a
        @click="closeMenu"
        href="#partenaires"
        class="block text-slate-700 font-medium py-1"
        >Partenaires</a
      >
      <a
        @click="closeMenu"
        href="#contact"
        class="block text-slate-700 font-medium py-1"
        >Contact</a
      >
      <a
        @click="closeMenu"
        href="#epreuves"
        class="block w-full text-center bg-emerald-600 text-white font-semibold py-2.5 rounded-xl"
      >
        Je m'inscris aux courses
      </a>
    </div>
  </header>
</template>

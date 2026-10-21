<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../../services/supabase';

const faqs = ref([]);
const openIndex = ref(null);

const toggleAccordion = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const fetchFaqs = async () => {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('id', { ascending: false }); //

  if (!error && data) {
    faqs.value = data;
  }
};

onMounted(fetchFaqs);
</script>

<template>
  <section id="faq" class="py-20 bg-transparent">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-emerald-700 bg-white border border-emerald-200 text-xs uppercase font-bold tracking-wider px-3.5 py-1 rounded-full shadow-xs">
          Foire Aux Questions
        </span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">Questions Fréquentes</h2>
        <p class="text-slate-600 mt-2 text-sm sm:text-base">
          Toutes les réponses pour préparer votre venue à l'événement.
        </p>
      </div>

      <div v-if="faqs.length > 0" class="space-y-3.5">
        <div 
          v-for="(item, idx) in faqs" 
          :key="item.id"
          class="bg-white/95 rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
        >
          <button 
            @click="toggleAccordion(idx)"
            class="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center gap-4 hover:text-emerald-700 transition cursor-pointer"
          >
            <span class="text-base">{{ item.question }}</span>
            <i 
              :class="openIndex === idx ? 'rotate-180 text-emerald-600' : 'text-slate-400'"
              class="fa-solid fa-chevron-down transition-transform duration-200"
            ></i>
          </button>
          
          <div 
            v-show="openIndex === idx" 
            class="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100"
          >
            {{ item.reponse }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-6 text-slate-400 text-sm">
        Aucune question répertoriée pour l'instant.
      </div>
    </div>
  </section>
</template>
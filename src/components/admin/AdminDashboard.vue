<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../../services/supabase';
import { useToast } from '../../composables/useToast';

const { triggerToast } = useToast();

// ================= AUTHENTIFICATION & RÔLES ================= //
const user = ref(null);
const userProfile = ref(null);
const authLoading = ref(true);
const loginEmail = ref('');
const loginPassword = ref('');
const loginError = ref('');

const directionEmails = [
  'rodrigues.thomas2005@gmail.com',
  'lucierdg@outlook.com'
];

const currentRole = computed(() => {
  if (!user.value) return null;
  const email = user.value.email?.toLowerCase();
  if (directionEmails.includes(email)) return 'direction';
  return userProfile.value?.role || 'visiteur';
});

const isDirection = computed(() => currentRole.value === 'direction');

const userRoleTitle = computed(() => {
  const email = user.value?.email?.toLowerCase();
  if (email === 'rodrigues.thomas2005@gmail.com') return 'Président';
  if (email === 'lucierdg@outlook.com') return 'Vice-Présidente';
  const roleMap = {
    communication: 'Pôle Communication',
    sponsor: 'Pôle Sponsors',
    tresorerie: 'Trésorerie',
    animation: 'Pôle Animation',
    logistique: 'Pôle Logistique',
    parcours: 'Pôle Parcours'
  };
  return roleMap[currentRole.value] || 'Membre Association';
});

// ================= GESTION DU KANBAN ET DES PÔLES ================= //
const allPoles = [
  { id: 'animation', label: 'Animation', icon: 'fa-bullhorn' },
  { id: 'sponsor', label: 'Sponsors', icon: 'fa-handshake' },
  { id: 'logistique', label: 'Logistique', icon: 'fa-boxes-packing' },
  { id: 'tresorerie', label: 'Trésorerie', icon: 'fa-vault' },
  { id: 'communication', label: 'Communication', icon: 'fa-hashtag' },
  { id: 'parcours', label: 'Parcours', icon: 'fa-route' }
];

// Filtre des pôles selon le rôle
const accessiblePoles = computed(() => {
  if (isDirection.value) return allPoles;
  return allPoles.filter(p => p.id === currentRole.value);
});

const selectedPole = ref('communication');

// Vérification de permission pour chaque onglet
const canAccessTab = (tab) => {
  if (isDirection.value) return true;
  const r = currentRole.value;
  if (tab === 'poles') return accessiblePoles.value.length > 0;
  if (tab === 'messages') return r === 'communication';
  if (tab === 'benevoles') return r === 'communication';
  if (tab === 'faq') return r === 'communication';
  if (tab === 'sponsors') return r === 'sponsor';
  if (tab === 'cagnotte') return r === 'tresorerie';
  return false;
};

const currentTab = ref('poles');

// ================= DONNÉES DU DASHBOARD ================= //
const messages = ref([]);
const selectedMessage = ref(null);
const volunteers = ref([]);
const faqs = ref([]);
const sponsors = ref([]);
const fundraisingCurrent = ref(0);
const fundraisingGoal = ref(5000);
const updatingFundraising = ref(false);

// Données Kanban
const tasks = ref([]);
const steps = ref([]);
const comments = ref([]);

const columns = [
  { id: 'sujet', label: 'Sujet / Idée', bgHeader: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'a_faire', label: 'À faire', bgHeader: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'en_cours', label: 'En cours', bgHeader: 'bg-purple-100 text-purple-900 border-purple-300' },
  { id: 'fait', label: 'Fait', bgHeader: 'bg-emerald-100 text-emerald-900 border-emerald-300' }
];

// Modales Post-its
const showTaskModal = ref(false);
const editingTask = ref(null);
const taskForm = ref({ titre: '', description: '', assigne_a: '', status: 'sujet' });

// Modale de détail (Étapes évolutives + Commentaires)
const showDetailModal = ref(false);
const currentTaskDetail = ref(null);
const newStepTitle = ref('');
const newComment = ref('');

// Modales FAQ & Sponsors
const showFaqModal = ref(false);
const faqForm = ref({ question: '', reponse: '' });

const showSponsorModal = ref(false);
const editingSponsor = ref(null);
const sponsorForm = ref({ nom: '', description: '', logo_url: '' });

// Libellés bénévoles
const availabilityLabels = {
  jour_j: 'Le jour J (dimanche)',
  veille: 'La veille (samedi)',
  les_deux: 'Tout le week-end',
  avant: 'En amont / Préparation'
};

const poleLabels = {
  communication: 'Communication',
  animation: 'Animation',
  parcours: 'Parcours',
  infrastructures: 'Infrastructures',
  dossards: 'Retrait dossards',
  sponsor: 'Sponsors',
  logistique: 'Logistique'
};

// ================= AUTHENTIFICATION & CHARGEMENT ================= //
const handleLogin = async () => {
  loginError.value = '';
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value.trim(),
    password: loginPassword.value
  });

  if (error) {
    loginError.value = 'Identifiants incorrects ou compte inexistant.';
  } else {
    user.value = data.user;
    await fetchProfileAndData();
  }
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  user.value = null;
  userProfile.value = null;
  window.location.hash = '';
};

const fetchProfileAndData = async () => {
  if (!user.value) return;

  // Récupération du profil en base si ce n'est pas un email de direction en dur
  if (!directionEmails.includes(user.value.email?.toLowerCase())) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .maybeSingle();

    if (prof) {
      userProfile.value = prof;
    } else {
      // Déduction de secours selon le préfixe de l'email
      const em = user.value.email.toLowerCase();
      if (em.includes('com')) userProfile.value = { role: 'communication' };
      else if (em.includes('sponsor')) userProfile.value = { role: 'sponsor' };
      else if (em.includes('tresor')) userProfile.value = { role: 'tresorerie' };
    }
  }

  // Verrouiller la sélection sur le pôle de l'utilisateur
  if (accessiblePoles.value.length > 0) {
    selectedPole.value = accessiblePoles.value[0].id;
  }

  currentTab.value = 'poles';
  loadPermittedData();
};

const loadPermittedData = async () => {
  loadPoleData();

  if (canAccessTab('messages')) {
    const { data } = await supabase.from('messages').select('*').order('id', { ascending: false });
    if (data) messages.value = data;
  }

  if (canAccessTab('benevoles')) {
    const { data } = await supabase.from('volunteers').select('*').order('id', { ascending: false });
    if (data) volunteers.value = data;
  }

  if (canAccessTab('faq')) {
    const { data } = await supabase.from('faqs').select('*').order('id', { ascending: false });
    if (data) faqs.value = data;
  }

  if (canAccessTab('sponsors')) {
    const { data } = await supabase.from('sponsors').select('*').order('id', { ascending: true });
    if (data) sponsors.value = data;
  }

  if (canAccessTab('cagnotte')) {
    const { data } = await supabase.from('fundraising').select('*').eq('id', 1).maybeSingle();
    if (data) {
      fundraisingCurrent.value = data.current_amount;
      fundraisingGoal.value = data.goal_amount;
    }
  }
};

const loadPoleData = async () => {
  const { data: tasksData } = await supabase.from('pole_tasks').select('*').order('id', { ascending: true });
  if (tasksData) tasks.value = tasksData;

  const { data: stepsData } = await supabase.from('pole_task_steps').select('*').order('id', { ascending: true });
  if (stepsData) steps.value = stepsData;

  const { data: commentsData } = await supabase.from('pole_task_comments').select('*').order('created_at', { ascending: true });
  if (commentsData) comments.value = commentsData;
};

// ================= GESTION DU KANBAN ================= //
const tasksByStatus = (status) => {
  return tasks.value.filter(t => t.pole === selectedPole.value && t.status === status);
};

const getTaskProgress = (taskId) => {
  const taskSteps = steps.value.filter(s => s.task_id === taskId);
  if (taskSteps.length === 0) return null;
  const done = taskSteps.filter(s => s.completed).length;
  return {
    done,
    total: taskSteps.length,
    percent: Math.round((done / taskSteps.length) * 100)
  };
};

const openCreateTask = (status = 'sujet') => {
  editingTask.value = null;
  taskForm.value = { titre: '', description: '', assigne_a: '', status };
  showTaskModal.value = true;
};

const openEditTask = (task) => {
  editingTask.value = task;
  taskForm.value = {
    titre: task.titre,
    description: task.description || '',
    assigne_a: task.assigne_a || '',
    status: task.status
  };
  showTaskModal.value = true;
};

const saveTask = async () => {
  if (!taskForm.value.titre) return;

  if (editingTask.value) {
    const { error } = await supabase.from('pole_tasks').update(taskForm.value).eq('id', editingTask.value.id);
    if (!error) {
      const idx = tasks.value.findIndex(t => t.id === editingTask.value.id);
      if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], ...taskForm.value };
      if (currentTaskDetail.value?.id === editingTask.value.id) {
        currentTaskDetail.value = { ...currentTaskDetail.value, ...taskForm.value };
      }
      showTaskModal.value = false;
      triggerToast('Post-it mis à jour.');
    }
  } else {
    const { data, error } = await supabase
      .from('pole_tasks')
      .insert([{ ...taskForm.value, pole: selectedPole.value }])
      .select();

    if (!error && data) {
      tasks.value.push(data[0]);
      showTaskModal.value = false;
      triggerToast('Post-it créé.');
    }
  }
};

const deleteTask = async (taskId) => {
  const { error } = await supabase.from('pole_tasks').delete().eq('id', taskId);
  if (!error) {
    tasks.value = tasks.value.filter(t => t.id !== taskId);
    steps.value = steps.value.filter(s => s.task_id !== taskId);
    comments.value = comments.value.filter(c => c.task_id !== taskId);
    if (currentTaskDetail.value?.id === taskId) showDetailModal.value = false;
    triggerToast('Post-it supprimé.');
  }
};

// Drag & Drop
const onDragStart = (event, task) => {
  event.dataTransfer.setData('taskId', task.id.toString());
};

const onDrop = async (event, newStatus) => {
  const taskId = event.dataTransfer.getData('taskId');
  if (!taskId) return;

  const task = tasks.value.find(t => t.id == taskId);
  if (task && task.status !== newStatus) {
    task.status = newStatus;
    await supabase.from('pole_tasks').update({ status: newStatus }).eq('id', taskId);
    triggerToast(`Post-it déplacé vers "${columns.find(c => c.id === newStatus).label}"`);
  }
};

// ================= GESTION DES ÉTAPES & COMMENTAIRES DU POST-IT ================= //
const openDetail = (task) => {
  currentTaskDetail.value = task;
  newStepTitle.value = '';
  newComment.value = '';
  showDetailModal.value = true;
};

const currentTaskSteps = computed(() => {
  if (!currentTaskDetail.value) return [];
  return steps.value.filter(s => s.task_id === currentTaskDetail.value.id);
});

const currentTaskComments = computed(() => {
  if (!currentTaskDetail.value) return [];
  return comments.value.filter(c => c.task_id === currentTaskDetail.value.id);
});

const addStep = async () => {
  if (!newStepTitle.value.trim() || !currentTaskDetail.value) return;

  const payload = {
    task_id: currentTaskDetail.value.id,
    titre: newStepTitle.value.trim(),
    completed: false
  };

  const { data, error } = await supabase.from('pole_task_steps').insert([payload]).select();
  if (!error && data) {
    steps.value.push(data[0]);
    newStepTitle.value = '';
    triggerToast('Étape ajoutée au post-it !');
  }
};

const toggleStep = async (step) => {
  step.completed = !step.completed;
  await supabase.from('pole_task_steps').update({ completed: step.completed }).eq('id', step.id);
};

const deleteStep = async (stepId) => {
  await supabase.from('pole_task_steps').delete().eq('id', stepId);
  steps.value = steps.value.filter(s => s.id !== stepId);
};

const addComment = async () => {
  if (!newComment.value.trim() || !currentTaskDetail.value) return;

  const payload = {
    task_id: currentTaskDetail.value.id,
    auteur: userRoleTitle.value,
    commentaire: newComment.value.trim()
  };

  const { data, error } = await supabase.from('pole_task_comments').insert([payload]).select();
  if (!error && data) {
    comments.value.push(data[0]);
    newComment.value = '';
    triggerToast('Commentaire ajouté.');
  }
};

// ================= ACTIONS SPONSORS / CAGNOTTE / FAQ / MESSAGES ================= //
const selectMsg = async (msg) => {
  selectedMessage.value = msg;
  if (!msg.read) {
    msg.read = true;
    await supabase.from('messages').update({ read: true }).eq('id', msg.id);
  }
};

const deleteMsg = async (id) => {
  await supabase.from('messages').delete().eq('id', id);
  messages.value = messages.value.filter(m => m.id !== id);
  if (selectedMessage.value?.id === id) selectedMessage.value = null;
  triggerToast('Message supprimé.');
};

const openFaqModalFromMessage = (msg) => {
  faqForm.value = { question: msg.message, reponse: '' };
  showFaqModal.value = true;
};

const openManualFaqModal = () => {
  faqForm.value = { question: '', reponse: '' };
  showFaqModal.value = true;
};

const handleSaveFaq = async () => {
  if (!faqForm.value.question || !faqForm.value.reponse) return;
  const { data, error } = await supabase.from('faqs').insert([faqForm.value]).select();
  if (!error && data) {
    faqs.value.unshift(data[0]);
    showFaqModal.value = false;
    faqForm.value = { question: '', reponse: '' };
    triggerToast('Question publiée sur la FAQ !');
  }
};

const deleteFaq = async (id) => {
  await supabase.from('faqs').delete().eq('id', id);
  faqs.value = faqs.value.filter(f => f.id !== id);
  triggerToast('Question supprimée.');
};

const deleteVolunteer = async (id) => {
  await supabase.from('volunteers').delete().eq('id', id);
  volunteers.value = volunteers.value.filter(v => v.id !== id);
  triggerToast('Candidature retirée.');
};

const openCreateSponsor = () => {
  editingSponsor.value = null;
  sponsorForm.value = { nom: '', description: '', logo_url: '' };
  showSponsorModal.value = true;
};

const openEditSponsor = (s) => {
  editingSponsor.value = s;
  sponsorForm.value = { nom: s.nom, description: s.description || '', logo_url: s.logo_url || '' };
  showSponsorModal.value = true;
};

const handleSaveSponsor = async () => {
  if (!sponsorForm.value.nom) return;
  if (editingSponsor.value) {
    const { error } = await supabase.from('sponsors').update(sponsorForm.value).eq('id', editingSponsor.value.id);
    if (!error) {
      const idx = sponsors.value.findIndex(s => s.id === editingSponsor.value.id);
      if (idx !== -1) sponsors.value[idx] = { ...editingSponsor.value, ...sponsorForm.value };
      showSponsorModal.value = false;
      triggerToast('Sponsor mis à jour.');
    }
  } else {
    const { data, error } = await supabase.from('sponsors').insert([sponsorForm.value]).select();
    if (!error && data) {
      sponsors.value.push(data[0]);
      showSponsorModal.value = false;
      triggerToast('Sponsor ajouté.');
    }
  }
};

const deleteSponsor = async (id) => {
  const { error } = await supabase.from('sponsors').delete().eq('id', id);
  if (!error) {
    sponsors.value = sponsors.value.filter(s => s.id !== id);
    triggerToast('Sponsor supprimé.');
  }
};

const handleSaveFundraising = async () => {
  updatingFundraising.value = true;
  const { error } = await supabase
    .from('fundraising')
    .update({
      current_amount: Number(fundraisingCurrent.value) || 0,
      goal_amount: Number(fundraisingGoal.value) || 5000,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  updatingFundraising.value = false;
  if (!error) triggerToast('Cagnotte mise à jour en direct !');
};

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  user.value = data.session?.user || null;
  authLoading.value = false;

  if (user.value) {
    await fetchProfileAndData();
  }
});
</script>

<template>
  <div v-if="authLoading" class="min-h-screen flex items-center justify-center bg-slate-100">
    <i class="fa-solid fa-circle-notch fa-spin text-3xl text-emerald-600"></i>
  </div>

  <!-- CONNEXION -->
  <div v-else-if="!user" class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
      <div class="text-center mb-6">
        <div class="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-2xl mb-3 shadow-xs">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-900">Espace Privé</h2>
        <p class="text-xs text-slate-500 mt-1">Connexion par rôle & pôle — Pas d'oubli 2027</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">E-mail</label>
          <input v-model="loginEmail" required type="email" placeholder="votre-pole@pasdoubli.fr" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Mot de passe</label>
          <input v-model="loginPassword" required type="password" placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none" />
        </div>
        
        <p v-if="loginError" class="text-xs text-rose-600 font-semibold text-center">{{ loginError }}</p>

        <button type="submit" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md">
          Se connecter
        </button>
      </form>

      <div class="mt-6 text-center">
        <a href="/" class="text-xs font-semibold text-slate-400 hover:text-slate-600">
          <i class="fa-solid fa-arrow-left mr-1"></i>Retour au site public
        </a>
      </div>
    </div>
  </div>

  <!-- TABLEAU DE BORD DYNAMIQUE -->
  <div v-else class="min-h-screen bg-slate-100 p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      
      <!-- En-tête -->
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 flex-wrap gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-black text-slate-900">Espace {{ userRoleTitle }}</h1>
            <span 
              v-if="isDirection" 
              class="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-xs flex items-center gap-1.5"
            >
              <i class="fa-solid fa-crown text-[10px]"></i> Direction
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Connecté sous {{ user.email }}</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/" class="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 px-3.5 py-2 rounded-xl hover:bg-emerald-50 transition">
            <i class="fa-solid fa-globe mr-1.5"></i>Voir le site
          </a>
          <button @click="handleLogout" class="text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition cursor-pointer">
            <i class="fa-solid fa-right-from-bracket mr-1.5"></i>Déconnexion
          </button>
        </div>
      </div>

      <!-- Navigation conditionnelle selon les droits -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <button 
          v-if="canAccessTab('poles')"
          @click="currentTab = 'poles'" 
          :class="currentTab === 'poles' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'"
          class="px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2"
        >
          <i class="fa-solid fa-table-columns"></i>
          <span>Tableau Kanban</span>
        </button>

        <button 
          v-if="canAccessTab('messages')"
          @click="currentTab = 'messages'" 
          :class="currentTab === 'messages' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'"
          class="px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
        >
          Messages ({{ messages.length }})
        </button>

        <button 
          v-if="canAccessTab('benevoles')"
          @click="currentTab = 'benevoles'" 
          :class="currentTab === 'benevoles' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'"
          class="px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
        >
          Bénévoles ({{ volunteers.length }})
        </button>

        <button 
          v-if="canAccessTab('faq')"
          @click="currentTab = 'faq'" 
          :class="currentTab === 'faq' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'"
          class="px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
        >
          FAQ ({{ faqs.length }})
        </button>

        <button 
          v-if="canAccessTab('sponsors')"
          @click="currentTab = 'sponsors'" 
          :class="currentTab === 'sponsors' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'"
          class="px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <i class="fa-solid fa-handshake text-xs"></i>
          <span>Sponsors ({{ sponsors.length }})</span>
        </button>

        <button 
          v-if="canAccessTab('cagnotte')"
          @click="currentTab = 'cagnotte'" 
          :class="currentTab === 'cagnotte' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'"
          class="px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
        >
          <i class="fa-solid fa-hand-holding-dollar text-xs"></i>
          <span>Actualiser Cagnotte</span>
        </button>
      </div>

      <!-- ================= VUE KANBAN ================= -->
      <div v-if="currentTab === 'poles'" class="space-y-6">
        
        <!-- Sélecteur de pôle (affiché uniquement si la direction a accès à plusieurs pôles) -->
        <div v-if="accessiblePoles.length > 1" class="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs flex items-center gap-2 overflow-x-auto">
          <button 
            v-for="p in accessiblePoles" 
            :key="p.id"
            @click="selectedPole = p.id"
            :class="selectedPole === p.id ? 'bg-emerald-800 text-white font-black shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold'"
            class="px-4 py-2 rounded-xl text-xs flex items-center gap-2 whitespace-nowrap transition cursor-pointer"
          >
            <i :class="['fa-solid', p.icon]"></i>
            <span>{{ p.label }}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {{ tasks.filter(t => t.pole === p.id).length }}
            </span>
          </button>
        </div>

        <!-- Titre & Nouveau Post-it -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-black text-slate-900 capitalize flex items-center gap-2">
              <span>Pôle {{ allPoles.find(p => p.id === selectedPole)?.label }}</span>
            </h2>
            <p class="text-xs text-slate-500">Cliquez sur un post-it pour ajouter ou cocher ses étapes.</p>
          </div>
          <button 
            @click="openCreateTask('sujet')"
            class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2"
          >
            <i class="fa-solid fa-plus"></i>
            <span>Nouveau Post-it</span>
          </button>
        </div>

        <!-- Colonnes Kanban -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          <div 
            v-for="col in columns" 
            :key="col.id"
            @dragover.prevent
            @drop="onDrop($event, col.id)"
            class="bg-slate-200/60 rounded-2xl p-3 border border-slate-300/80 min-h-[480px] flex flex-col"
          >
            <div :class="['px-3 py-2 rounded-xl font-black text-xs flex items-center justify-between mb-3 border shadow-2xs', col.bgHeader]">
              <span>{{ col.label }}</span>
              <span class="bg-white/80 px-2 py-0.5 rounded-full text-[10px] font-mono">
                {{ tasksByStatus(col.id).length }}
              </span>
            </div>

            <div class="space-y-3 flex-1">
              <div 
                v-for="task in tasksByStatus(col.id)" 
                :key="task.id"
                draggable="true"
                @dragstart="onDragStart($event, task)"
                @click="openDetail(task)"
                class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition cursor-grab active:cursor-grabbing relative group"
              >
                <div class="flex items-start justify-between gap-2 mb-2">
                  <span 
                    v-if="task.assigne_a" 
                    class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 truncate"
                  >
                    <i class="fa-solid fa-user text-[9px] text-emerald-600 mr-1"></i>{{ task.assigne_a }}
                  </span>
                  <span v-else class="text-[10px] italic text-slate-400">Non assigné</span>

                  <div class="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button @click.stop="openEditTask(task)" class="p-1 text-slate-400 hover:text-emerald-700 cursor-pointer">
                      <i class="fa-solid fa-pen text-[11px]"></i>
                    </button>
                    <button @click.stop="deleteTask(task.id)" class="p-1 text-slate-400 hover:text-rose-600 cursor-pointer">
                      <i class="fa-solid fa-trash text-[11px]"></i>
                    </button>
                  </div>
                </div>

                <h4 class="font-extrabold text-slate-900 text-sm leading-snug mb-1">{{ task.titre }}</h4>
                <p v-if="task.description" class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {{ task.description }}
                </p>

                <!-- Jauge des étapes évolutives -->
                <div v-if="getTaskProgress(task.id)" class="mb-3 bg-slate-50 border border-slate-100 rounded-lg p-2">
                  <div class="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1">
                    <span class="flex items-center gap-1">
                      <i class="fa-solid fa-list-check text-emerald-600 text-[11px]"></i>
                      Étapes
                    </span>
                    <span>{{ getTaskProgress(task.id).done }} / {{ getTaskProgress(task.id).total }}</span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      class="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      :style="{ width: `${getTaskProgress(task.id).percent}%` }"
                    ></div>
                  </div>
                </div>

                <!-- Footer carte -->
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span class="hover:text-emerald-700 font-semibold flex items-center gap-1">
                    <i class="fa-regular fa-comment-dots text-xs"></i>
                    <span>{{ comments.filter(c => c.task_id === task.id).length }} avis</span>
                  </span>
                  <span class="text-[10px]">{{ new Date(task.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}</span>
                </div>
              </div>

              <button 
                @click="openCreateTask(col.id)"
                class="w-full py-2 border-2 border-dashed border-slate-300 hover:border-emerald-600 hover:text-emerald-700 text-slate-400 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Ajouter</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ================= VUE MESSAGES (COM / DIRECTION) ================= -->
      <div v-if="currentTab === 'messages' && canAccessTab('messages')" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 max-h-[620px] overflow-y-auto shadow-xs">
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            @click="selectMsg(msg)"
            :class="[
              selectedMessage?.id === msg.id ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-50',
              !msg.read ? 'font-bold bg-white' : 'text-slate-600'
            ]"
            class="p-4 cursor-pointer transition flex items-start justify-between gap-3"
          >
            <div class="overflow-hidden space-y-1">
              <div class="flex items-center gap-2">
                <span v-if="!msg.read" class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="text-sm truncate text-slate-900 font-bold">{{ msg.nom }}</span>
              </div>
              <div class="text-xs text-emerald-700 font-medium truncate">{{ msg.email }}</div>
              <div class="text-xs text-slate-500 truncate">{{ msg.message }}</div>
            </div>
            <span class="text-[10px] text-slate-400 flex-shrink-0">
              {{ new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}
            </span>
          </div>
          <div v-if="messages.length === 0" class="p-8 text-center text-slate-400 text-xs">
            Aucun message reçu.
          </div>
        </div>

        <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs min-h-[380px]">
          <template v-if="selectedMessage">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-100 pb-4 mb-4 gap-4">
              <div>
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {{ selectedMessage.sujet || 'Message' }}
                </span>
                <h3 class="text-xl font-black text-slate-900 mt-2">{{ selectedMessage.nom }}</h3>
                <p class="text-sm text-slate-600 mt-1">
                  <a :href="`mailto:${selectedMessage.email}`" class="text-emerald-700 hover:underline font-semibold">
                    {{ selectedMessage.email }}
                  </a>
                </p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="openFaqModalFromMessage(selectedMessage)"
                  class="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-circle-question"></i>
                  <span>FAQ</span>
                </button>
                <button 
                  @click="deleteMsg(selectedMessage.id)"
                  class="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition border border-rose-200 cursor-pointer"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {{ selectedMessage.message }}
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <a 
                :href="`mailto:${selectedMessage.email}?subject=Re: Course Pas d'oubli`"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                <i class="fa-solid fa-reply"></i>
                <span>Répondre par e-mail</span>
              </a>
            </div>
          </template>
          <div v-else class="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
            <i class="fa-regular fa-envelope-open text-4xl mb-2 text-slate-300"></i>
            <p class="text-xs">Sélectionnez un message dans la colonne de gauche.</p>
          </div>
        </div>
      </div>

      <!-- ================= VUE BÉNÉVOLES (COM / DIRECTION) ================= -->
      <div v-if="currentTab === 'benevoles' && canAccessTab('benevoles')" class="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
        <div 
          v-for="b in volunteers" 
          :key="b.id" 
          class="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 transition"
        >
          <div class="space-y-2">
            <div class="flex items-center gap-3 flex-wrap">
              <span class="font-bold text-slate-900 text-base">{{ b.prenom }} {{ b.nom }}</span>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                {{ availabilityLabels[b.disponibilites] || b.disponibilites }}
              </span>
              <span class="text-xs text-slate-400">
                {{ new Date(b.created_at).toLocaleDateString('fr-FR') }}
              </span>
            </div>

            <div class="flex flex-wrap gap-1.5 pt-0.5">
              <span 
                v-for="pole in b.poles" 
                :key="pole"
                class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
              >
                <i class="fa-solid fa-check text-emerald-600 mr-1 text-[10px]"></i>
                {{ poleLabels[pole] || pole }}
              </span>
            </div>

            <div class="flex items-center gap-4 text-xs text-slate-600 pt-1 flex-wrap">
              <a :href="`mailto:${b.email}`" class="text-emerald-700 hover:underline flex items-center gap-1.5 font-medium">
                <i class="fa-regular fa-envelope"></i>{{ b.email }}
              </a>
              <a :href="`tel:${b.telephone}`" class="text-slate-700 hover:underline flex items-center gap-1.5 font-medium">
                <i class="fa-solid fa-phone"></i>{{ b.telephone }}
              </a>
            </div>

            <p v-if="b.remarques" class="text-xs text-slate-600 italic bg-slate-50 border border-slate-100 p-2.5 rounded-xl max-w-2xl mt-1">
              « {{ b.remarques }} »
            </p>
          </div>

          <div class="flex items-center gap-2 self-end lg:self-center">
            <a 
              :href="`mailto:${b.email}?subject=Association Pas d'oubli - Candidature bénévole`"
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <i class="fa-solid fa-reply"></i>
              <span>Contacter</span>
            </a>
            <button 
              @click="deleteVolunteer(b.id)" 
              class="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
            >
              <i class="fa-solid fa-trash text-sm"></i>
            </button>
          </div>
        </div>

        <div v-if="volunteers.length === 0" class="p-12 text-center text-slate-400 text-xs">
          Aucune candidature bénévole enregistrée pour le moment.
        </div>
      </div>

      <!-- ================= VUE SPONSORS (SPONSOR / DIRECTION) ================= -->
      <div v-if="currentTab === 'sponsors' && canAccessTab('sponsors')" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-xs text-slate-500">Ajoutez et modifiez les entreprises partenaires de la course.</p>
          <button 
            @click="openCreateSponsor" 
            class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <i class="fa-solid fa-plus"></i>
            <span>Ajouter un sponsor</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="s in sponsors" 
            :key="s.id" 
            class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div class="flex items-start gap-4 mb-4">
              <div class="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 flex-shrink-0">
                <img v-if="s.logo_url" :src="s.logo_url" :alt="s.nom" class="max-h-full max-w-full object-contain" />
                <i v-else class="fa-solid fa-handshake text-xl text-slate-300"></i>
              </div>
              <div class="overflow-hidden">
                <h4 class="font-bold text-slate-900 text-sm truncate">{{ s.nom }}</h4>
                <p class="text-xs text-slate-500 line-clamp-2 mt-0.5">{{ s.description || 'Aucune description' }}</p>
              </div>
            </div>

            <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button 
                @click="openEditSponsor(s)" 
                class="text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <i class="fa-solid fa-pen text-[10px]"></i>
                <span>Modifier</span>
              </button>
              <button 
                @click="deleteSponsor(s.id)" 
                class="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition border border-rose-200 cursor-pointer flex items-center gap-1"
              >
                <i class="fa-solid fa-trash text-[10px]"></i>
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="sponsors.length === 0" class="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Aucun partenaire enregistré.
        </div>
      </div>

      <!-- ================= VUE CAGNOTTE (TRÉSORERIE / DIRECTION) ================= -->
      <div v-if="currentTab === 'cagnotte' && canAccessTab('cagnotte')" class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-xl">
        <div class="mb-6">
          <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-hand-holding-dollar text-emerald-600"></i>
            Actualisation de la cagnotte en direct
          </h3>
          <p class="text-xs text-slate-500 mt-1">
            Les changements modifient directement la jauge affichée aux visiteurs sur le site.
          </p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Montant récolté (€)</label>
            <input 
              v-model.number="fundraisingCurrent" 
              type="number" 
              min="0"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Objectif fixé (€)</label>
            <input 
              v-model.number="fundraisingGoal" 
              type="number" 
              min="1"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold text-slate-900 outline-none focus:border-emerald-600"
            />
          </div>

          <button 
            @click="handleSaveFundraising"
            :disabled="updatingFundraising"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <i v-if="updatingFundraising" class="fa-solid fa-circle-notch fa-spin"></i>
            <span>Mettre à jour la cagnotte</span>
          </button>
        </div>
      </div>

      <!-- ================= VUE FAQ (COM / DIRECTION) ================= -->
      <div v-if="currentTab === 'faq' && canAccessTab('faq')" class="space-y-4">
        <div class="flex justify-between items-center">
          <p class="text-xs text-slate-500">Gérez les questions fréquentes affichées sur la page d'accueil.</p>
          <button 
            @click="openManualFaqModal" 
            class="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <i class="fa-solid fa-plus"></i>
            <span>Nouvelle question</span>
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
          <div v-for="item in faqs" :key="item.id" class="p-5 flex items-start justify-between gap-4">
            <div class="space-y-1.5">
              <h4 class="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                {{ item.question }}
              </h4>
              <p class="text-xs text-slate-600 leading-relaxed pl-4">{{ item.reponse }}</p>
            </div>
            <button @click="deleteFaq(item.id)" class="text-slate-400 hover:text-rose-600 p-2 text-sm transition cursor-pointer">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <div v-if="faqs.length === 0" class="p-8 text-center text-slate-400 text-xs">
            La FAQ est vide.
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- MODALE CRÉATION / ÉDITION POST-IT -->
  <div v-if="showTaskModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
      <button @click="showTaskModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <h3 class="text-lg font-black text-slate-900 mb-1">
        {{ editingTask ? 'Modifier le Post-it' : 'Nouveau Post-it' }}
      </h3>
      <p class="text-xs text-slate-500 mb-4">Pôle : <strong class="capitalize text-emerald-700">{{ selectedPole }}</strong></p>

      <div class="space-y-3.5">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Titre de l'action</label>
          <input v-model="taskForm.titre" type="text" placeholder="Ex. Relancer la mairie pour le tracé" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">En charge</label>
          <input v-model="taskForm.assigne_a" type="text" placeholder="Ex. Thomas, Lucie..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Colonne</label>
          <select v-model="taskForm.status" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600 bg-white">
            <option v-for="c in columns" :key="c.id" :value="c.id">{{ c.label }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
          <textarea v-model="taskForm.description" rows="3" placeholder="Détails du sujet..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600"></textarea>
        </div>

        <button @click="saveTask" class="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition cursor-pointer mt-2">
          {{ editingTask ? 'Mettre à jour' : 'Épingler le post-it' }}
        </button>
      </div>
    </div>
  </div>

  <!-- MODALE DE DÉTAIL D'UN POST-IT (ÉTAPES ÉVOLUTIVES & COMMENTAIRES) -->
  <div v-if="showDetailModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative flex flex-col max-h-[90vh]">
      <button @click="showDetailModal = false" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>

      <div class="border-b border-slate-100 pb-3 mb-4 pr-6">
        <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
          Pôle {{ currentTaskDetail?.pole }}
        </span>
        <h3 class="text-xl font-black text-slate-900 mt-2">{{ currentTaskDetail?.titre }}</h3>
        <p v-if="currentTaskDetail?.assigne_a" class="text-xs text-slate-500 mt-0.5">
          En charge : <strong class="text-slate-800">{{ currentTaskDetail?.assigne_a }}</strong>
        </p>
        <p v-if="currentTaskDetail?.description" class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mt-2 border border-slate-100">
          {{ currentTaskDetail?.description }}
        </p>
      </div>

      <div class="flex-1 overflow-y-auto space-y-6 pr-1">
        
        <!-- SECTION ÉTAPES ÉVOLUTIVES (CHECKLIST) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <i class="fa-solid fa-list-check text-emerald-600"></i>
              Étapes d'avancement ({{ currentTaskSteps.filter(s => s.completed).length }}/{{ currentTaskSteps.length }})
            </h4>
          </div>

          <div class="flex gap-2 mb-3">
            <input 
              v-model="newStepTitle" 
              @keyup.enter="addStep"
              type="text" 
              placeholder="Ajouter une étape au post-it (ex: Appel validé)..." 
              class="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600"
            />
            <button 
              @click="addStep" 
              class="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Ajouter
            </button>
          </div>

          <div class="space-y-1.5">
            <div 
              v-for="st in currentTaskSteps" 
              :key="st.id" 
              class="flex items-center justify-between p-2.5 rounded-xl border transition group"
              :class="st.completed ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200 text-slate-800'"
            >
              <label class="flex items-center gap-2.5 flex-1 cursor-pointer select-none text-xs">
                <input 
                  type="checkbox" 
                  :checked="st.completed" 
                  @change="toggleStep(st)"
                  class="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span>{{ st.titre }}</span>
              </label>
              <button 
                @click="deleteStep(st.id)" 
                class="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition p-1 cursor-pointer"
              >
                <i class="fa-solid fa-trash text-[11px]"></i>
              </button>
            </div>

            <div v-if="currentTaskSteps.length === 0" class="text-center py-3 text-slate-400 text-xs italic">
              Aucune étape définie pour ce post-it.
            </div>
          </div>
        </div>

        <!-- SECTION COMMENTAIRES -->
        <div class="pt-4 border-t border-slate-100">
          <h4 class="text-xs font-black uppercase text-slate-700 tracking-wider mb-2 flex items-center gap-1.5">
            <i class="fa-regular fa-comments text-emerald-600"></i>
            Commentaires & avis ({{ currentTaskComments.length }})
          </h4>

          <div class="space-y-2 mb-3">
            <div v-for="c in currentTaskComments" :key="c.id" class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div class="flex items-center justify-between font-bold text-slate-800 mb-1">
                <span class="text-emerald-800 font-extrabold">{{ c.auteur }}</span>
                <span class="text-[10px] text-slate-400 font-normal">
                  {{ new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>
              <p class="text-slate-600 whitespace-pre-wrap leading-relaxed">{{ c.commentaire }}</p>
            </div>
            <div v-if="currentTaskComments.length === 0" class="text-center py-4 text-slate-400 text-xs italic">
              Aucun avis pour l'instant.
            </div>
          </div>

          <div class="flex gap-2">
            <input 
              v-model="newComment" 
              @keyup.enter="addComment"
              type="text" 
              placeholder="Écrire une remarque..." 
              class="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-600"
            />
            <button 
              @click="addComment" 
              class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer transition"
            >
              Envoyer
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- MODALE SPONSOR -->
  <div v-if="showSponsorModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
      <button @click="showSponsorModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
      <h3 class="text-lg font-black text-slate-900 mb-1">
        {{ editingSponsor ? 'Modifier le sponsor' : 'Nouveau sponsor' }}
      </h3>
      <div class="space-y-4 mt-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Nom</label>
          <input v-model="sponsorForm.nom" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
          <input v-model="sponsorForm.description" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">URL du logo</label>
          <input v-model="sponsorForm.logo_url" type="url" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600" />
        </div>
        <button @click="handleSaveSponsor" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer">
          {{ editingSponsor ? 'Enregistrer' : 'Créer' }}
        </button>
      </div>
    </div>
  </div>

  <!-- MODALE FAQ -->
  <div v-if="showFaqModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
      <button @click="showFaqModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
      <h3 class="text-lg font-black text-slate-900 mb-1">Publier une question FAQ</h3>
      <div class="space-y-4 mt-4">
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Question</label>
          <input v-model="faqForm.question" type="text" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-slate-600 mb-1">Réponse</label>
          <textarea v-model="faqForm.reponse" rows="4" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-emerald-600"></textarea>
        </div>
        <button @click="handleSaveFaq" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition cursor-pointer">
          Enregistrer dans la FAQ
        </button>
      </div>
    </div>
  </div>

</template>
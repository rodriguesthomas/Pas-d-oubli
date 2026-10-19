import { ref } from 'vue';

const isVisible = ref(false);
const message = ref('');
let timeoutId = null;

export function useToast() {
  const triggerToast = (msg, duration = 4500) => {
    message.value = msg;
    isVisible.value = true;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      isVisible.value = false;
    }, duration);
  };

  return { isVisible, message, triggerToast };
}
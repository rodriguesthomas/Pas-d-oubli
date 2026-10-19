import { ref, onMounted, onUnmounted } from 'vue';

export function useCountdown(targetDateString = "2027-05-23T09:00:00") {
  const days = ref('000');
  const hours = ref('00');
  const minutes = ref('00');
  const seconds = ref('00');
  let interval = null;

  const update = () => {
    const target = new Date(targetDateString).getTime();
    const diff = target - Date.now();

    if (diff <= 0) return;

    days.value = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(3, '0');
    hours.value = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
    minutes.value = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    seconds.value = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
  };

  onMounted(() => {
    update();
    interval = setInterval(update, 1000);
  });

  onUnmounted(() => {
    if (interval) clearInterval(interval);
  });

  return { days, hours, minutes, seconds };
}
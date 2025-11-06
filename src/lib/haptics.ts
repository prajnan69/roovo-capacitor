import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const triggerHaptic = async (duration: number = 15) => {
  await Haptics.vibrate({ duration });
};

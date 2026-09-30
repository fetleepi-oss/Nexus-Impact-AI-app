// Haptic feedback utility supporting both React Native (expo-haptics) and Web (navigator.vibrate)

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function triggerHaptic(type: HapticType = 'medium'): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate?.(10);
          break;
        case 'medium':
          navigator.vibrate?.(20);
          break;
        case 'heavy':
          navigator.vibrate?.(35);
          break;
        case 'success':
          navigator.vibrate?.([15, 30, 20]);
          break;
        case 'warning':
        case 'error':
          navigator.vibrate?.([25, 40, 25]);
          break;
        default:
          navigator.vibrate?.(15);
      }
    }
  } catch (e) {
    // Ignore environments where vibration is prohibited
  }
}

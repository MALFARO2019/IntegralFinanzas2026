/**
 * Hook de color simplificado — compatible con el sistema de Colors de Integral Finanzas.
 */
import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  _colorName?: string
) {
  return props.dark ?? props.light ?? Colors.foreground;
}

import { useMemo } from 'react';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { spacing } from '../theme/spacing';

export const useTheme = () => {
  return useMemo(
    () => ({
      colors,
      fonts,
      spacing,
    }),
    []
  );
};

export type Theme = ReturnType<typeof useTheme>;


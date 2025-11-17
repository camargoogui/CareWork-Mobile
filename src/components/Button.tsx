import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const theme = useTheme();

  const buttonStyle: ViewStyle[] = [
    styles.button,
    {
      backgroundColor: variant === 'outline' ? 'transparent' : theme.colors[variant],
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
      paddingVertical: size === 'small' ? theme.spacing.sm : size === 'large' ? theme.spacing.md : theme.spacing.sm + 2,
      paddingHorizontal: size === 'small' ? theme.spacing.md : size === 'large' ? theme.spacing.xl : theme.spacing.lg,
      opacity: disabled || loading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
    },
    style,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    {
      color: variant === 'outline' ? theme.colors.primary : theme.colors.white,
      fontSize: size === 'small' ? theme.fonts.sizes.sm : size === 'large' ? theme.fonts.sizes.lg : theme.fonts.sizes.md,
      fontWeight: size === 'large' ? '600' : '500',
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.white} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    textAlign: 'center',
  },
});


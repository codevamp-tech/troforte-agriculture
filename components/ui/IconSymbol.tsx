import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Symbol, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, Platform, StyleProp, TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'message.fill': 'chat',
  'headphones.circle.fill': 'support-agent',
  'bubble.left.and.bubble.right': 'chat-bubble-outline',
    'desktopcomputer': 'dashboard', // ✅ Dashboard screen
  'leaf.fill': 'eco',
  'square.and.arrow.up': 'upload', 
  'lightbulb.fill': 'lightbulb',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  if (Platform.OS === 'ios') {
    return (
      <Symbol
        name={name}
        size={size}
        color={color}
        style={style}
        weight={weight}
        resizingMode="scale"
      />
    );
  }

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name] ?? 'block'}
      style={style}
    />
  );
}

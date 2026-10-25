import { StatusBar } from 'expo-status-bar';
import { styled } from 'nativewind';
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type ResolvedFontProps = { style?: StyleProp<TextStyle> };

// Prints the fontFamily that className="font-sans" resolves to, so the result is readable as text.
function ResolvedFont({ style }: ResolvedFontProps) {
  const line = `font-sans resolved fontFamily: ${StyleSheet.flatten(style)?.fontFamily} (expected Courier)`;
  console.log(line);
  return <Text style={style}>{line}</Text>;
}

const StyledResolvedFont = styled(ResolvedFont);

export default function App() {
  return (
    <SafeAreaProvider>
      <View className="flex-1 justify-center gap-6 bg-white px-4">
        <StyledResolvedFont className="font-sans" />
        <Text style={{ fontFamily: 'Courier' }}>
          Reference, style fontFamily Courier: the line above should look like this one
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

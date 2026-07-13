import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#121212' },
        animation: 'fade_from_bottom',
        presentation: 'card',
        statusBarStyle: 'light',
        statusBarBackgroundColor: '#121212',
      }}
    >
      {/* Indicamos que a pasta (tabs) é a primeira tela que deve carregar */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="exercicios" />
      <Stack.Screen name="treino_ativo" />
      <Stack.Screen name="detalhe_exercicio" />
    </Stack>
  );
}
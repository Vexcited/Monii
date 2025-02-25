import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name="add" options={{
        presentation: "modal",
        headerShown: true,
        headerTitle: "Plan an operation",
      }} />
    </Stack>
  )
}

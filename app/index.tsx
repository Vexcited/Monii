import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { tokens } from "../atoms/tokens";
import { useAtomValue } from "jotai";

export default function Index() {
  const auth = useAtomValue(tokens);

  useEffect(() => {
    if (auth === undefined) return;

    if (auth === null) router.replace("/auth");
    else router.replace("/dashboard");
  }, [auth]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator />
    </View>
  );
}

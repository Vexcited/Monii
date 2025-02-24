import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function AuthIndex() {
  const handleServiceLogin = (service: string) => {
    switch (service) {
      case "credit-agricole":
        router.push("/auth/credit-agricole/structures");
        break;
    }
  }

  return (
    <View style={{
      paddingTop: 30
    }}>
      <Button
        title="Crédit Agricole"
        onPress={() => handleServiceLogin("credit-agricole")}
      />
    </View>
  )
}

import { getStructureV1All, type Structure } from "credit-agricole-mobile-api";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthCreditAgricoleStructures () {
  const [structures, setStructures] = useState<Array<Structure>>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getStructureV1All().then(setStructures);
  }, []);

  return (
    <ScrollView style={{ paddingTop: 16, paddingInline: 16 }}>
      {structures ? (
        structures.map(({ structure_id, long_label, departments }) => (
          <Pressable
            key={structure_id}
            onPress={() => router.push(`/auth/credit-agricole/keypad/${structure_id}`)}
            style={({ pressed }) => ({
              display: "flex",
              flexDirection: "column",
              marginBottom: 8,
              gap: 4,
              backgroundColor: pressed ? "#D8D8D8" : "transparent",
              paddingInline: 16,
              paddingBlock: 8,
              borderRadius: 8
            })}
          >
            <Text style={{
              fontWeight: "bold",
              fontSize: 16
            }}>
              {long_label}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 6
              }}
            >
              {departments.map(({ code }) => (
                <Text key={code}>
                  {code}
                </Text>
              ))}
            </View>
          </Pressable>
        ))
      ) : (
        <ActivityIndicator style={{ marginTop: 32 }} />
      )}

      <View style={{ height: insets.bottom + 32 }} />
    </ScrollView>
  )
}

import { getAuthenticationV1Keypad, postAuthenticationV1Keypad, Tokens, type Keypad } from "credit-agricole-mobile-api";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState, type FC as Component } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useSetAtom } from "jotai";
import { tokens } from "@/atoms/tokens";

const Key: Component<{
  value: string
  onPress: (value: string) => void
}> = (props) => {
  return (
    <Pressable
      onPress={() => props.onPress(props.value)}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#D8D8D8" : "transparent",
        borderRadius: 8,
        padding: 32
      })}
    >
      <Text style={{
        fontSize: 32
      }}>
        {props.value}
      </Text>
    </Pressable>
  )
}

export default function AuthCreditAgricoleKeypad () {
  const setTokens = useSetAtom(tokens);
  const { structure } = useLocalSearchParams<{ structure: string }>();
  const [keypad, setKeypad] = useState<Keypad>();
  const code = useRef("");
  const [visibleCode, setVisibleCode] = useState("");
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    getAuthenticationV1Keypad(structure)
      .then(setKeypad)
      .finally(() => setLoading(false));
  }, [structure]);

  const handleKeyPress = (value: string): void => {
    if (loading) return;
    if (!keypad) return;
    if (login.length !== 11) return;

    code.current += value;
    setVisibleCode(code => code + value);

    setTimeout(() => {
      setVisibleCode(code => code.replace(/\d/g, "*"));
    }, 500);

    if (code.current.length === 6) {
      const keys = code.current.split("").map((char) => keypad.keys_layout.indexOf(char).toString());

      setLoading(true);
      postAuthenticationV1Keypad(structure, login, keypad.id, keys)
        .then(handleSuccessfulAuth)
        .finally(() => setLoading(false));
    }
  }

  const handleSuccessfulAuth = (tokens: Tokens): void => {
    setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      service: "credit-agricole"
    });

    router.replace("/");
  }

  return (
    <View style={{
      padding: 32,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      gap: 16
    }}>
      <Text style={{ textAlign: "center" }}>
        Enter your 11-digit USER ID and your passcode.
      </Text>

      <TextInput
        style={{ fontSize: 24 }}
        placeholder="00000000000"
        keyboardType="numeric"
        value={login}
        onChangeText={setLogin}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text>
          {visibleCode}
        </Text>
      )}

      {keypad && (
        <View style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={{
            display: "flex",
            flexDirection: "row",
          }}>
            <Key onPress={handleKeyPress} value={keypad.keys_layout[0]} />
            <Key onPress={handleKeyPress} value={keypad.keys_layout[1]} />
            <Key onPress={handleKeyPress} value={keypad.keys_layout[2]} />
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
          }}>
            <Key onPress={handleKeyPress} value={keypad.keys_layout[3]} />
            <Key onPress={handleKeyPress} value={keypad.keys_layout[4]} />
            <Key onPress={handleKeyPress} value={keypad.keys_layout[5]} />
          </View>
          <View style={{
            display: "flex",
            flexDirection: "row",
          }}>
            <Key onPress={handleKeyPress} value={keypad.keys_layout[6]} />
            <Key onPress={handleKeyPress} value={keypad.keys_layout[7]} />
            <Key onPress={handleKeyPress} value={keypad.keys_layout[8]} />
          </View>

          <Key onPress={handleKeyPress} value={keypad.keys_layout[9]} />
        </View>
      )}
    </View>
  )
}

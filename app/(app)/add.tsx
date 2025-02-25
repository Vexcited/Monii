import { useState } from "react";
import { Text, View, Switch, TextInput, Button } from "react-native";
import { Calendar } from "react-native-calendars";

export default function Add () {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [isRepeated, setRepeated] = useState(false);

  return (
    <View>
      <Text>Label</Text>
      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder="My monthly operation"
      />

      <Text>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        inputMode="numeric"
        placeholder="9.99"
      />

      <Text>Repeated</Text>
      <Switch
        value={isRepeated}
        onValueChange={setRepeated}
      />

      <Calendar
        enableSwipeMonths={true}
      />

      <Button
        title="Create"
        onPress={() => {}}
      />
    </View>
  )
}

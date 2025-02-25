import { Plans } from "@/atoms/plans";
import { Transaction } from "@/types/transaction";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { Text, View, TextInput, Button } from "react-native";

export default function Add () {
  const setPlans = useSetAtom(Plans);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");

  const handleOperationCreation = useCallback(() => {
    if (!day || !amount) return;
    let date = day.padStart(2, "0");

    if (month) {
      date += "-" + month.padStart(2, "0");
      if (year) date += "-" + year;
    }

    const operation: Transaction = {
      amount: parseFloat(amount),
      label,
      currency: "EUR",
      date
    };

    setPlans((prev) => [...prev, operation]);
    router.back();
  }, [day, month, year, label, amount]);

  return (
    <View>
      <Text>Label</Text>
      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder="My monthly operation"
      />

      <Text>Amount (append - in front if removes money)</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        inputMode="numeric"
        placeholder="9.99"
      />

      <Text>Day</Text>
      <TextInput
        value={day}
        onChangeText={setDay}
        inputMode="numeric"
        placeholder="31"
      />

      <Text>Month</Text>
      <TextInput
        value={month}
        onChangeText={setMonth}
        inputMode="numeric"
        placeholder="12"
      />
      <Text>Year</Text>
      <TextInput
        value={year}
        onChangeText={setYear}
        inputMode="numeric"
        placeholder="2025"
      />

      <Button
        title="Create"
        onPress={handleOperationCreation}
      />
    </View>
  )
}

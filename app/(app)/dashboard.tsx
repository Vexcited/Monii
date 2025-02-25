import { useEffect, useMemo } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { useAccount } from "@/hooks/useAccount";
import { getFutureOperationV1FutureCardOperations, getFutureOperationV1FutureTransfers } from "credit-agricole-mobile-api";
import { Transaction } from "@/types/transaction";
import { useMMKVObject } from "react-native-mmkv";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { convertDateToTransactionDate } from "@/utils/calendar";
import { useActivePlansForNow } from "@/hooks/useActivePlansForNow";

export default function Dashboard () {
  const account = useAccount();
  const plans = useActivePlansForNow();

  const [futureOperations, setFutureOperations] = useMMKVObject<Array<Transaction>>("future_operations");
  const [futureTransfers, setFutureTransfers] = useMMKVObject<Array<Transaction>>("future_transfers");

  const future = useMemo(() => [
    ...(futureOperations ?? []),
    ...(futureTransfers ?? []),
  ], [futureOperations, futureTransfers]);

  const futureBalance = useMemo(() => {
    const currentBalance = account.balance ?? 0;
    const futureSummedUp = future.reduce((acc, transaction) => acc + transaction.amount, 0);
    const plansSummedUp = plans.reduce((acc, transaction) => acc + transaction.amount, 0);

    return currentBalance + futureSummedUp + plansSummedUp;
  }, [account.balance, future, plans])

  useEffect(() => {
    if (!account.id) return;

    getFutureOperationV1FutureCardOperations(account.accessToken, account.id)
      .then(({ operations, preauthorized_operations }) => {
        const merged = [ ...operations, ...preauthorized_operations ];
        merged.sort((a, b) => b.date_heure - a.date_heure);

        const transactions: Array<Transaction> = merged.map(operation => ({
          amount: operation.montant_en_euro.montant,
          label: operation.libelle,
          date: convertDateToTransactionDate(new Date(operation.date_heure)),
          currency: operation.montant_en_euro.devise
        }));

        setFutureOperations(transactions);
      });

    getFutureOperationV1FutureTransfers(account.accessToken, account.id)
      .then(({ future_transfers }) => {
        future_transfers.sort((a, b) => b.date - a.date);

        const transfers: Array<Transaction> = future_transfers.map(operation => ({
          amount: operation.amount,
          label: operation.additional_label,
          // TODO: check if transfers need to be *1000 or not...
          date: convertDateToTransactionDate(new Date(operation.date)),
          currency: "EUR"
        }));

        setFutureTransfers(transfers);
      });
  }, [account.id, account.accessToken, setFutureOperations, setFutureTransfers]);

  return (
    <SafeAreaView style={{
      paddingTop: 0,
      padding: 32,
    }}>
      <View style={{
        gap: 4,
        display: "flex",
        padding: 24,
        alignItems: "center",
      }}>
        <Text style={{
          fontSize: 20,
          fontWeight: "bold",
        }}>{futureBalance.toFixed(2)} EUR</Text>
        <Text style={{
          opacity: 0.5,
        }}>Currently at {(account.balance ?? 0).toFixed(2)} EUR</Text>
      </View>

      <View>
        <Text>Known future operations and transfers</Text>
        <ScrollView>
          {future.map((transaction, index) => (
            <View key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 16
              }}
            >
              <Text
                style={{ flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {transaction.label}
              </Text>

              <Text style={{
                flexShrink: 0,
              }}>
                {transaction.amount.toFixed(2)} {transaction.currency}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View>
        <Text>Planned operations this month</Text>
        <Button title="Add" onPress={() => router.push("/(app)/add")} />

        <ScrollView>
          {plans.map((transaction, index) => (
            <View key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 16
              }}
            >
              <Text
                style={{ flex: 1 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {transaction.label}
              </Text>

              <Text style={{
                flexShrink: 0,
              }}>
                {transaction.amount.toFixed(2)} {transaction.currency}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

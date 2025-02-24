import 'react-native-get-random-values';

import {
  getHomeV2FirstAccount,
  postAuthenticationV1RefreshToken,
  ExpiredTokenError
} from "credit-agricole-mobile-api";

import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useMMKVNumber, useMMKVString } from "react-native-mmkv";

import { tokens } from "@/atoms/tokens";

export const useAccount = () => {
  const { accessToken, refreshToken } = useAtomValue(tokens)!;
  const setTokens = useSetAtom(tokens);

  const [accountID, setAccountID] = useMMKVString("account.id")
  const [balance, setBalance] = useMMKVNumber("account.balance")

  useEffect(() => {
    getHomeV2FirstAccount(accessToken)
      .then(account => {
        setAccountID(account.contract_number);
        setBalance(account.balance.amount);
      })
      .catch(error => {
        if (error instanceof ExpiredTokenError) {
          postAuthenticationV1RefreshToken(accessToken, refreshToken)
            .then(({ access_token, refresh_token }) => {
              setTokens({
                service: "credit-agricole",
                accessToken: access_token,
                refreshToken: refresh_token
              });
            });
        }
      });
  }, [accessToken]);

  return {
    id: accountID,
    accessToken,
    balance
  };
};

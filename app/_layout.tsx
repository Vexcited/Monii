// NOTE: this is where we'll declare all the
//       polyfills since this is the root layout
//       of the app, we can't go higher than this.
import 'react-native-get-random-values';

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack />
  )
}

import { AuthProvider } from "@/Context/authContext";
import CartProvider from "@/Context/cartContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <CartProvider>
      <AuthProvider>
        <StatusBar barStyle="dark-content" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(adminScreens)" />
          <Stack.Screen name="(ClientScreens)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="products/[productId]" />
          <Stack.Screen name="products/search" />
          <Stack.Screen name="products/allproducts" />
        </Stack>
      </AuthProvider>
    </CartProvider>
  );
}

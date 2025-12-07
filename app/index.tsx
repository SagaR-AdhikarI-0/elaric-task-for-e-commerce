import { useAuth } from "@/Context/authContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    return <Redirect href="/(tabs)" />;
}

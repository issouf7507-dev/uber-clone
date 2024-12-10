import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import CustumButton from "@/components/CustumButton";
import { router } from "expo-router";

const verification = () => {
  return (
    <SafeAreaView className="flex-1 h-full items-center justify-center bg-white">
      <View>
        <Image
          source={images.check}
          className="w-[110px] h-[110px] mx-auto my-5"
        />

        <Text className="text-3xl font-JakartaBold text-center">Verifieds</Text>
        <Text className="text-center text-base text-gray-400 font-Jakarta mt-2">
          You have successfully verified your account
        </Text>
      </View>

      <View className="w-full px-10">
        <CustumButton
          title="Browse Home"
          onPress={() => router.replace("/(root)/(tabs)/home")}
          className="mt-5"
        />
      </View>
    </SafeAreaView>
  );
};

export default verification;

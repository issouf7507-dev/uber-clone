import { View, Text, Image } from "react-native";
import React from "react";
import CustumButton from "./CustumButton";
import { icons } from "@/constants";

const OAuth = () => {
  const handleGooglePress = async () => {};
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100"></View>
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100"></View>
      </View>

      <CustumButton
        title="Log In with Google"
        // onPress={onSignUpPress}
        className="mt-5 w-full shadow-none border border-neutral-200"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGooglePress}
      />
    </View>
  );
};

export default OAuth;

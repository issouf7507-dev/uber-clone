import { ScrollView, StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, images } from "@/constants";
import InputField from "@/components/InputField";
import CustumButton from "@/components/CustumButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";

import { ReactNativeModal } from "react-native-modal";
import { fetchAPI } from "@/libs/fetch";

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccesModal, setShowSuccesModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    // router.push("/(root)/(tabs)/home");
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({
        ...verification,

        state: "pending",
      });
    } catch (err: any) {
      // console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  // console.log(showSuccesModal);

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdSessionId,
          }),
        });

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
        // setShowSuccesModal(true); // Correctement défini ici
        router.replace("/(auth)/verification");
      } else {
        setVerification({
          ...verification,
          error: "Verification failed",
          state: "failed",
        });
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />

          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Acount
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />

          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustumButton
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          // onModalHide={() => {
          //   if (verification.state === "success") {
          //     setShowSuccesModal(true);
          //   }
          // }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent verification code to {form.email}
            </Text>

            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code: code })
              }
            />

            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}

            <CustumButton
              title="Veriry Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        {/* 
        <ReactNativeModal
          isVisible={verification.state === "success"}
          // isVisible={showSuccesModal}
          // isVisible={true}

          // onBackdropPress={() => setShowSuccesModal(false)} // Permet de fermer la modal si l'utilisateur clique en dehors
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />

            <Text className="text-3xl font-JakartaBold text-center">
              Verifieds
            </Text>
            <Text className="text-center text-base text-gray-400 font-Jakarta mt-2">
              You have successfully verified your account
            </Text>

            <CustumButton
              title="Browse Home"
              onPress={() => router.replace("/(root)/(tabs)/home")}
              className="mt-5"
            />
          </View>
        </ReactNativeModal> */}
      </View>
    </ScrollView>
  );
};

export default Signup;

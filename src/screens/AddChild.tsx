import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import uuid from "react-native-uuid";

import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { db } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "AddChild">;

export default function AddChild({ navigation }: Props) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const { loggedInUser } = useAuth();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const response = await fetch(image);
    const blob = await response.blob();
    const fileRef = ref(getStorage(), `profilePictures/${uuid.v4()}`);
    const result = await uploadBytes(fileRef, blob);
    try {
      await ref;
    } catch (e) {
      Alert.alert("Error", e.message);
    }
    setImage(null);
    return await getDownloadURL(result.ref);
  };

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleBirthDateChange = (event: DateTimePickerEvent, date: Date) => {
    setBirthDate(date);
  };

  const handleSubmit = async () => {
    // Upload the image to Firebase Storage
    const uploadedImageUrl = await uploadImage();

    const createChildDocument = async () => {
      try {
        await addDoc(collection(db, `${loggedInUser.doc.path}/children/`), {
          name,
          birth_date: birthDate,
          picture: uploadedImageUrl,
        });
      } catch (error) {
        Alert.alert("Error creating child document:", error);
      }
    };

    createChildDocument();
    navigation.navigate("Home");
  };

  return (
    <View className="bg-white w-full h-full flex justify-between">
      <View className="m-4 space-y-4">
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          className="bg-black/5 p-5 rounded-2xl w-full"
        >
          <TextInput
            placeholder="Name"
            placeholderTextColor={"gray"}
            value={name}
            onChangeText={handleNameChange}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          className=" p-5 rounded-2xl w-full flex-row justify-between items-center"
        >
          <Text>Birth Date: </Text>
          <DateTimePicker
            mode="date"
            value={birthDate}
            onChange={handleBirthDateChange}
          />
        </Animated.View>

        {image ? (
          <Image source={{ uri: image }} className="w-40 h-40 mx-auto" />
        ) : (
          <TouchableOpacity
            className="w-40 h-40 mx-auto bg-gray-400 justify-center"
            onPress={pickImage}
          >
            <Text className="text-white text-center">Upload image</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          disabled={!name || !birthDate || !image}
          onPress={handleSubmit}
          className="bg-black w-full p-3 mb-3 rounded-2xl"
        >
          <Text className="text-white font-bold text-xl text-center">
            Add child
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

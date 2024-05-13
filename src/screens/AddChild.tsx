import React, { useState } from "react";
import { Alert, Button, Image, TextInput, View } from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid from "react-native-uuid";

import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { db } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "AddChild">;

export default function AddChild({ navigation }: Props) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date(1598051730000));
  const [image, setImage] = useState("");
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
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <View className="bg-white w-full h-full flex justify-around">
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={handleNameChange}
      />

      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} className="w-32 h-32 mx-auto" />}
      <DateTimePicker
        mode="date"
        value={birthDate}
        onChange={handleBirthDateChange}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

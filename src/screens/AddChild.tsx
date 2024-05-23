import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import uuid from "react-native-uuid";

import AvatarPicker from "../components/AvatarPicker";
import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { db } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "AddChild">;

export default function AddChild({ navigation }: Props) {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("male");
  const [birthDate, setBirthDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [pictureMode, setPictureMode] = useState(null);
  const { loggedInUser } = useAuth();

  const uploadImage = async () => {
    if (!image) return null;
    const response = await fetch(image);
    const blob = await response.blob();
    const fileRef = ref(getStorage(), `${loggedInUser.doc.id}/${uuid.v4()}`);
    const result = await uploadBytes(fileRef, blob);
    try {
      await ref;
    } catch (e) {
      Alert.alert("Error", e.message);
    }
    return await getDownloadURL(result.ref);
  };

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleBirthDateChange = (event: DateTimePickerEvent, date: Date) => {
    setBirthDate(date);
  };

  const handleSubmit = async () => {
    if (!name || !birthDate || !gender)
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    // Upload the image to Firebase Storage
    const uploadedImageUrl = await uploadImage();

    const createChildDocument = async () => {
      try {
        await addDoc(collection(db, `${loggedInUser.doc.path}/children/`), {
          name,
          gender,
          birth_date: birthDate,
          picture: uploadedImageUrl || "",
          avatar_id: avatar?.id || "",
          picture_mode: pictureMode,
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
            placeholder="Prénom"
            placeholderTextColor={"gray"}
            value={name}
            onChangeText={handleNameChange}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
        >
          <Text className="text-gray-500 font-bold ml-2 mb-2">
            Sexe de naissance:
          </Text>
          <View className="flex-row bg-black/5 p-5 rounded-2xl w-full">
            <TouchableOpacity
              className="flex-row items-center mr-4"
              onPress={() => setGender("male")}
            >
              <View
                className={`w-4 h-4 rounded-full border-2 ${
                  gender === "male"
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-400"
                }`}
              />
              <Text className="text-gray-500 ml-2">Garçon</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setGender("female")}
            >
              <View
                className={`w-4 h-4 rounded-full border-2 ${
                  gender === "female"
                    ? "bg-pink-500 border-pink-500"
                    : "border-gray-400"
                }`}
              />
              <Text className="text-gray-500 ml-2">Fille</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          className=" p-5 rounded-2xl w-full flex-row justify-between items-center"
        >
          <Text>Date de naissance: </Text>
          <DateTimePicker
            locale="fr-FR"
            mode="date"
            value={birthDate}
            onChange={handleBirthDateChange}
          />
        </Animated.View>
        <AvatarPicker
          image={image}
          avatar={avatar}
          pictureMode={pictureMode}
          setAvatar={setAvatar}
          setImage={setImage}
          setPictureMode={setPictureMode}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-black w-full p-3 mb-3 rounded-2xl"
        >
          <Text className="text-white font-bold text-xl text-center">
            Ajouter mon enfant
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

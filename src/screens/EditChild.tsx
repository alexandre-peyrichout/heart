import React, { useEffect, useState } from "react";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Animated, { FadeInDown } from "react-native-reanimated";
import uuid from "react-native-uuid";

import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { db } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "EditChild">;

export default function EditChild({ navigation, route }: Props) {
  const { childId } = route.params;
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("male");
  const [birthDate, setBirthDate] = useState(new Date());
  const [image, setImage] = useState(null);
  const [child, setChild] = useState(null);
  const { loggedInUser } = useAuth();

  const childDoc = doc(db, `${loggedInUser.doc.path}/children/${childId}`);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const child = await getDoc(childDoc);
        setChild(child);
        const { name, gender, birth_date, picture } = child.data();
        setName(name);
        setGender(gender);
        setBirthDate(
          new Date(birth_date.seconds * 1000 + birth_date.nanoseconds / 1000000)
        );
        setImage(picture);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    fetchChild();
  }, []);

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
    if (image && image !== child.data().picture) {
      const response = await fetch(image);
      const blob = await response.blob();
      const fileRef = ref(getStorage(), `${loggedInUser.doc.id}/${uuid.v4()}`);
      const result = await uploadBytes(fileRef, blob);
      try {
        await ref;
      } catch (e) {
        Alert.alert("Error", e.message);
      }
      setImage(null);
      return await getDownloadURL(result.ref);
    } else {
      return child.data().picture;
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleBirthDateChange = (event: DateTimePickerEvent, date: Date) => {
    setBirthDate(date);
  };

  const handleSubmit = async () => {
    if (!name || !birthDate)
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    // Upload the image to Firebase Storage
    const uploadedImageUrl = await uploadImage();

    const updateChildDocument = async () => {
      try {
        await updateDoc(childDoc, {
          name,
          gender,
          birth_date: birthDate,
          picture: uploadedImageUrl,
        });
      } catch (error) {
        Alert.alert("Error creating child document:", error);
      }
    };

    updateChildDocument();
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

        {image ? (
          <>
            <Image source={{ uri: image }} className="w-40 h-40 mx-auto" />
            <TouchableOpacity
              onPress={() => setImage(null)}
              className="p-3 mb-3 rounded-2xl bg-red-500 w-30 mx-auto mt-2"
            >
              <Text className="text-center">Supprimer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            className="w-40 h-40 mx-auto bg-gray-400 justify-center"
            onPress={pickImage}
          >
            <Text className="text-white text-center">
              Télécharger une image
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-black w-full p-3 mb-3 rounded-2xl"
        >
          <Text className="text-white font-bold text-xl text-center">
            Mettre à jour
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
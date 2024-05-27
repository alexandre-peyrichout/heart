import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Button, IconButton, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import uuid from "react-native-uuid";

import AvatarPicker, { AVATARS } from "../components/AvatarPicker";
import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { db } from "../services/firebase";
type Props = NativeStackScreenProps<RootStackParamList, "EditChild">;

export default function EditChild({ navigation, route }: Props) {
  const { childId } = route.params;
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string>("male");
  const [birthDate, setBirthDate] = useState(new Date());
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [image, setImage] = useState(null);
  const [pictureMode, setPictureMode] = useState(null);
  const [child, setChild] = useState(null);
  const { loggedInUser } = useAuth();

  const childDoc = doc(db, `${loggedInUser.doc.path}/children/${childId}`);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const child = await getDoc(childDoc);
        setChild(child);
        const { name, gender, birth_date, avatar_id, picture, picture_mode } =
          child.data();
        setName(name);
        setGender(gender);
        setBirthDate(
          new Date(birth_date.seconds * 1000 + birth_date.nanoseconds / 1000000)
        );
        setPictureMode(picture_mode);
        setImage(picture);
        setAvatar(AVATARS.find((a) => a.id === avatar_id));
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    fetchChild();
  }, []);

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
      return await getDownloadURL(result.ref);
    } else {
      return child.data().picture;
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
  };

  const handleSubmit = async () => {
    if (!name || !birthDate || !gender)
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    // Upload the image to Firebase Storage
    const uploadedImageUrl = await uploadImage();

    const updateChildDocument = async () => {
      try {
        await updateDoc(childDoc, {
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
    await updateChildDocument();
    navigation.navigate("Home");
  };

  return (
    <View className="w-full h-full">
      <AvatarPicker
        image={image}
        avatar={avatar}
        pictureMode={pictureMode}
        setAvatar={setAvatar}
        setImage={setImage}
        setPictureMode={setPictureMode}
      />
      <View className="flex justify-center m-4">
        <View className="flex-row space-x-6 justify-center mb-2">
          <IconButton
            mode="contained"
            iconColor="blue"
            size={60}
            icon="human-male"
            onPress={() => setGender("male")}
            className={`bg-blue-100 ${gender === "male" && "border-2 border-blue-500"}`}
          />
          <IconButton
            mode="contained"
            iconColor="pink"
            size={60}
            icon="human-female"
            onPress={() => setGender("female")}
            className={`bg-pink-100 ${gender === "female" && "border-2 border-pink-500"}`}
          />
        </View>
        <TextInput
          mode="outlined"
          label="Prénom"
          placeholderTextColor={"gray"}
          value={name}
          onChangeText={handleNameChange}
        />
        <View className="h-24">
          <DatePickerInput
            locale="fr"
            label="Date de naissance"
            value={birthDate}
            onChange={setBirthDate}
            inputMode="end"
            mode="outlined"
          />
        </View>

        <Button mode="contained" onPress={handleSubmit} className="mb-4">
          Enregistrer
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          className="mb-4"
        >
          Annuler
        </Button>
      </View>
    </View>
  );
}

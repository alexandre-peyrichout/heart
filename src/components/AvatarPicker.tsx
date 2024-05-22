import React, { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

import * as ImagePicker from "expo-image-picker";

import ChildFemaleImage1 from "../assets/images/child_female_1.png";
import ChildFemaleImage2 from "../assets/images/child_female_2.png";
import ChildFemaleImage3 from "../assets/images/child_female_3.png";
import ChildMaleImage1 from "../assets/images/child_male_1.png";
import ChildMaleImage2 from "../assets/images/child_male_2.png";
import ChildMaleImage3 from "../assets/images/child_male_3.png";

export const AVATARS = [
  { id: "child_male_1", image: ChildMaleImage1 },
  { id: "child_female_1", image: ChildFemaleImage1 },
  { id: "child_male_2", image: ChildMaleImage2 },
  { id: "child_female_2", image: ChildFemaleImage2 },
  { id: "child_male_3", image: ChildMaleImage3 },
  { id: "child_female_3", image: ChildFemaleImage3 },
];

export default function AvatarPicker({ avatar, image, setAvatar, setImage }) {
  const [modalVisible, setModalVisible] = useState(false);

  const pickAvatar = (avatar) => {
    setAvatar(avatar);
    setModalVisible(false);
  };

  const pickImage = async () => {
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

  if (avatar || image) {
    return (
      <>
        <Image
          source={image ? { uri: image } : avatar?.image}
          resizeMode="contain"
          className="w-2/4 h-40 mx-auto"
        />
        <TouchableOpacity
          onPress={() => {
            setAvatar(null);
            setImage(null);
          }}
          className="p-3 mb-3 rounded-2xl bg-red-500 w-30 mx-auto mt-2"
        >
          <Text className="text-center">Supprimer</Text>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      <TouchableOpacity
        className="w-40 h-40 mx-auto bg-gray-400 justify-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center p-4">
          Choisir un avatar ou une photo de profil
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          className="flex justify-center items-center h-full bg-black/50"
        >
          <View className="flex-row flex-wrap bg-white rounded-2xl m-10 p-4">
            {AVATARS.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                className="w-1/2 mb-4"
                onPress={() => pickAvatar(avatar)}
              >
                <Image
                  source={avatar.image}
                  resizeMode="contain"
                  className="h-24 w-20 mx-auto"
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => pickImage()}
              className="w-full h-24 flex justify-center items-center p-2 mb-"
            >
              <Text className="text-black text-center">
                Télécharger une photo
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

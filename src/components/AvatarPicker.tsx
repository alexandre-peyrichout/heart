import React, { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
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

export default function AvatarPicker({
  avatar,
  image,
  pictureMode,
  setAvatar,
  setImage,
  setPictureMode,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [shownImage, setShownImage] = useState(null);

  const pickAvatar = (avatar) => {
    setAvatar(avatar);
    setPictureMode("avatar");
    setModalVisible(false);
  };

  const pickImage = () => {
    setImage(shownImage);
    setPictureMode("photo");
    setModalVisible(false);
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const manipulatedResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { height: 400 } }],
        { compress: 0.5, format: SaveFormat.JPEG }
      );
      setShownImage(manipulatedResult.uri);
    }
  };

  return (
    <>
      {avatar || image ? (
        <>
          <Image
            source={pictureMode === "photo" ? { uri: image } : avatar?.image}
            resizeMode="contain"
            className="w-2/4 h-40 mx-auto"
          />
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            className="p-3 mb-3 rounded-2xl bg-red-500 w-30 mx-auto mt-2"
          >
            <Text className="text-center">Changer</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          className="w-40 h-40 mx-auto bg-gray-400 justify-center"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center p-4">
            Choisir un avatar ou une photo de profil
          </Text>
        </TouchableOpacity>
      )}
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
            {AVATARS.map((avatarObj) => (
              <TouchableOpacity
                key={avatarObj.id}
                className={`rounded-xl w-1/2 mb-4 p-4 ${avatarObj.id === avatar?.id && pictureMode === "avatar" && "border-2"}`}
                onPress={() => pickAvatar(avatarObj)}
              >
                <Image
                  source={avatarObj.image}
                  resizeMode="contain"
                  className="h-24 w-20 mx-auto"
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => pickFromCamera()}
              className="w-1/2 h-24 flex justify-center items-center p-2"
            >
              <Text className="text-black text-center">
                Télécharger une photo
              </Text>
            </TouchableOpacity>
            {image || shownImage ? (
              <TouchableOpacity
                onPress={pickImage}
                className={`rounded-xl w-1/2 h-24 flex justify-center items-center p-4 ${pictureMode === "photo" && "border-2"}`}
              >
                <Image
                  source={{ uri: shownImage || image }}
                  resizeMode="contain"
                  className="h-24 w-20 mx-auto"
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

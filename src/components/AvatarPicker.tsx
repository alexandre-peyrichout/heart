import React, { useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";

import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Card, Icon, IconButton, Modal, Portal } from "react-native-paper";

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

const screenWidth = Dimensions.get("window")?.width;

export default function AvatarPicker({
  avatar,
  image,
  pictureMode,
  setAvatar,
  setImage,
  setPictureMode,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const pickAvatar = (avatar) => {
    setAvatar(avatar);
    setPictureMode("avatar");
    setModalVisible(false);
  };

  const pickImage = (image) => {
    setImage(image);
    setPictureMode("photo");
    setModalVisible(false);
  };

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const manipulatedResult = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { height: 400 } }],
        { compress: 0.5, format: SaveFormat.JPEG }
      );
      pickImage(manipulatedResult.uri);
    }
  };
  console.log(screenWidth);

  return (
    <>
      {avatar || image ? (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Image
            source={pictureMode === "photo" ? { uri: image } : avatar?.image}
            resizeMode="cover"
            style={{ height: screenWidth }}
            className={`w-full mx-auto`}
          />
          <IconButton
            mode="contained"
            icon="pencil"
            className="absolute top-0 right-0"
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="w-full mx-auto bg-gray-400 justify-center items-center"
          style={{ height: screenWidth }}
          onPress={() => setModalVisible(true)}
        >
          <Icon source="face-recognition" size={screenWidth / 2} />
          <IconButton
            mode="contained"
            icon="pencil"
            className="absolute top-0 right-0"
          />
        </TouchableOpacity>
      )}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="flex justify-center items-center h-full bg-black/50"
          >
            <View className="flex-row flex-wrap bg-white rounded-2xl m-10 justify-center pt-2 pb-2">
              {AVATARS.map((avatarObj) => (
                <Card
                  onPress={() => pickAvatar(avatarObj)}
                  mode={
                    avatarObj.id === avatar?.id && pictureMode === "avatar"
                      ? "outlined"
                      : "elevated"
                  }
                  key={avatarObj.id}
                  className="m-2"
                >
                  <Card.Cover
                    source={avatarObj.image}
                    resizeMode="contain"
                    style={{ width: screenWidth / 3, height: screenWidth / 3 }}
                  />
                </Card>
              ))}
              <Card onPress={pickFromCamera} mode="elevated" className="m-2">
                <Card.Content
                  className="flex justify-center items-center"
                  style={{ width: screenWidth / 3, height: screenWidth / 3 }}
                >
                  <Icon source="camera" size={80} />
                </Card.Content>
              </Card>

              {image ? (
                <Card
                  onPress={() => pickImage(image)}
                  mode={pictureMode === "photo" ? "outlined" : "elevated"}
                  className="m-2"
                >
                  <Card.Cover
                    source={{ uri: image }}
                    resizeMode="cover"
                    style={{ width: screenWidth / 3, height: screenWidth / 3 }}
                  />
                </Card>
              ) : null}
            </View>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </>
  );
}

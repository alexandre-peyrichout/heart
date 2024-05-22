import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { AVATARS } from "../components/AvatarPicker";
import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { auth } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [children, setChildren] = useState([]);
  const { loggedInUser } = useAuth();

  const handleLogOut = async () => {
    try {
      setIsLoading(true);
      await auth.signOut();
    } catch (error) {
      Alert.alert("Erreur", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const children = await getDocs(
          collection(loggedInUser.doc, `/children`)
        );
        setChildren(
          children.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    navigation.addListener("focus", fetchChildren);
  }, [auth.currentUser.uid]);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  const handleDeleteConfirmation = (id: string) => {
    const currentChild = children.find((child) => child.id === id);
    setSelectedChild(currentChild);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteChild = async () => {
    try {
      setIsLoading(true);
      await deleteDoc(doc(loggedInUser.doc, `/children/${selectedChild.id}`));
      setChildren(children.filter((child) => child.id !== selectedChild.id));
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  const getPictureOrAvatar = (child) => {
    if (child.picture) {
      return { uri: child.picture };
    }
    return AVATARS.find((avatar) => avatar.id === child.avatar_id)?.image;
  };

  return (
    <View className="bg-white w-full h-full flex justify-around">
      <View className="flex justify-center mx-4">
        {children.map((child, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("Sentence")}
            className="bg-gray-200 p-4 rounded-2xl my-2"
          >
            <Image
              source={getPictureOrAvatar(child)}
              resizeMode="contain"
              className="w-32 h-32 mx-auto"
            />
            <Text className="text-black text-lg mt-2 text-center">
              {child.name}
            </Text>
            <View className="absolute top-2 right-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditChild", { childId: child.id })
                }
              >
                <Text className="text-black mt-2 text-right">Éditer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteConfirmation(child.id)}
              >
                <Text className="text-black mt-2 text-right">Supprimer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          key="add"
          onPress={() => navigation.navigate("AddChild")}
          className="bg-black w-full p-3 rounded-2xl"
        >
          <Text className="text-white font-bold text-xl text-center">
            Ajouter mon enfant
          </Text>
        </TouchableOpacity>
      </View>
      <View className="mx-4">
        <TouchableOpacity
          className="bg-black w-full p-3 rounded-2xl"
          onPress={handleLogOut}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-xl text-center">
            Me déconnecter
          </Text>
        </TouchableOpacity>
      </View>
      {showDeleteConfirmation && (
        <View className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <View className="bg-white p-4 rounded-lg">
            <Text className="text-black text-lg mb-2">
              Êtes-vous sûre de vouloir supprimer {selectedChild.name} ?
            </Text>
            <View className="flex justify-center">
              <TouchableOpacity
                onPress={handleDeleteChild}
                className="bg-red-500 p-3 rounded-lg m-2"
              >
                <Text className="text-white">Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowDeleteConfirmation(false)}
                className="bg-gray-500 p-3 rounded-lg mx-2"
              >
                <Text className="text-white">Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

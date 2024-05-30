import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Badge,
  Button,
  Card,
  Dialog,
  IconButton,
  Menu,
  Portal,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { AVATARS } from "../components/AvatarPicker";
import { useAuth } from "../context/Auth";
import { RootStackParamList } from "../navigation/Stack";
import { auth } from "../services/firebase";

type Props = NativeStackScreenProps<RootStackParamList, "HomeTabs">;

export default function Home({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [children, setChildren] = useState([]);
  const { loggedInUser } = useAuth();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

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
    if (child.picture && child.picture_mode === "photo") {
      return { uri: child.picture };
    }

    return AVATARS.find((avatar) => avatar.id === child.avatar_id)?.image;
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView className="w-full h-full">
        <View className="flex justify-center mx-4">
          {children.map((child, index) => (
            <Card key={index} className="mt-4">
              <View className="flex-row items-start">
                <Card.Cover
                  source={getPictureOrAvatar(child)}
                  resizeMode="cover"
                  className="w-1/2"
                />
                <View className="w-1/2">
                  <Card.Title
                    title={child.name}
                    right={() => (
                      <ActionMenu
                        child={child}
                        navigation={navigation}
                        handleDeleteConfirmation={handleDeleteConfirmation}
                      />
                    )}
                  />
                  <View className="flex-row justify-center">
                    <View className="relative">
                      <IconButton
                        size={48}
                        icon="chat-processing"
                        mode="contained"
                        className="m-2 relative"
                        onPress={() => navigation.navigate("Sentence")}
                      />
                      <Badge className="absolute top-2 right-2">1</Badge>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
          ))}
          <Button
            className="mt-4"
            mode="contained"
            onPress={() => navigation.navigate("AddChild")}
          >
            Ajouter un enfant
          </Button>
        </View>
        <Portal>
          <Dialog
            visible={showDeleteConfirmation}
            onDismiss={() => setShowDeleteConfirmation(false)}
          >
            <Dialog.Icon icon="alert" />
            <Dialog.Title className="text-center">Confirmation</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Êtes-vous sûre de vouloir supprimer {selectedChild?.name}?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowDeleteConfirmation(false)}>
                Annuler
              </Button>
              <Button disabled={isLoading} onPress={handleDeleteChild}>
                Supprimer
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const ActionMenu = ({ child, navigation, handleDeleteConfirmation }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton icon="dots-vertical" onPress={() => setVisible(true)} />
      }
    >
      <Menu.Item
        onPress={() => {
          navigation.navigate("EditChild", { childId: child.id });
          setVisible(false);
        }}
        title="Éditer"
        leadingIcon="pencil"
      />
      <Menu.Item
        onPress={() => {
          handleDeleteConfirmation(child.id);
          setVisible(false);
        }}
        title="Supprimer"
        leadingIcon="delete"
      />
    </Menu>
  );
};

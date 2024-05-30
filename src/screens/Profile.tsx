import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Button,
  Dialog,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../context/Auth";
import { auth } from "../services/firebase";

export default function Profile() {
  const [gender, setGender] = useState<string>(null);
  const [firstname, setFirstname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
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
    const fetchUser = async () => {
      try {
        const user = await getDoc(loggedInUser.doc);
        setGender(user.data().gender);
        setFirstname(user.data().firstname);
        setEmail(user.data().email);
      } catch (error) {
        Alert.alert("Erreur", error.message);
      }
    };
    fetchUser();
  }, [loggedInUser]);

  const handleSubmit = async () => {
    if (!firstname || !gender)
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");

    const updateUserDocument = async () => {
      try {
        setIsLoading(true);
        await updateDoc(loggedInUser.doc, {
          firstname,
          gender,
        });
      } catch (error) {
        Alert.alert("Error updating child document:", error);
      } finally {
        setIsLoading(false);
      }
    };
    await updateUserDocument();
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await deleteDoc(loggedInUser.doc);
      await auth.currentUser.delete();
    } catch (error) {
      Alert.alert("Error deleting user", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView className="w-full h-full">
        <View className="flex justify-center m-4 space-y-4">
          <SegmentedButtons
            value={gender}
            onValueChange={setGender}
            buttons={[
              {
                icon: "human-male",
                value: "male",
                label: "Homme",
              },
              {
                icon: "human-female",
                value: "female",
                label: "Femme",
              },
            ]}
          />
          <TextInput
            className="mt-4"
            mode="outlined"
            label="Prénom"
            placeholderTextColor={"gray"}
            value={firstname}
            onChangeText={setFirstname}
          />
          <TextInput
            mode="outlined"
            label="Émail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            inputMode="email"
            disabled
          />
          <Button mode="contained" onPress={handleSubmit} disabled={isLoading}>
            Enregistrer
          </Button>
          <Button
            mode="outlined"
            onPress={() => setShowLogoutConfirmation(true)}
            disabled={isLoading}
          >
            Me déconnecter
          </Button>
          <Portal>
            <Dialog
              visible={showLogoutConfirmation}
              onDismiss={() => setShowLogoutConfirmation(false)}
            >
              <Dialog.Icon icon="alert" />
              <Dialog.Title className="text-center">Confirmation</Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium" className="text-center">
                  Êtes-vous sûre de vouloir vous déconnecter?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowLogoutConfirmation(false)}>
                  Annuler
                </Button>
                <Button disabled={isLoading} onPress={handleLogOut}>
                  Me déconnecter
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Button
            onPress={() => setShowDeleteConfirmation(true)}
            disabled={isLoading}
          >
            Supprimer mon compte
          </Button>
          <Portal>
            <Dialog
              visible={showDeleteConfirmation}
              onDismiss={() => setShowDeleteConfirmation(false)}
            >
              <Dialog.Icon icon="alert" />
              <Dialog.Title className="text-center">
                Suppression définitive du compte
              </Dialog.Title>
              <Dialog.Content>
                <Text variant="bodyMedium" className="text-center">
                  Êtes-vous sûre de vouloir supprimer votre compte ainsi que
                  l'ensemble des données associées?
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowDeleteConfirmation(false)}>
                  Annuler
                </Button>
                <Button disabled={isLoading} onPress={handleDeleteAccount}>
                  Supprimer définitivement
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

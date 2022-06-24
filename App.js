import Realm from "realm";
import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./navigator";
import { DBContext } from "./context";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const preload = async () => {
      const connection = await Realm.open({
        path: "myDiaryDB",
        schema: [FeelingSchema],
      });
      setRealm(connection);
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (err) {
        console.error(err);
      } finally {
        setIsReady(true);
      }
    };
    preload();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <DBContext.Provider value={realm}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </DBContext.Provider>
    </View>
  );
}

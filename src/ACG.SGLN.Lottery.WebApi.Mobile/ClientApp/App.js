/* eslint-disable prettier/prettier */

import React from 'react';
import {StatusBar, StyleSheet, useColorScheme, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {decode, encode} from 'base-64';
import SplashScreen from 'react-native-splash-screen';

import {SharedTheme} from './src/theme';
import RootStackNavigation from './src/navigation/RootNavigation';
import {createConnection} from './src/utils/DataBaseHelpers/CreateConnection';
import SqLite from 'react-native-sqlite-storage';

const db = createConnection();
const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  });

  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  if (!global.btoa) {
    global.btoa = encode;
  }

  if (!global.atob) {
    global.atob = decode;
  }

  let customTheme = SharedTheme;

  //ToDo if required theming

  // let customTheme = LightTheme;
  //let colorScheme = useColorScheme();
  //customTheme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: customTheme.colors.darkCerulean}}>
      <NavigationContainer theme={customTheme}>
        <StatusBar
          backgroundColor={customTheme.colors.darkCerulean}
          barStyle={'light-content'}
        />
        <RootStackNavigation />
        <Toast ref={ref => Toast.setRef(ref)} />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;

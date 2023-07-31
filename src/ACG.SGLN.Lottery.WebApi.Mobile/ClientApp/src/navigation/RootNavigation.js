/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DrawerNavigation from './DrawerNavigation';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/authentication/LoginScreen';
import ChangePassword from '../screens/authentication/ChangePassword';
import NewsConsultationList from '../screens/NewsConsultation/NewsConsultationList';
import AnnoucementsDetails from '../screens/NewsConsultation/AnnoucementsDetails';
import CreateRequestScreen from '../screens/requestModule/CreateRequestScreen';
import RequestListScreen from '../screens/requestModule/RequestListScreen';
import DetailsRequestScreen from '../screens/requestModule/DetailsRequestScreen';

const RootStackNavigation = props => {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  //Stack
  const Stack = createStackNavigator();

  useEffect(() => {
    CheckingNavigation();
  }, [isLogged]);

  useEffect(() => {}, [isLoader]);

  const CheckingNavigation = () => {
    AsyncStorage.getItem('bearerToken').then(value => {
      if (value !== null) {
        // console.log('Token :', value);
        setIsLogged(true);
        setIsLoader(true);
      } else {
        setIsLogged(false);
        setIsLoader(true);
      }
    });
  };

  return (
    <>
      {/* {isLoader && isLogged ? <DrawerNavigation /> : null} */}
      {isLoader && (
        <>
          <Stack.Navigator
            initialRouteName={isLogged ? 'DrawerNavigation' : 'LoginScreen'}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="DrawerNavigation"
              component={DrawerNavigation}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </>
      )}
    </>
  );
};

export default RootStackNavigation;

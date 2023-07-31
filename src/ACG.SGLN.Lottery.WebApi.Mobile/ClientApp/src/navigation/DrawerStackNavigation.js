/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import BottomNavigation from './BottomNavigation';
import DrawerNavigation from './DrawerNavigation';
import HomeScreen from '../screens/HomeScreen';
import CreateRequestScreen from '../screens/requestModule/CreateRequestScreen';
import RequestListScreen from '../screens/requestModule/RequestListScreen';
import NewsConsultationList from '../screens/NewsConsultation/NewsConsultationList';
import AnnoucementsDetails from '../screens/NewsConsultation/AnnoucementsDetails';
import YouTubeWebScreen from '../screens/TrainingModule/YouTubeWebScreen';
import {useTheme} from '@react-navigation/native';

const DrawerStackNavigation = props => {
  //Stack
  const Stack = createStackNavigator();
  const theme = useTheme();
  const styles = useStyle(theme);

  const headerLeftComp = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.toggleDrawer();
        }}>
        <Entypo name="menu" color={'white'} size={35} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Navigator initialRouteName={'RequestListScreen'}>
        {/* Request Module */}
        <Stack.Screen name="RequestListScreen" component={RequestListScreen} />
        <Stack.Screen
          name="CreateRequestScreen"
          component={CreateRequestScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerBackground,
            headerLeftContainerStyle: {
              marginLeft: 20,
            },
            headerLeft: headerLeftComp,
            headerTitle: 'CreateRequestScreen',
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={HomeScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerBackground,
            headerLeftContainerStyle: {
              marginLeft: 20,
            },
            headerLeft: headerLeftComp,
            headerTitle: '',
          }}
        />
        <Stack.Screen
          name="NewsConsultationList"
          component={NewsConsultationList}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerBackground,
            headerLeftContainerStyle: {
              marginLeft: 20,
            },
            headerLeft: headerLeftComp,
            headerTitle: 'Actualities ',
          }}
        />
        <Stack.Screen
          name="AnnoucementsDetails"
          component={AnnoucementsDetails}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerBackground,
            headerLeftContainerStyle: {
              marginLeft: 20,
            },
            headerLeft: headerLeftComp,
            headerTitle: 'Actualities ',
          }}
        />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        <Stack.Screen name="YouTubeWebScreen" component={YouTubeWebScreen} />
      </Stack.Navigator>
      {/* <BottomNavigation customProps={props} /> */}
    </>
  );
};

export default DrawerStackNavigation;
const useStyle = theme =>
  StyleSheet.create({
    headerBackground: {
      backgroundColor: theme.colors.darkCerulean,
    },
    headerTitleStyle: {
      color: theme.colors.primaryWhite,
    },
  });

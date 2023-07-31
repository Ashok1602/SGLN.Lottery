/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';

const HomeScreen = (props) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={()=>props.navigation.navigate('jjjj')}>
      <Text>Home Screen</Text>
      <IonIcons
        name="chevron-back-circle-sharp"
        color={theme.colors.iconColor}
        size={100}
      />
    </TouchableOpacity>
  );
};

export default HomeScreen;

const useStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryWhite,
    },
  });

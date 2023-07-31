/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FontistoIcons from 'react-native-vector-icons/Fontisto';

import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../styles/StyleConstant';
import {changeColor} from '../redux/bottomTab/changeColorOfTab-action';
import {CHANGE_COLOR_CONST} from '../redux/bottomTab/changeColor-constant';
import {
  InitializeNotifications,
  requestUserPermission,
} from '../utils/notificationHelper/NotificationListeners';

const BottomNavigation = props => {
  const [selectedTab, setSelectedTab] = useState(0);

  const theme = useTheme();
  const styles = useStyles(theme);
  //Dispatch
  const dispatch = useDispatch();

  //Selectors
  const SelectedIndex = useSelector(state => state.ChangeBottomTabColor);

  //UseState

  useEffect(() => {
    if (SelectedIndex) {
      setSelectedTab(SelectedIndex.tabSelectedIndex);
    }
  }, [selectedTab, SelectedIndex]);

  useEffect(() => {
    notificationInit();
  }, []);

  //initializing Notifications setup
  let token;
  const notificationInit = async () => {
    token = await requestUserPermission();
    console.debug('FCM Token  : ', token);
    InitializeNotifications(dispatch);
  };

  //Methods
  const HomeTapped = () => {
    props.customProps.navigation.navigate('RequestListScreen');
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 0));
  };

  const AddTapped = () => {
    // props.customProps.navigation.navigate('InvoiceScreen');
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 1));
  };

  const CreateRequestTapped = () => {
    props.customProps.navigation.navigate('RequestListScreen');
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 2));
  };

  const BookMarkTapped = () => {
    props.customProps.navigation.navigate('NewsConsultationList');
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 3));
  };

  const SettingsTapped = () => {
    props.customProps.navigation.navigate('SettingScreen', {data: token});
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 4));
  };

  return (
    <>
      <View style={styles.parentViewContainer}>
        <TouchableOpacity onPress={HomeTapped}>
          <FeatherIcons
            name="home"
            color={
              SelectedIndex.tabSelectedIndex === 0
                ? theme.colors.yellow
                : theme.colors.primaryBlack
            }
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={AddTapped}>
          <AntDesign
            name="carryout"
            color={
              SelectedIndex.tabSelectedIndex === 1
                ? theme.colors.yellow
                : theme.colors.primaryBlack
            }
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={CreateRequestTapped}>
          <AntDesign
            name="profile"
            color={
              SelectedIndex.tabSelectedIndex === 2
                ? theme.colors.yellow
                : theme.colors.primaryBlack
            }
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={BookMarkTapped}>
          <FontistoIcons
            name="bookmark"
            color={
              SelectedIndex.tabSelectedIndex === 3
                ? theme.colors.yellow
                : theme.colors.primaryBlack
            }
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={SettingsTapped}>
          <FeatherIcons
            name="settings"
            color={
              SelectedIndex.tabSelectedIndex === 4
                ? theme.colors.yellow
                : theme.colors.primaryBlack
            }
            size={25}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default BottomNavigation;

const useStyles = theme =>
  StyleSheet.create({
    drawerbackDropContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: '30%',
    },
    drawerTopHeader: {
      alignContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0)',
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.204,
      justifyContent: 'space-between',
      paddingHorizontal: '3%',
      paddingBottom: '1%',
    },
    drawerMainContainer: {
      flexDirection: 'row',
      height: '100%',
      width: '100%',
    },
    drawerLeftComp: {
      backgroundColor: theme.colors.primaryWhite,
      width: '75%',
    },
    parentViewContainer: {
      alignItems: 'stretch',
      backgroundColor: theme.colors.primaryWhite,
      bottom: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 15,
      position: 'absolute',
      width: '100%',
    },
  });

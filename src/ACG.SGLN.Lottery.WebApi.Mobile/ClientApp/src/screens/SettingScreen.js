import React, {useEffect, useState, useCallback} from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme, useFocusEffect} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Localization from '../localization/Localization';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../styles/StyleConstant';
import {showToast} from '../components/customs/Toast';
import Loader from '../components/customs/Loader';
import NetworkUtils from '../utils/NetInfoHelper/NetInfo';
import {requestUserPermission} from '../utils/notificationHelper/NotificationListeners';
import {SubscriptionApi} from '../services/Notification/SubscriptionApi';
import {UnSubscription} from '../services/Notification/UnSubscriptionApi';
import {CHANGE_COLOR_CONST} from '../redux/bottomTab/changeColor-constant';
import {changeColor} from '../redux/bottomTab/changeColorOfTab-action';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const SettingScreen = props => {
  const theme = useTheme();
  const styles = useStyle(theme);
  const dispatch = useDispatch();

  const activeColor = 'white';
  const inActiveColor = theme.colors.yellow;

  let token;
  const notificationInit = async () => {
    token = await requestUserPermission();
  };

  notificationInit();

  const [isToggle, setIsToggle] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [toggleActive, setToggle] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 4));
    }, []),
  );

  useEffect(() => {
    StartNotification();
  }, []);

  const StartNotification = async () => {
    var value = await AsyncStorage.getItem('settingNotification');
    if (value !== null) {
      if (value === 'ON') {
        setIsToggle(true);
      } else {
        setIsToggle(false);
      }
    } else {
      setIsToggle(true);
    }
  };

  const ToggleNotification = async () => {
    LayoutAnimation.easeInEaseOut();
    setToggle(!toggleActive);
    if (toggleActive) {
      setToggle(false);
      UnSubscriptionNFC();
    } else {
      setToggle(true);
      SubscriptionNFC();
    }
    let data = !toggleActive ? 'ON' : 'OFF';
    await AsyncStorage.setItem('settingNotification', data);
  };

  const SubscriptionNFC = async () => {
    if (NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisible(true);
      const res = await SubscriptionApi(token);
      if (res.isSuccess) {
        setIsLoaderVisible(false);
      } else {
        setIsLoaderVisible(false);
        Alert.alert(
          Localization.t('training.title'),
          Localization.t('training.noDocument'),
          [{text: Localization.t('common.ok')}],
        );
      }
    } else {
      showToast(
        Localization.t('createRequest.noInternet'),
        'bottom',
        'info',
        500,
      );
    }
  };

  const UnSubscriptionNFC = async () => {
    if (NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisible(true);
      const res = await UnSubscription(token);
      if (res.isSuccess) {
        setIsLoaderVisible(false);
      } else {
        setIsLoaderVisible(false);
        Alert.alert(
          Localization.t('training.title'),
          Localization.t('training.noDocument'),
          [{text: Localization.t('common.ok')}],
        );
      }
    } else {
      showToast(
        Localization.t('createRequest.noInternet'),
        'bottom',
        'info',
        500,
      );
    }
  };

  const handleChangePasswordNavigation = () => {
    props.navigation.navigate('ChangePassword');
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.imageContainer}>
      <View style={styles.listCardContainer}>
        <Text style={styles.notificationText}>
          {Localization.t('settingsScreen.notification')}
        </Text>
        <View style={{alignItems: 'flex-end', flex: 0.3, marginTop: 3}}>
          <TouchableOpacity
            style={[
              styles.toggleContainer,
              {
                borderColor: toggleActive ? activeColor : inActiveColor,
                backgroundColor: toggleActive
                  ? theme.colors.yellow
                  : theme.colors.primaryWhite,
              },
            ]}
            onPress={ToggleNotification}
            activeOpacity={1}>
            <View
              style={[
                styles.toggleBtn,
                toggleActive
                  ? {backgroundColor: activeColor, alignSelf: 'flex-end'}
                  : {backgroundColor: inActiveColor},
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.listCardContainer}
        onPress={handleChangePasswordNavigation}>
        <Text style={styles.notificationText}>Change Password</Text>
      </TouchableOpacity>
      <Modal
        visible={isLoaderVisible}
        transparent={true}
        statusBarTranslucent={true}>
        <Loader />
      </Modal>
    </ImageBackground>
  );
};

export default SettingScreen;

const useStyle = theme =>
  StyleSheet.create({
    imageContainer: {
      height: '100%',
      width: '100%',
    },
    listCardContainer: {
      flexDirection: 'row',
      padding: SCREEN_WIDTH * 0.048,
      borderBottomWidth: 0.3,
      borderColor: theme.colors.veryLightGrey,
      paddingBottom: SCREEN_HEIGHT * 0.015,
    },
    notificationText: {
      color: theme.colors.primaryWhite,
      flex: 0.7,
      fontFamily: FONTS.Montserrat_Medium,
      fontSize: RFValue(18, 812),
    },
    toggleContainer: {
      height: 25,
      width: 50,
      borderRadius: 20,
      borderWidth: 0.5,
      overflow: 'hidden',
    },
    toggleBtn: {height: '100%', width: '50%', borderRadius: 25},
  });

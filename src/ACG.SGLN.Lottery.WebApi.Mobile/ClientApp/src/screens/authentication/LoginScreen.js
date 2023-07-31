/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Loader from '../../components/customs/Loader';
import Localization from '../../localization/Localization';
import {SignIn} from '../../services/authentication/SignInApi';
import {ResourceApiMethod} from '../../services/resource/ResourceApi';
import {SCREEN_HEIGHT, SCREEN_WIDTH, FONTS} from '../../styles/StyleConstant';
import {RegularExpressions} from '../../utils/constants/constants';

const LoginScreen = props => {
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme();
  const styles = useStyles(theme);

  const LoginResponse = async () => {
    const data = {
      userName: userName,
      password: password,
    };
    const response = await SignIn(data);
    if (response.isSuccess) {
      await AsyncStorage.setItem('bearerToken', response.data.accessToken);
      AsyncStorage.removeItem('resource');
      const resource = await ResourceApiMethod();
      if (resource.isSuccess) {
        AsyncStorage.setItem('resource', JSON.stringify(resource.data));
      }
      setIsLoaderVisible(false);
      if (response.data.isTemporaryPassword) {
        props.navigation.navigate('ChangePassword', {data: password});
      } else {
        props.navigation.replace('DrawerNavigation', {
          data: true,
          accessToken: response.data.accessToken,
        });
      }
      setIsLoaderVisible(false);
    }
    if (!response.isSuccess) {
      Alert.alert(
        Localization.t('login.authenticationFailedTitle'),
        Localization.t('login.authenticationFailedDesc'),
        [{text: 'OK'}],
      );
      // setErrorMessage(response);
      setIsLoaderVisible(false);
    } else {
      setIsLoaderVisible(false);
    }
  };

  const LoggedIn = () => {
    const nameValue = userName.trim();
    const passwordValue = password.trim();
    let reg = RegularExpressions.PasswordValidation;
    if (nameValue.length <= 8) {
      setErrorMessage(Localization.t('common.invalidUserName'));
    } else if (reg.test(passwordValue) === false) {
      setErrorMessage(Localization.t('login.passwordRegMsg'));
    } else {
      setErrorMessage('');
      // setFormData({
      //   userName: 'retailer@sgln',
      //   password: 'ACG@sgln@2021',
      // });
      setIsLoaderVisible(true);
      LoginResponse();
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/backgroundImage.png')}
        style={styles.imageBContainer}>
        <ScrollView>
          <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            behavior="padding">
            <View style={styles.parentViewContainer}>
              <Image
                resizeMode="stretch"
                style={styles.imageContainer}
                source={require('../../assets/ic_login.png')}
              />
              <Text style={styles.titleContainer}>
                {Localization.t('login.title')}
              </Text>
              <Text style={styles.titleDescription}>
                {Localization.t('login.description')}
              </Text>
              <View style={styles.fistTIView}>
                <TextInput
                  value={userName}
                  onChangeText={text => {
                    setErrorMessage('');
                    setUserName(text);
                  }}
                  style={styles.firstTextInput}
                  placeholder={Localization.t('login.usernamePlaceHolder')}
                  placeholderTextColor={theme.colors.licorice}
                />
              </View>
              <View style={styles.secondTextView}>
                <TextInput
                  value={password}
                  secureTextEntry={true}
                  onChangeText={text => {
                    setErrorMessage('');
                    setPassword(text);
                  }}
                  style={styles.secondTextInput}
                  placeholder={Localization.t('login.passwordPlaceHolder')}
                  placeholderTextColor={theme.colors.licorice}
                />
              </View>
              <Text style={styles.forgotPasswordText}>
                {Localization.t('login.forgotPassword')}
              </Text>
              <Text
                style={{
                  color: theme.colors.primaryWhite,
                  fontFamily: FONTS.Montserrat_Regular,
                  fontSize: RFValue(15, 731),
                  textAlign: 'center',
                  marginBottom:10
                }}>
                {errorMessage}
              </Text>
              <TouchableOpacity
                onPress={LoggedIn}
                style={styles.touchableButton}>
                <Text style={styles.buttonText}>
                  {Localization.t('login.buttonText')}
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType={'fade'}
              statusBarTranslucent={true}
              transparent={true}
              visible={isLoaderVisible}>
              <Loader />
            </Modal>
          </KeyboardAwareScrollView>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default LoginScreen;

const useStyles = theme =>
  StyleSheet.create({
    buttonText: {
      color: theme.colors.darkCerulean,
      fontFamily: FONTS.Montserrat_Bold,
      fontSize: RFValue(18, 731),
      textAlign: 'center',
    },
    fistTIView: {
      backgroundColor: theme.colors.primaryWhite,
      padding: 0,
      width: '100%',
    },
    forgotPasswordText: {
      alignSelf: 'flex-end',
      color: theme.colors.spindle,
      fontFamily: FONTS.Montserrat_Regular,
      marginTop: SCREEN_HEIGHT * 0.018,
      marginBottom: SCREEN_HEIGHT * 0.04,
    },
    imageBContainer: {flex: 1},
    imageContainer: {height: SCREEN_HEIGHT * 0.07, width: '100%'},
    firstTextInput: {
      paddingHorizontal: SCREEN_WIDTH * 0.046,
      backgroundColor: theme.colors.primaryWhite,
      paddingVertical:
        Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.028 : SCREEN_HEIGHT * 0.028,
      textAlignVertical: 'top',
      color: theme.colors.primaryBlack,
      fontFamily: FONTS.Montserrat_Medium,
      fontSize: RFValue(15, 731),
    },
    parentViewContainer: {
      paddingHorizontal: SCREEN_WIDTH * 0.048,
      paddingTop: SCREEN_HEIGHT * 0.0615,
      paddingBottom: SCREEN_HEIGHT * 0.121,
    },
    secondTextView: {
      backgroundColor: theme.colors.primaryWhite,
      marginTop: SCREEN_HEIGHT * 0.06,
      padding: 0,
      width: '100%',
    },
    secondTextInput: {
      color: theme.colors.primaryBlack,
      fontFamily: FONTS.Montserrat_Medium,
      backgroundColor: theme.colors.primaryWhite,
      paddingHorizontal: SCREEN_WIDTH * 0.046,
      paddingVertical:
        Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.028 : SCREEN_HEIGHT * 0.028,
      textAlignVertical: 'top',
      fontSize: RFValue(15, 731),
    },
    titleContainer: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontFamily: 'bold',
      fontSize: RFValue(24, 731),
      fontFamily: FONTS.Montserrat_SemiBold,
      marginTop: SCREEN_HEIGHT * 0.09,
    },
    titleDescription: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(15, 731),
      textAlign: 'center',
      marginTop: SCREEN_HEIGHT * 0.008,
      marginBottom: SCREEN_HEIGHT * 0.04,
    },
    titleView: {
      marginTop: SCREEN_HEIGHT * 0.09,
      fontSize: RFValue(24, 812),
    },
    touchableButton: {
      backgroundColor: theme.colors.yellow,
      paddingVertical:
        Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.028 : SCREEN_HEIGHT * 0.028,
      marginBottom: SCREEN_HEIGHT * 0.109,
      width: '100%',
    },
  });

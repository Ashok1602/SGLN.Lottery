/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../../components/customs/Loader';
import Localization from '../../localization/Localization';
import {ChangePasswordApi} from '../../services/authentication/ChangePassword';
import {AXIOS_INSTANCE} from '../../services/serviceHelper/Config';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import {RegularExpressions} from '../../utils/constants/constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ChangePassword = props => {
  let loginPassword =
    props.route.params != undefined ? props.route.params.data : '';
  //Use states
  const [currentPassword, setCurrentPassword] = useState(loginPassword);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [isReadyToSubmit, setisReadyToSubmit] = useState(false);

  //Selector
  const theme = useTheme();
  const styles = useStyles(theme);

  //Methods

  const ChangePasswordClicked = async () => {
    let reg = RegularExpressions.PasswordValidation;
    if (reg.test(newPassword) === false) {
      setErrorMessage(Localization.t('changePassword.passwordRegMsg'));
    } else {
      const data = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      const response = await ChangePasswordApi(data);
      if (response.isSuccess) {
        setIsLoaderVisible(false);
        Alert.alert(
          Localization.t('createRequest.alertCreateTitle'),
          Localization.t('createRequest.alertSuccessMessage'),
          [
            {
              text: Localization.t('common.ok'),
              onPress: () => props.navigation.pop(1),
            },
          ],
        );
      } else {
        alert(Localization.t('common.defaultMessage'));

        setIsLoaderVisible(false);
      }
    }
  };

  const handleValidation = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Password does not match');
    }
    if (
      newPassword !== '' &&
      confirmPassword !== '' &&
      newPassword === confirmPassword
    ) {
      if (newPassword !== currentPassword) {
        setisReadyToSubmit(true);
      } else {
        setErrorMessage('New Password must be different from last password');
      }
    }
  };

  const validatePassword = () => {
    const passwordValue = newPassword;
    let reg = RegularExpressions.PasswordValidation;
    if (reg.test(passwordValue) === false) {
      setErrorMessage(Localization.t('login.passwordRegMsg'));
    }
    if (newPassword === currentPassword) {
      setErrorMessage('New Password must be different from last password');
    }
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/background.png')}
        style={styles.mainContainer}>
        <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{justifyContent: 'center'}}
          enableAutomaticScroll={true}
          behavior="padding">
          <Image
            resizeMode="cover"
            style={styles.imageContainer}
            source={require('../../assets/ic_login.png')}
          />
          <Text style={styles.titleText}>
            {Localization.t('changePassword.title')}
          </Text>
          <View>
            <TextInput
              selectionColor={theme.colors.yellow}
              value={currentPassword}
              onChangeText={text => {
                setErrorMessage('');
                setisReadyToSubmit(false);
                setCurrentPassword(text);
              }}
              style={styles.firstTextInput}
              placeholder={Localization.t('changePassword.currentPlaceHolder')}
              placeholderTextColor={theme.colors.primaryBlack}
            />
            <TextInput
              secureTextEntry={true}
              selectionColor={theme.colors.yellow}
              value={newPassword}
              onChangeText={text => {
                setErrorMessage('');
                setisReadyToSubmit(false);
                setNewPassword(text);
              }}
              style={styles.firstTextInput}
              placeholder={Localization.t('changePassword.newPlaceHolder')}
              placeholderTextColor={theme.colors.primaryBlack}
              onEndEditing={text => validatePassword(text)}
            />
            <TextInput
              secureTextEntry={true}
              selectionColor={theme.colors.yellow}
              value={confirmPassword}
              onChangeText={text => {
                setErrorMessage('');
                setisReadyToSubmit(false);
                setconfirmPassword(text);
              }}
              style={styles.firstTextInput}
              placeholder={Localization.t('changePassword.confirmPassword')}
              placeholderTextColor={theme.colors.primaryBlack}
              onEndEditing={handleValidation}
            />
            <Text style={styles.errorMessageText}>{errorMessage}</Text>
            <TouchableOpacity
              disabled={!isReadyToSubmit}
              onPress={ChangePasswordClicked}
              style={[
                styles.buttonView,
                {
                  backgroundColor: isReadyToSubmit
                    ? theme.colors.yellow
                    : 'rgba(255,200,10,0.5)',
                },
              ]}>
              <Text numberOfLines={1} style={styles.buttonTextContainer}>
                {Localization.t('changePassword.buttonText')}
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
      </ImageBackground>
    </>
  );
};

export default ChangePassword;

const useStyles = theme =>
  StyleSheet.create({
    buttonTextContainer: {
      alignSelf: 'center',
      color: theme.colors.darkCerulean,
      justifyContent: 'center',
    },
    buttonView: {
      backgroundColor: theme.colors.yellow,
      justifyContent: 'center',
      height: 50,
      margin: 20,
      marginBottom: 70,
    },
    errorMessageText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(15, 731),
      textAlign: 'center',
    },
    firstTextInput: {
      backgroundColor: theme.colors.primaryWhite,
      paddingHorizontal: SCREEN_WIDTH * 0.03,
      paddingVertical: SCREEN_WIDTH * 0.03,
      // textAlignVertical: 'top',
      height: SCREEN_HEIGHT * 0.08,
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(15, 731),
      marginVertical: SCREEN_HEIGHT * 0.01,
    },
    imageContainer: {
      height: SCREEN_HEIGHT * 0.07,
      width: '100%',
      marginBottom: '15%',
      marginTop: '6%',
    },
    mainContainer: {
      backgroundColor: theme.colors.darkCerulean,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    secondTextInput: {
      marginTop: 20,
      paddingHorizontal: SCREEN_WIDTH * 0.01,
      backgroundColor: theme.colors.primaryWhite,
      paddingVertical:
        Platform.OS === 'ios' ? SCREEN_WIDTH * 0.03 : SCREEN_WIDTH * 0.03,
      textAlignVertical: 'top',
    },
    titleText: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(24, 812),
      justifyContent: 'center',
      fontFamily: FONTS.Montserrat_SemiBold,
      marginBottom: 20,
    },
  });

import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import {showToast} from '../../components/customs/Toast';
import TestComplete from '../../assets/TestComplete.svg';
import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT} from '../../styles/StyleConstant';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {submitTest} from '../../services/training/SubmitTest';
import Loader from '../../components/customs/Loader';

const TestCompleteScreen = props => {
  const theme = useTheme();
  const styles = useStyle(theme);

  const [answerList] = useState(Object.values(props.answerList));
  const [isLoaderVisible, setisLoaderVisible] = useState(false);

  const handleSubmit = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      setisLoaderVisible(true);
      const res = await submitTest(props.trainingID, answerList);
      if (res.isSuccess) {
        setisLoaderVisible(false);
        if (Number(res.data.scoreRate) >= 50) {
          props.customProps.navigation.replace('TestSuccessScreen', {
            testRes: res.data,
          });
        } else {
          props.customProps.navigation.replace('TestFailedScreen', {
            testRes: res.data,
            id: props.trainingID,
          });
        }
      } else {
        setisLoaderVisible(false);
        showToast(
          Localization.t('common.defaultMessage'),
          'bottom',
          'error',
          1000,
        );
      }
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundImage.png')}
      style={{width: '100%', height: '100%'}}>
      <View style={styles.mainContainer}>
        <Text style={styles.headerTitle}>
          {Localization.t('training.trainingTitle')}
        </Text>
        <Text style={styles.belowTitle}>
          {Localization.t('training.traingingSubTitle')}
        </Text>
      </View>
      <View style={styles.secondContainer}>
        <Text style={styles.faciText}>
          {Localization.t('testCompleteScreen.youHaveCompletedTest')}
        </Text>
        <Text style={styles.subHeadingText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <TestComplete />
        <Text style={styles.belowMsgText}></Text>
        <View style={styles.btnsContainer}>
          <TouchableOpacity style={styles.commensBtn} onPress={handleSubmit}>
            <Text style={styles.commensText}>
              {Localization.t('testCompleteScreen.sendAnswer')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.isVisible(false);
              props.changeCurrentIdex(0);
            }}
            style={styles.returBtnConttainer}>
            <Text style={styles.returnBtnText}>
              {Localization.t('testCompleteScreen.return')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isLoaderVisible}
        transparent={true}
        statusBarTranslucent={true}>
        <Loader />
      </Modal>
    </ImageBackground>
  );
};

export default TestCompleteScreen;

const useStyle = theme =>
  StyleSheet.create({
    btnsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: SCREEN_HEIGHT * 0.034,
      opacity: 0.5,
    },
    belowMsgText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(18, 830),
      marginTop: SCREEN_HEIGHT * 0.036,
      marginBottom: SCREEN_HEIGHT * 0.048,
      textAlign: 'center',
    },
    commensBtn: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      justifyContent: 'center',
      marginRight: '2%',
      paddingVertical: SCREEN_HEIGHT * 0.016,
      paddingHorizontal: 8,
      width: '48%',
    },
    commensText: {
      color: theme.colors.lightCobalt,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(16, 830),
    },
    faciText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(18, 830),
      marginBottom: SCREEN_HEIGHT * 0.009,
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
    },
    mainContainer: {
      paddingHorizontal: SCREEN_HEIGHT * 0.01,
      marginTop: SCREEN_HEIGHT * 0.02,
    },
    returBtnConttainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.cobalt,
      justifyContent: 'center',
      paddingVertical: SCREEN_HEIGHT * 0.016,
      paddingHorizontal: 8,
      width: '48%',
    },
    returnBtnText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_Bold,
      fontSize: RFValue(16, 830),
    },
    secondContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      flex: 1,
      marginTop: 20,
      width: '90%',
    },
    subHeadingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(14, 830),
      marginBottom: SCREEN_HEIGHT * 0.072,
    },
  });

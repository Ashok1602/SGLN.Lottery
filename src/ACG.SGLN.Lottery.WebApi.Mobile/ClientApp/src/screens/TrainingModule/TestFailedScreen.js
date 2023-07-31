import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

import TestFailed from '../../assets/TestFailed.svg';
import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT} from '../../styles/StyleConstant';
import Loader from '../../components/customs/Loader';

const TestFailedScreen = props => {
  const theme = useTheme();
  const styles = useStyle(theme);

  const [isLoaderVisible, setisLoaderVisible] = useState(false);

  const handleReTraining = () => {
    props.navigation.replace('TrainingSlideScreen', {
      data: {
        id: props.route.params.id,
      },
    });
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
          {Localization.t('resultScreen.sorry')}
        </Text>
        <Text style={styles.subHeadingText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <TestFailed />
        <Text style={[styles.scoreText]}>
          Score: {props.route.params.testRes.scoreRate}%
        </Text>
        <Text style={[styles.belowMsgText, {marginTop: 10}]}>
          {Localization.t('resultScreen.wantToGiveTestAgain')}
        </Text>
        <View style={styles.btnsContainer}>
          <TouchableOpacity
            style={styles.commensBtn}
            onPress={handleReTraining}>
            <Text style={styles.commensText}>
              {Localization.t('testCompleteScreen.recommencer')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.pop()}
            style={styles.returBtnConttainer}>
            <Text style={styles.returnBtnText}>
              {Localization.t('createRequest.delete')}
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

export default TestFailedScreen;

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
      marginRight: '2%',
      justifyContent: 'center',
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
    secondContainer: {
      alignItems: 'center',
      alignSelf: 'center',
      flex: 1,
      marginTop: 20,
      width: '90%',
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
    subHeadingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(14, 830),
      marginBottom: SCREEN_HEIGHT * 0.072,
    },
    scoreText: {
      color: theme.colors.yellow,
      fontFamily: FONTS.OpenSans_SemiBold,
      fontSize: RFValue(18, 830),
      marginBottom: 10,
      marginTop: SCREEN_HEIGHT * 0.036,
    },
  });

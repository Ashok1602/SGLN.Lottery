import {useTheme} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {showToast} from '../../components/customs/Toast';
import Bulb from '../../assets/Bulb.svg';
import Localization from '../../localization/Localization';
import {FinishTraining} from '../../services/training/FinishTraining';
import {FONTS, SCREEN_HEIGHT} from '../../styles/StyleConstant';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';

const TrainingCompleteScreen = props => {
  const theme = useTheme();
  const styles = useStyle(theme);

  useEffect(() => {
    callCompleteAPI();
  }, []);

  const callCompleteAPI = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      const res = await FinishTraining(props.id);
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const handleNavigateToTest = () => {
    props.customProps.navigation.replace('QuestionsListScreen', {
      id: props.id,
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
          {Localization.t('trainingCompleteScreen.felicitations')}
        </Text>
        <Text style={styles.subHeadingText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <Bulb />
        <Text style={styles.belowMsgText}>
          {Localization.t('trainingCompleteScreen.completedTrainingMsg')}
        </Text>
        <View style={styles.btnsContainer}>
          <TouchableOpacity
            style={styles.commensBtn}
            onPress={handleNavigateToTest}>
            <Text style={styles.commensText}>
              {Localization.t('trainingCompleteScreen.gotoTest')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.isVisible(false)}
            style={styles.returBtnConttainer}>
            <Text style={styles.returnBtnText}>
              {Localization.t('trainingCompleteScreen.return')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default TrainingCompleteScreen;

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
      marginTop: SCREEN_HEIGHT * 0.036,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(18, 830),
      color: theme.colors.primaryWhite,
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
  });

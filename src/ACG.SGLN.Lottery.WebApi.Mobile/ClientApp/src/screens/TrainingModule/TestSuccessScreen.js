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
import TestSuccess from '../../assets/TestSuccess.svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import Loader from '../../components/customs/Loader';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {DownloadFile} from '../../utils/commonHelper/DownloadingHelper';
import {ImageURL} from '../../services/serviceHelper/ServiceUtilites';

const TestSuccessScreen = props => {
  const theme = useTheme();
  const styles = useStyle(theme);

  const [isLoaderVisible, setisLoaderVisible] = useState(false);

  const handleDownloadCertificate = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      DownloadFile(
        `${ImageURL}${props.route.params.testRes.documentType}${'/'}${
          props.route.params.testRes.documentId
        }`,
        'SGLN Training Certificate',
        'application/pdf',
      );
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
          {Localization.t('resultScreen.sorry')}
        </Text>
        <Text style={styles.subHeadingText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
        <TestSuccess />
        <Text style={[styles.scoreText]}>
          Score: {props.route.params.testRes.scoreRate}%
        </Text>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={handleDownloadCertificate}>
          <Ionicons
            name="document"
            color={theme.colors.yellow}
            size={SCREEN_WIDTH * 0.09}
            style={{marginRight: SCREEN_WIDTH * 0.029}}
          />
          <Text style={[styles.belowMsgText, {marginTop: 10}]}>
            {Localization.t('resultScreen.downloadCertificate')}
          </Text>
        </TouchableOpacity>
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

export default TestSuccessScreen;

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
      marginTop: SCREEN_HEIGHT * 0.036,
      marginBottom: 10,
    },
  });

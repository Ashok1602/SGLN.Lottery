/* eslint-disable prettier/prettier */
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';

import Localization from '../localization/Localization';
import {SCREEN_HEIGHT, FONTS} from '../styles/StyleConstant';

const LegalConsultationScreen = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={{
        width: '100%',
        height: '100%',
      }}>
      <View style={styles.mainContainer}>
        <Text numberOfLines={2} style={styles.headerTitle}>
          {Localization.t('documents.legalNotice')}
        </Text>
        {/* <Text numberOfLines={1} style={styles.belowTitle}>
          {Localization.t('documents.docSubTitle')}
        </Text> */}
        {/* Formation section */}
        <ScrollView style={{marginBottom: SCREEN_HEIGHT * 0.1}}>
          <Text style={styles.descriptionText}>
            {Localization.t('documents.legalNoticeDescription')}
          </Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default LegalConsultationScreen;

const useStyles = theme =>
  StyleSheet.create({
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: 30,
      opacity: 0.5,
    },
    descriptionText: {
      fontSize: RFValue(15, 812),
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_Medium,
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
      marginTop: SCREEN_HEIGHT * 0.02,
      marginBottom: 30,
      textAlign: 'center',
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: SCREEN_HEIGHT * 0.028,
    },
  });

import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT} from '../../styles/StyleConstant';

const AmountCategoryComp = props => {
  const theme = useTheme();
  const styles = useStyle(theme);
  return (
    <TouchableOpacity
      disabled={true}
      style={[
        styles.headerCardStyle,
        {
          backgroundColor: props.bgcColor,
        },
      ]}>
      <Text style={styles.headerCardText}>{props.headingMsg}</Text>
      <Text style={styles.amountText}>
        {Localization.toNumber(props.amnt, {
          strip_insignificant_zeros: true,
        })}{' '}
        {Localization.t('common.dh')}
      </Text>
    </TouchableOpacity>
  );
};

export default AmountCategoryComp;

const useStyle = theme =>
  StyleSheet.create({
    amountText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(18, 830),
      marginTop: SCREEN_HEIGHT * 0.018,
    },
    headerCardStyle: {
      alignItems: 'center',
      backgroundColor: theme.colors.primaryWhite,
      minHeight: SCREEN_HEIGHT * 0.139,
      width: '48%',
      paddingHorizontal: 4,
      paddingTop: SCREEN_HEIGHT * 0.013,
    },
    headerCardText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(12, 830),
      textAlign: 'left',
    },
  });

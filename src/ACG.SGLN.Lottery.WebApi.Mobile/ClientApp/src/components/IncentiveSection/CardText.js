import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';

import {FONTS} from '../../styles/StyleConstant';

const CardText = props => {
  const theme = useTheme();
  const styles = useStyle(theme);
  return (
    <View style={{paddingHorizontal: 3, marginBottom: 8}}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.subTitle}>{props.subTitle}</Text>
    </View>
  );
};

export default CardText;

const useStyle = theme =>
  StyleSheet.create({
    title: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(12, 830),
    },
    subTitle: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(12, 830),
    },
  });

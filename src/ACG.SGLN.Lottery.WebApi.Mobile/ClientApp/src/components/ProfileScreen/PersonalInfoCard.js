import {useTheme} from '@react-navigation/native';
import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {FONTS, SCREEN_HEIGHT} from '../../styles/StyleConstant';
import Address from '../../assets/address.svg';

const PersonalInfoCard = props => {
  const theme = useTheme();
  const styles = useStyle(theme);

  const handleOpenMaps = () => {
    if (props.lat && props.long) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${props.lat},${props.long}`;
      const label = props.address ? props.address : 'Location';
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <View style={{maxWidth: '80%'}}>
          <Text style={styles.titleText}>{props.title}</Text>
          <Text style={styles.subTitleTex}>{props.subTitle}</Text>
        </View>
        <TouchableOpacity
          onPress={handleOpenMaps}
          style={{display: props.isAddress ? 'flex' : 'none'}}>
          <Address />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PersonalInfoCard;

const useStyle = theme =>
  StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      borderBottomWidth: 0.3,
      borderColor: theme.colors.lightChoco,
      justifyContent: 'center',
      minHeight: SCREEN_HEIGHT * 0.085,
    },
    subTitleTex: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.OpenSans_SemiBold,
      fontSize: RFValue(14, 830),
      textTransform: 'uppercase',
    },
    titleText: {
      color: theme.colors.veryLightGrey,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(14, 830),
      textTransform: 'uppercase',
      marginBottom: SCREEN_HEIGHT * 0.006,
    },
    subContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '79%',
    },
  });

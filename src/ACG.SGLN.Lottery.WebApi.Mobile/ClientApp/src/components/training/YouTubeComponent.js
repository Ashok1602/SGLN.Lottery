/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';

import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';

const YouTubeComponent = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  let date =
    props.data != undefined
      ? `${Localization.t('training.posted')}${moment(
          new Date(props.data.created),
        ).format('DD/MM/YYYY')}`
      : '';

  const WebViewNavigation = () => {
    if (props.data.courseURI) {
      props.customProps.navigation.navigate('YouTubeWebScreen', {
        data: props.data.courseURI,
      });
    } else {
      Alert.alert(
        Localization.t('createRequest.alertCreateTitle'),
        Localization.t('common.defaultMessage'),
        [{text: 'OK'}],
      );
    }
  };

  return (
    <TouchableOpacity onPress={WebViewNavigation}>
      <View style={styles.parentView}>
        <Image
          style={{height: '100%', width: SCREEN_HEIGHT * 0.049}}
          source={require('../../assets/film.png')}
        />
        <Text style={styles.titleContainer}>
          {props.data != undefined ? props.data.title : ''}
        </Text>
        <View style={styles.dateView}>
          <Text numberOfLines={1} style={styles.dateText}>
            {date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default YouTubeComponent;

const useStyles = theme =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    dateView: {
      alignItems: 'flex-end',
      flex: 1,
      justifyContent: 'center',
    },
    dateText: {
      alignItems: 'flex-end',
      color: theme.colors.licorice,
      fontSize: RFValue(13, 812),
      fontFamily: FONTS.OpenSans_Regular,
      textAlignVertical: 'center',
    },
    parentView: {
      backgroundColor: theme.colors.primaryWhite,
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.09,
      padding: SCREEN_HEIGHT * 0.018,
      marginBottom: SCREEN_HEIGHT * 0.019,
    },
    threeAboveSectionTouch: {
      flex: 1,
      height: SCREEN_WIDTH * 0.29,
      marginRight: SCREEN_WIDTH * 0.02,
      paddingVertical: 10,
      width: SCREEN_WIDTH * 0.29,
    },
    titleContainer: {
      color: theme.colors.licorice,
      fontSize: RFValue(16, 812),
      fontFamily: FONTS.OpenSans_SemiBold,
      flex: 0.6,
      marginLeft: 5,
      textAlignVertical: 'center',
    },
  });

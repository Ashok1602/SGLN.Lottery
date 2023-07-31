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

const DistanceYoutubeComponent = props => {
  //console.log(props);
  const theme = useTheme();
  const styles = useStyles(theme);

  let date =
    props.data != undefined
      ? moment(new Date(props.data.startDate)).format('DD/MM/YYYY')
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
        [{text: Localization.t('common.ok')}],
      );
    }
  };

  return (
    <TouchableOpacity onPress={WebViewNavigation}>
      <View style={styles.parentView}>
        <Image
          style={{
            height: '100%',
            width: SCREEN_HEIGHT * 0.049,
          }}
          source={require('../../assets/film.png')}
        />
        <View style={{marginLeft: SCREEN_WIDTH * 0.034, flex: 1}}>
          <Text numberOfLines={1} style={styles.title}>
            {props.data.title}
          </Text>
          <View style={styles.typeView}>
            <Text
              style={{
                color: theme.colors.primaryWhite,
                fontSize: RFValue(12, 812),
                fontFamily: FONTS.OpenSans_Regular,
                textAlignVertical: 'center',
              }}>
              {props.data.type}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.dateText}>
            {`${Localization.t('training.trainingDate')}${'\n'}${Localization.t(
              'training.from',
            )}${date}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DistanceYoutubeComponent;

const useStyles = theme =>
  StyleSheet.create({
    dateText: {
      alignItems: 'flex-end',
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(14, 812),
      paddingRight: SCREEN_WIDTH * 0.036,
      textAlignVertical: 'center',
    },
    mainContainer: {
      flex: 1,
    },
    parentView: {
      backgroundColor: theme.colors.primaryWhite,
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.09,
      marginBottom: SCREEN_HEIGHT * 0.019,
      padding: SCREEN_HEIGHT * 0.014,
      paddingRight: 0,
    },
    threeAboveSectionTouch: {
      flex: 1,
      height: SCREEN_WIDTH * 0.29,
      marginRight: SCREEN_WIDTH * 0.02,
      paddingVertical: 10,
      width: SCREEN_WIDTH * 0.29,
    },
    title: {
      color: theme.colors.licorice,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.OpenSans_SemiBold,
    },
    typeView: {
      backgroundColor: theme.colors.vividGreen,
      justifyContent: 'center',
      height: SCREEN_HEIGHT * 0.027,
      paddingHorizontal: SCREEN_WIDTH * 0.024,
      width: SCREEN_WIDTH * 0.27,
    },
  });

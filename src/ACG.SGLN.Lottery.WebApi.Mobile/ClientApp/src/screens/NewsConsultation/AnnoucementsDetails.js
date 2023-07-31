/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';

import {getAnnoucementsDetails} from '../../services/newsConsultation/GetNewsDetails';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import {ImageURL} from '../../services/serviceHelper/ServiceUtilites';

const AnnoucementsDetails = props => {
  const [data, setData] = useState({
    date: '',
    desc: '',
    imageUri: '',
    title: '',
  });

  const theme = useTheme();
  const styles = useStyle(theme);

  useFocusEffect(
    useCallback(() => {
      callAPI();
    }, []),
  );

  const callAPI = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      const response = await getAnnoucementsDetails(props.route.params.data.id);
      if (response.isSuccess) {
        setData(prevState => ({
          ...prevState,
          date: response.data.created,
          desc: response.data.body,
          title: response.data.title,
        }));
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundImage.png')}
      style={{width: '100%', height: '100%'}}>
      <View style={styles.rootContainer}>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          bouncesZoom={false}
          contentContainerStyle={styles.mainContainer}
          style={{flex: 1}}>
          <View style={[styles.subContainer]}>
            <Image
              source={{
                uri: `${ImageURL}AnnouncementCoverPicture/${props.route.params.data.id}`,
              }}
              style={styles.imageStyle}
            />
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>{data.title}</Text>
              <Text style={styles.dateText}>
                Le {moment(data.date).format('L')}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.descText}>{data.desc}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default AnnoucementsDetails;

const useStyle = theme =>
  StyleSheet.create({
    dateText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(14, 812),
      fontFamily: FONTS.Montserrat_Italic,
      textAlign: 'justify',
    },
    descText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(17, 812),
      fontFamily: FONTS.OpenSans_Regular,
      textAlign: 'justify',
    },
    imageStyle: {
      height: SCREEN_HEIGHT * 0.2,
      marginTop: SCREEN_HEIGHT * 0.01,
      width: '100%',
    },
    mainContainer: {
      alignItems: 'center',
      // backgroundColor: theme.colors.darkCerulean,
    },
    rootContainer: {
      // backgroundColor: theme.colors.darkCerulean,
      flex: 1,
      height: '100%',
    },
    subContainer: {
      alignItems: 'center',
      paddingHorizontal: SCREEN_WIDTH * 0.048,
      width: '100%',
    },
    textContainer: {
      marginVertical: SCREEN_HEIGHT * 0.017,
      width: '100%',
    },
    titleText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_SemiBold,
      textAlign: 'justify',
      textTransform: 'uppercase',
    },
  });

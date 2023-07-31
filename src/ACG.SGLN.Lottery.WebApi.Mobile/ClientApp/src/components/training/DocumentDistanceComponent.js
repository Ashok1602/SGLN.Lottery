/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Alert,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'rn-fetch-blob';

import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import {
  ImageURL,
  TrainingSupportFile,
} from '../../services/serviceHelper/ServiceUtilites';

const DocumentDistanceComponent = props => {
  //console.log(props);
  const theme = useTheme();
  const styles = useStyles(theme);

  let date =
    props.data != undefined
      ? moment(new Date(props.data.startDate)).format('DD/MM/YYYY')
      : '';

  const HandleDocumentTapped = () => {
    const url = `${ImageURL}${TrainingSupportFile}${'/'}${
      props.data.documentId
    }`;
    const name =
      props.data.title != null
        ? props.data.title
        : Localization.t('createRequest.downloadTitle');
    console.log(name);
    DownloadFile(url, name);
  };

  const DownLoadDocument = () => {
    if (props.data.documentId) {
      HandleDocumentTapped();
    } else {
      Alert.alert(
        Localization.t('training.title'),
        Localization.t('training.noDocument'),
        [{text: 'OK'}],
      );
    }
  };

  const DownloadFile = async (url, name) => {
    console.log(url);
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ActualDownload(url, name);
      } else {
        Alert.alert(
          Localization.t('common.permission'),
          Localization.t('common.request'),
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const ActualDownload = (url, name) => {
    const {dirs} = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: name,
        path: `${dirs.DownloadDir}/${name}`,
      },
    })
      .fetch('GET', url, {})
      .then(res => {
        //console.log('The file saved to ', res.path());
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <TouchableOpacity onPress={DownLoadDocument}>
      <View style={styles.parentView}>
        <Ionicons
          name="document"
          color={theme.colors.darkCerulean}
          size={SCREEN_WIDTH * 0.09}
        />
        <View style={{marginLeft: SCREEN_WIDTH * 0.034, flex: 1}}>
          <Text numberOfLines={1} style={styles.title}>
            {props.data.title}
          </Text>
          <View style={styles.boxView}>
            <Text style={styles.typeText}>
              {Localization.t('training.live')}
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

export default DocumentDistanceComponent;

const useStyles = theme =>
  StyleSheet.create({
    boxView: {
      backgroundColor: theme.colors.darkRed,
      height: SCREEN_HEIGHT * 0.027,
      justifyContent: 'center',
      paddingHorizontal: SCREEN_WIDTH * 0.024,
      width: SCREEN_WIDTH * 0.27,
    },
    dateText: {
      alignItems: 'flex-end',
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(14, 812),
      paddingRight: SCREEN_WIDTH * 0.036,
      textAlignVertical: 'center',
    },
    parentView: {
      backgroundColor: theme.colors.primaryWhite,
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.09,
      marginBottom: SCREEN_HEIGHT * 0.019,
      padding: SCREEN_HEIGHT * 0.014,
    },
    title: {
      color: theme.colors.licorice,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.OpenSans_SemiBold,
    },
    threeAboveSectionTouch: {
      flex: 1,
      height: SCREEN_WIDTH * 0.29,
      marginRight: SCREEN_WIDTH * 0.02,
      paddingVertical: 10,
      width: SCREEN_WIDTH * 0.29,
    },

    typeText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(12, 812),
      fontFamily: FONTS.OpenSans_Regular,
      textAlignVertical: 'center',
    },
  });

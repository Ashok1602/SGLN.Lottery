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
import {showToast} from '../../components/customs/Toast';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import {
  ImageURL,
  MediaLibraryDocument,
} from '../../services/serviceHelper/ServiceUtilites';
import {DateFormats} from '../../utils/constants/constants';

const DocumentComponent = props => {
  //console.log(props);
  const theme = useTheme();
  const styles = useStyles(theme);

  const HandleDocumentTapped = item => () => {
    if (item.documentId) {
      const url = `${ImageURL}${MediaLibraryDocument}${'/'}${item.documentId}`;
      const name =
        item.title != null
          ? item.title
          : Localization.t('createRequest.downloadTitle');
      DownloadFile(url, name, item.mimeType);
    } else {
      Alert.alert(
        Localization.t('training.title'),
        Localization.t('training.noDocument'),
        [{text: Localization.t('common.ok')}],
      );
    }
  };

  const DownloadFile = async (url, name, type) => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ActualDownload(url, name, type);
      } else {
        Alert.alert(
          Localization.t('common.permission'),
          Localization.t('common.request'),
        );
      }
    } else {
      ActualDownload(url, name, type);
    }
  };

  const ActualDownload = (url, name, type) => {
    showToast(
      Localization.t('createRequest.downloading'),
      'bottom',
      'info',
      500,
    );
    const {dirs} = RNFetchBlob.fs;
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        mime: type,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: name,
        path: `${dirs.DownloadDir}/${name}`,
      },
    })
      .fetch('GET', url, {})
      .then(res => {
        showToast(
          Localization.t('createRequest.downloadSuccess'),
          'bottom',
          'success',
          1000,
        );
      })
      .catch(e => {
        showToast(
          Localization.t('common.downloadFailed'),
          'bottom',
          'error',
          1000,
        );
        console.log('Download Failed : ', e);
      });
  };

  return (
    <TouchableOpacity
      style={styles.listCard}
      onPress={HandleDocumentTapped(props.data)}>
      <View style={styles.listCardSubContainer}>
        <Ionicons
          name="document"
          color={theme.colors.yellow}
          size={SCREEN_WIDTH * 0.09}
          style={{marginRight: SCREEN_WIDTH * 0.029}}
        />
        <View style={{width: '50%'}}>
          <Text numberOfLines={2} style={styles.listCardTitleText}>
            {props.data.title}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.listCardDateText}>
            {' '}
            {Localization.t('resources.postedOn')}{' '}
            {moment(new Date(props.data.created)).format(
              DateFormats.DateMonthYear,
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DocumentComponent;

const useStyles = theme =>
  StyleSheet.create({
    listCard: {
      alignItems: 'center',
      backgroundColor: theme.colors.primaryWhite,
      height: SCREEN_HEIGHT * 0.084,
      justifyContent: 'center',
      marginVertical: 8,
      width: '100%',
    },
    listCardSubContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '92%',
    },
    listCardTitleText: {
      color: theme.colors.licorice,
      fontSize: RFValue(14, 830),
      fontFamily: FONTS.Montserrat_SemiBold,
    },
    listCardDateText: {
      color: theme.colors.licorice,
      fontSize: RFValue(12, 830),
      fontFamily: FONTS.OpenSans_Regular,
    },
  });

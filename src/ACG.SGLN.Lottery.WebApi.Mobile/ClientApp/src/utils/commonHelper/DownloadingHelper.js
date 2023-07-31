import {Alert, PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {showToast} from '../../components/customs/Toast';
import Localization from '../../localization/Localization';

export const DownloadFile = async (url, name, type) => {
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
  showToast(Localization.t('createRequest.downloading'), 'bottom', 'info', 500);
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
      // console.log('The file saved to ', res);
    })
    .catch(e => {
      showToast('Download Failed', 'bottom', 'error', 1000);
      console.log(e);
    });
};

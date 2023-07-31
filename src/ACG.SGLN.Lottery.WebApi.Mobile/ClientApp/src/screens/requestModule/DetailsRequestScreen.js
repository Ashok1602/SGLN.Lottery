/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PlayIcon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';

import NatureComponent from '../../components/createRequest/NatureComponent';
import Loader from '../../components/customs/Loader';
import Localization from '../../localization/Localization';
import {AgainRequest} from '../../services/requestClient/AgainRequestApi';
import {GetDocumentsData} from '../../services/requestClient/DocumentsDataApi';
import {DeleteRequest} from '../../services/requestClient/DeleteRequestApi';
import {
  ImageURL,
  RequestCategory,
  RequestObject,
} from '../../services/serviceHelper/ServiceUtilites';
import {SCREEN_HEIGHT, SCREEN_WIDTH, FONTS} from '../../styles/StyleConstant';
import {
  statusRequest,
  statusRequestFrench,
} from '../../utils/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {showToast} from '../../components/customs/Toast';

const audioRecorderPlayer = new AudioRecorderPlayer();

const DetailsRequestScreen = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  //Dispatch
  const dispatch = useDispatch();

  //Selector
  const resources = useSelector(state => state.Resources);

  //Use States
  const [categoryData, setCategoryData] = useState([]);
  const [documentData, setDocumentData] = useState([]);
  const [imageUri, setImageUri] = useState([]);
  const [audio, setAudio] = useState([]);
  const [isLoaderVisibility, setIsLoaderVisibility] = useState(false);
  //Audio UseStates
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isGifVisible, setIsGifVisible] = useState(false);
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [voiceRecord, setVoiceRecord] = useState({
    data: '',
    fileName: '',
  });

  //Category and Object use states
  const [documentList, setDocumentList] = useState([]);
  const [data, setData] = useState({});
  const [isDeleteButtonVisible, setIsDeleteButtonVisible] = useState(false);

  //Nature type states
  const [natureData, setNatureData] = useState({});
  const [object, setObject] = useState('');

  audioRecorderPlayer.setSubscriptionDuration(0.09);

  //UseEffects
  useEffect(async () => {
    if (props.route.params != undefined) {
      setNatureData(props.route.params.data);
      const object = props.route.params.data.requestObject.substring(
        props.route.params.data.requestObject.lastIndexOf('|') + 1,
        props.route.params.data.requestObject.length,
      );
      setObject(object);
      setData(props.route.params.data);
      ButtonHiding(props.route.params.data.lastStatus);
    }
  }, [natureData]);

  useEffect(() => {
    setIsLoaderVisibility(true);
    if (resources.GetResourceSuccess) {
      const data = resources.GetResourceSuccess.response.data.RequestNatureType;
      if (data) {
        const list = Object.keys(data).map(statusKey => {
          return {
            label: data[statusKey],
            value: statusKey,
          };
        });
        setCategoryData(list);
      } else {
        return setCategoryData([]);
      }
    } else {
      handleResource();
    }
    setIsLoaderVisibility(false);
  }, [resources]);

  //UseEffects
  useEffect(() => {
    // CheckPermissions();
    DocumentFileApi();
  }, []);

  //Methods
  const handleResource = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('resource'));
    if (data) {
      const list = Object.keys(data.RequestNatureType).map(statusKey => {
        return {
          label: data.RequestNatureType[statusKey],
          value: statusKey,
        };
      });
      setCategoryData(list);
    } else {
      setIsLoaderVisibility(false);
    }
  };

  const ButtonHiding = status => {
    console.log('see status', status);
    switch (status) {
      case statusRequestFrench.Closed:
        setIsDeleteButtonVisible(false);
        break;
      // case statusRequestFrench.Cancelled:
      //   setIsDeleteButtonVisible(false);
      //   break;
      default:
        setIsDeleteButtonVisible(true);
        break;
    }
  };

  const DocumentFileApi = async () => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        setIsLoaderVisibility(true);
        const response = await GetDocumentsData(props.route.params.data.id);
        if (response.isSuccess) {
          setIsLoaderVisibility(false);
          setDocumentList(response.data.documents);
          setAudio(
            response.data.documents.filter(
              a => a.type === 'RequestAudioDocument',
            ),
          );
          setImageUri(
            response.data.documents.filter(
              a => a.type === 'RequestImageDocument',
            ),
          );
          setDocumentData(
            (document = response.data.documents.filter(
              a => a.type === 'RequestPdfDocument',
            )),
          );
        } else {
          setIsLoaderVisibility(false);
        }
      } else
        showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    } catch (err) {
      setIsLoaderVisibility(false);
    }
  };

  // Tod do:-Download functionality api
  // const DownloadFileApi = async () => {
  //   try {
  //     setIsLoaderVisibility(true);
  //     const response = await DownloadDocument(documentList[0].id, false);
  //     if (response.isSuccess) {
  //       setIsLoaderVisibility(false);
  //       console.log('response............', JSON.stringify(response.data));

  //       setDownloadImageURL(response.data);
  //       return true;
  //     } else {
  //       setIsLoaderVisibility(false);
  //       console.log(
  //         'response............error',
  //         JSON.stringify(response.error),
  //       );
  //     }
  //   } catch (err) {
  //     setIsLoaderVisibility(false);
  //   }
  // };

  const downloadConfigOptions = Platform.select({
    ios: {
      fileCache: true,
      title: Localization.t('createRequest.downloadTitle'),
      path: RNFetchBlob.fs.dirs.DocumentDir + '/' + 'Report.pdf',
      appendExt: 'pdf',
    },
    android: {
      fileCache: false,
      appendExt: 'pdf',
      addAndroidDownloads: {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mime: 'application/pdf',
        title: Localization.t('createRequest.downloadTitle'),
        description: Localization.t('createRequest.downloading'),
        path: RNFetchBlob.fs.dirs.DownloadDir + '/' + 'Report.pdf',
      },
    },
  });

  ////////////////////////////////////////////////////////////////////////
  const DownloadDocument = fileUrl => {
    setIsLoaderVisibility(true);
    setTimeout(() => {
      RNFetchBlob.config(downloadConfigOptions)
        .fetch('GET', fileUrl)
        .then(async resp => {
          console.log('check path first' + resp.data);
          console.log('check path  ' + downloadConfigOptions.path);
          let filePath = resp.path();
          const dirs = RNFetchBlob.fs.dirs;
          if (Platform.OS === 'ios') {
            let arr = downloadConfigOptions.path.split('/');
            const dirs = RNFetchBlob.fs.dirs;
            filePath = `${dirs.DocumentDir}/${arr[arr.length - 1]}`;
            console.log('file path final ' + filePath);
            RNFetchBlob.ios.previewDocument(filePath);
            RNFetchBlob.ios.openDocument(filePath);
          }
          setIsLoaderVisibility(false);
        });
    }, 700);
  };

  const HandleImageTapped = () => {
    if (imageUri[0] != undefined) {
      const type = imageUri[0].type;
      const id = imageUri[0].id;
      const url = `${ImageURL}${type}${'/'}${id}`;
      let newImgUri = url.lastIndexOf('/');
      let imageName = url.substring(newImgUri);
      const name = imageUri[0].uri != null ? imageUri[0].uri : imageName;
      DownloadImageDocument(url, `/${name}`);
    }
  };

  const DownloadImageDocument = (imgUrl, imageName) => {
    showToast(
      Localization.t('createRequest.downloading'),
      'bottom',
      'info',
      500,
    );
    let dirs = RNFetchBlob.fs.dirs;
    let path =
      Platform.OS === 'ios'
        ? dirs['MainBundleDir'] + imageName
        : dirs.PictureDir + imageName;
    if (Platform.OS == 'android') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image',
        },
      })
        .fetch('GET', imgUrl)
        .then(res => {
          showToast(
            Localization.t('createRequest.downloadSuccess'),
            'bottom',
            'success',
            1000,
          );
        })
        .catch(err => {
          console.debug('got err :', err);
        });
    } else {
      CameraRoll.save(imgUrl).then(res => {
        showToast(
          Localization.t('createRequest.downloadSuccess'),
          'bottom',
          'success',
          1000,
        );
      });
    }
  };

  const HandleDocumentTapped = () => {
    if (documentData[0] != undefined) {
      const type = documentData[0].type;
      const id = documentData[0].id;
      const url = `${ImageURL}${type}${'/'}${id}`;
      // const name =
      //   imageUri[0].uri !== null
      //     ? imageUri[0].uri
      //     : Localization.t('createRequest.downloadTitle');
      // console.log(name);
      downloadFile(url, Localization.t('createRequest.downloadTitle'));
    }
  };

  const actualDownload = (url, name) => {
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
        console.log(e);
      });
  };

  const downloadFile = async (url, name) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        actualDownload(url, name);
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

  const AudioTapped = () => {
    // CheckPermissions()
    setIsAudioModalVisible(true);
  };

  //Methods
  const CheckPermissions = async () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.MICROPHONE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setIsPermissionGranted(false);
              RequestIOSPermission();
              break;
            case RESULTS.DENIED:
              setIsPermissionGranted(false);
              RequestIOSPermission();
              break;
            case RESULTS.LIMITED:
              setIsPermissionGranted(true);
              break;
            case RESULTS.GRANTED:
              setIsPermissionGranted(true);
              break;
            case RESULTS.BLOCKED:
              Linking.openSettings();
              break;
          }
        })
        .catch(error => {
          return;
        });
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: Localization.t('createRequest.permissionRequired'),
          message: Localization.t('createRequest.allowHitRadio'),
          buttonPositive: 'ok',
        },
      );
      setIsPermissionGranted(granted);
    }
  };

  const RequestIOSPermission = () => {
    request(PERMISSIONS.IOS.MICROPHONE);
  };

  const OnStartPlay = async url => {
    console.log(url + 'audio url......');
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'voice.m4a',
      android: `${dirs.CacheDir}/voice.mp3`,
    });
    const msg = await audioRecorderPlayer.startPlayer(url);
    // audioRecorderPlayer.setVolume(1.0);
    //console.log(msg);
    audioRecorderPlayer.addPlayBackListener(e => {
      // console.info('IN Playing ====> ', e);
      setSeconds(e.current_position);
      if (e.current_position === e.duration) {
        setIsPlaying(false);
        if (Platform.OS === 'android') {
          setIsGifVisible(false);
        } else {
          setTimeout(() => {
            setIsGifVisible(false);
          }, 200);
        }
        audioRecorderPlayer.stopPlayer().catch(err => {
          // console.log('ERROR In STOP CATCH :  ', err.message);
          setIsPlaying(false);
          if (Platform.OS === 'android') {
            setIsGifVisible(false);
          } else {
            setTimeout(() => {
              setIsGifVisible(false);
            }, 200);
          }
        });
      }
    });
  };

  const OnPausePlayer = async () => {
    try {
      setIsPlaying(false);
      if (Platform.OS === 'android') {
        setIsGifVisible(false);
      } else {
        setTimeout(() => {
          setIsGifVisible(false);
        }, 200);
      }
      audioRecorderPlayer.pausePlayer();
    } catch (error) {
      console.log('Error in Pausing audio');
    }
  };

  function MillesToMinutesAndSeconds(milles) {
    var minutes = Math.floor(milles / 60000);
    var seconds = ((milles % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  const PauseClick = () => {
    OnPausePlayer();
    setIsPlaying(false);
  };

  const PlayClick = () => {
    if (audio[0] != undefined) {
      const type = audio[0].type;
      const id = audio[0].id;
      const url = `${ImageURL}${type}${'/'}${id}`;
      OnStartPlay(url);
      //  console.log(url);
      setIsPlaying(true);
      setIsGifVisible(true);
    }
  };

  const CancelClicked = () => {
    props.navigation.goBack();
  };

  const SuccessMessageMethod = () => {
    props.navigation.reset({
      index: 0,
      routes: [{name: 'RequestListScreen'}],
    });
  };

  const DeleteRequestClicked = async () => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        setIsLoaderVisibility(true);
        const response = await DeleteRequest(props.route.params.data.id, '');
        if (response.isSuccess) {
          setIsLoaderVisibility(false);
          // console.log('response............', response.data);
          Alert.alert('', Localization.t('createRequest.cancelSuccess'), [
            {text: 'OK', onPress: () => SuccessMessageMethod()},
          ]);
        } else {
          setIsLoaderVisibility(false);
          Alert.alert(
            Localization.t('createRequest.alertCreateTitle'),
            Localization.t('common.defaultMessage'),
            [{text: 'OK'}],
          );
        }
      } else
        showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    } catch (err) {
      setIsLoaderVisibility(false);
    }
  };

  const AgainRequestClicked = async () => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        setIsLoaderVisibility(true);
        const response = await AgainRequest(props.route.params.data.id, '');
        if (response.isSuccess) {
          setIsLoaderVisibility(false);
          // console.log('response............', response.data);
          Alert.alert(
            Localization.t('createRequest.alertCreateTitle'),
            Localization.t('createRequest.alertSuccessMessage'),
            [{text: 'OK', onPress: () => SuccessMessageMethod()}],
          );
        } else {
          setIsLoaderVisibility(false);
          Alert.alert(
            Localization.t('createRequest.alertCreateTitle'),
            Localization.t('common.defaultMessage'),
            [{text: 'OK'}],
          );
        }
      } else {
        showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
      }
    } catch (err) {
      setIsLoaderVisibility(false);
    }
  };
  const BackgroundColorAudio = () => {
    if (audio[0] != undefined) {
      return theme.colors.yellow;
    } else return theme.colors.primaryWhite;
  };
  const BackgroundColorDocument = () => {
    if (documentData[0] != undefined) {
      return theme.colors.yellow;
    } else return theme.colors.primaryWhite;
  };
  const BackgroundColorImage = () => {
    if (imageUri[0] != undefined) {
      return theme.colors.yellow;
    } else return theme.colors.primaryWhite;
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/backgroundImage.png')}
        style={{width: '100%', height: '100%'}}>
        <ScrollView
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          bouncesZoom={false}
          style={styles.scrollContainer}>
          <Text style={styles.headerTitle}>
            {Localization.t('createRequest.title')}
          </Text>
          <Text style={styles.belowTitle}>
            {Localization.t('createRequest.titleBelow')}
          </Text>
          <NatureComponent
            selection={true}
            natureName={data.requestNature}
            selectedData={setNatureData}
            list={categoryData}
          />
          <View
            style={{
              paddingHorizontal: SCREEN_WIDTH * 0.048,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <View style={styles.categorySubView}>
                <Text
                  style={{
                    fontFamily: FONTS.Montserrat_Medium,
                    fontSize: RFValue(14, 812),
                  }}>
                  {Localization.t('createRequest.category')}
                </Text>
                {/* Starting time useful for category */}
                <View
                  style={{
                    backgroundColor: theme.colors.gray,
                    flex: 1,
                    margin: 5,
                  }}>
                  <Image
                    source={{
                      uri: `${ImageURL}${RequestCategory}${'/'}${
                        data.requestCategory
                      }`,
                    }}
                    resizeMode="stretch"
                    borderRadius={15}
                    style={{flex: 1, backgroundColor: theme.colors.gray}}
                  />
                </View>
              </View>
              <View style={{width: '4%'}}></View>
              <View style={styles.categorySubView}>
                <Text
                  style={{
                    fontFamily: FONTS.Montserrat_Medium,
                    fontSize: RFValue(14, 812),
                  }}>
                  {Localization.t('createRequest.object')}
                </Text>
                <View
                  style={{
                    //backgroundColor: theme.colors.primaryBlack,
                    flex: 1,
                    margin: 5,
                  }}>
                  <Image
                    source={{
                      uri: `${ImageURL}${RequestObject}${'/'}${object}`,
                    }}
                    resizeMode="stretch"
                    borderRadius={15}
                    style={{flex: 1}}
                  />
                </View>
              </View>
            </View>
            <View style={styles.textInputView}>
              <Text style={styles.descriptionText}>{data.description}</Text>
            </View>
            <View style={[styles.belowThreeSParentView]}>
              <TouchableOpacity
                onPress={HandleDocumentTapped}
                disabled={
                  !(
                    documentData[0] != undefined &&
                    documentData[0].type === 'RequestPdfDocument'
                  )
                }
                style={[
                  styles.belowThreeSTouchable,
                  {
                    backgroundColor: BackgroundColorDocument(),
                    marginHorizontal: 0,
                  },
                ]}>
                <View style={{alignItems: 'center'}}>
                  <View style={styles.circleView}>
                    <Ionicons
                      name="document"
                      color={theme.colors.darkCerulean}
                      size={30}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: FONTS.Montserrat_SemiBold,
                      fontSize: RFValue(14, 812),
                    }}>
                    {Localization.t('createRequest.document')}
                  </Text>
                  {/* <Text numberOfLines={1}>.pdf</Text> */}
                  {documentData[0] != undefined &&
                    documentData[0].type === 'RequestPdfDocument' && (
                      <Entypo
                        name="download"
                        color={theme.colors.darkCerulean}
                        size={45}
                      />
                    )}
                  {/* {documentData.fileName !== '' && (
                <Text numberOfLines={1}>{documentData.fileName}</Text>
              )} */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={HandleImageTapped}
                disabled={
                  !(
                    imageUri[0] != undefined &&
                    imageUri[0].type === 'RequestImageDocument'
                  )
                }
                style={[
                  styles.belowThreeSTouchable,
                  {
                    backgroundColor: BackgroundColorImage(),
                  },
                ]}>
                <View style={{alignItems: 'center'}}>
                  <View style={styles.circleView}>
                    <PlayIcon
                      name="image"
                      color={theme.colors.darkCerulean}
                      size={30}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: FONTS.Montserrat_SemiBold,
                      fontSize: RFValue(14, 812),
                    }}
                    numberOfLines={1}>
                    {Localization.t('createRequest.image')}
                  </Text>
                  {/* {imageUri.fileName !== '' && (
                <Text numberOfLines={2}>{imageUri.fileName}</Text>
              )} */}
                  {imageUri[0] != undefined &&
                    imageUri[0].type === 'RequestImageDocument' && (
                      <Entypo
                        name="download"
                        color={theme.colors.darkCerulean}
                        size={45}
                      />
                    )}
                  {/* <Text numberOfLines={1}>.jpg</Text> */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={AudioTapped}
                disabled={
                  !(
                    audio[0] != undefined &&
                    audio[0].type === 'RequestAudioDocument'
                  )
                }
                style={[
                  styles.belowThreeSTouchable,
                  {
                    backgroundColor: BackgroundColorAudio(),
                    marginHorizontal: 0,
                  },
                ]}>
                <View style={{alignItems: 'center'}}>
                  <View style={styles.circleView}>
                    <PlayIcon
                      name="image"
                      color={theme.colors.darkCerulean}
                      size={30}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: FONTS.Montserrat_SemiBold,
                      fontSize: RFValue(14, 812),
                    }}
                    numberOfLines={1}>
                    {Localization.t('createRequest.audio')}
                  </Text>
                  {voiceRecord.fileName !== '' && (
                    <Text numberOfLines={2}>{voiceRecord.fileName}</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              {props.route.params.data.lastStatus !==
              statusRequestFrench.Cancelled ? (
                <>
                  <TouchableOpacity
                    onPress={CancelClicked}
                    style={[styles.buttonView, {marginRight: 3}]}>
                    <Text numberOfLines={1} style={styles.buttonTextContainer}>
                      {Localization.t('createRequest.cancel')}
                    </Text>
                  </TouchableOpacity>
                  {isDeleteButtonVisible ? (
                    <TouchableOpacity
                      onPress={DeleteRequestClicked}
                      style={[styles.buttonView]}>
                      <Text
                        numberOfLines={1}
                        style={styles.buttonTextContainer}>
                        {Localization.t('createRequest.delete')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={AgainRequestClicked}
                      style={[styles.buttonView]}>
                      <Text
                        numberOfLines={1}
                        style={styles.buttonTextContainer}>
                        {Localization.t('createRequest.contester')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <TouchableOpacity
                  onPress={CancelClicked}
                  style={[styles.buttonView, {marginRight: 3}]}>
                  <Text numberOfLines={1} style={styles.buttonTextContainer}>
                    {Localization.t('createRequest.cancel')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      {/* Loader */}
      <Modal
        animationType={'fade'}
        statusBarTranslucent={true}
        transparent={true}
        visible={isLoaderVisibility}>
        <Loader />
      </Modal>
      {/* Audio Popup */}
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isAudioModalVisible}
        onRequestClose={() => {
          setIsAudioModalVisible(false);
        }}>
        <View style={[styles.audioWebRadioParentContainer]}>
          <View style={styles.audioModalView}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <Text style={styles.audioModalTitle}>Voice Record</Text>
              <AntDesign
                name="closecircle"
                color={theme.colors.darkCerulean}
                size={25}
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
                onPress={() => {
                  setIsAudioModalVisible(false);
                }}
              />
            </View>
            {Platform.OS === 'ios' ? (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/new_waves.gif')}
                  resizeMode="stretch"
                  resizeMethod="scale"
                  style={[
                    styles.gifImageStyle,
                    {display: !isGifVisible ? 'none' : 'flex'},
                  ]}
                />
                <Image
                  source={require('../../assets/wave_static.png')}
                  style={[
                    styles.gifImageStyle,
                    {display: isGifVisible ? 'none' : 'flex'},
                  ]}
                  resizeMode="stretch"
                />
              </View>
            ) : isGifVisible ? (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/new_waves.gif')}
                  resizeMode="stretch"
                  resizeMethod="scale"
                  style={[
                    styles.gifImageStyle,
                    {display: !isGifVisible ? 'none' : 'flex'},
                  ]}
                />
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/wave_static.png')}
                  style={[
                    styles.gifImageStyle,
                    {display: isGifVisible ? 'none' : 'flex'},
                  ]}
                  resizeMode="stretch"
                />
              </View>
            )}
            <Text style={styles.holdText}>
              {Localization.t('createRequest.holdText')}
            </Text>
            <Text style={[styles.holdText, {marginTop: 0}]}>
              {MillesToMinutesAndSeconds(seconds)}
            </Text>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity style={styles.micBtnContainer}>
                {isPlaying ? (
                  <TouchableOpacity
                    style={[styles.micBtnContainer, {marginTop: 0}]}
                    onPress={PauseClick}>
                    <PlayIcon
                      name="pause"
                      color={theme.colors.primaryWhite}
                      size={25}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.micBtnContainer, {marginTop: 0}]}
                    onPress={PlayClick}>
                    <PlayIcon
                      name="play"
                      color={theme.colors.primaryWhite}
                      size={25}
                    />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DetailsRequestScreen;

const useStyles = theme =>
  StyleSheet.create({
    audioModalView: {
      backgroundColor: theme.colors.yellow,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      height: '60%',
      padding: 20,
    },
    audioModalTitle: {
      alignSelf: 'center',
      color: theme.colors.darkCerulean,
      fontFamily: FONTS.Montserrat_SemiBold,
      flex: 1,
      fontSize: RFValue(17, 812),
      justifyContent: 'center',
      marginLeft: 30,
      textAlign: 'center',
    },
    audioWebRadioParentContainer: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      flex: 1,
      flexDirection: 'column-reverse',
    },
    audioPlayerMenu: {
      backgroundColor: theme.colors.primaryWhite,
      borderTopRightRadius: 30,
      borderTopLeftRadius: 30,
      paddingHorizontal: 20,
      paddingVertical: 25,
    },
    buttonText: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(14, 812),
      textAlignVertical: 'center',
    },
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: 30,
      opacity: 0.5,
    },
    belowThreeSParentView: {
      alignItems: 'stretch',
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    belowThreeSTouchable: {
      alignItems: 'center',
      backgroundColor: theme.colors.primaryWhite,
      flex: 1,
      height: SCREEN_HEIGHT * 0.15,
      marginHorizontal: 6,
      paddingVertical: 10,
      paddingVertical: SCREEN_HEIGHT * 0.012,
      justifyContent: 'space-evenly',
    },
    buttonView: {
      backgroundColor: theme.colors.yellow,
      flex: 1,
      justifyContent: 'center',
      height: SCREEN_HEIGHT * 0.08,
      marginTop: 10,
      marginBottom: SCREEN_HEIGHT * 0.1,
    },
    buttonTextContainer: {
      alignSelf: 'center',
      color: theme.colors.darkCerulean,
      fontFamily: FONTS.Montserrat_Bold,
      fontSize: RFValue(18, 812),
      justifyContent: 'center',
    },
    categorySubView: {
      backgroundColor: theme.colors.primaryWhite,
      height: SCREEN_HEIGHT * 0.19,
      padding: SCREEN_WIDTH * 0.02,
      width: '48%',
    },
    circleView: {
      alignItems: 'center',
      borderRadius: SCREEN_WIDTH * 0.05,
      justifyContent: 'center',
      height: SCREEN_WIDTH * 0.1,
      width: SCREEN_WIDTH * 0.1,
    },
    descriptionText: {
      fontFamily: FONTS.Montserrat_Regular,
      marginLeft: SCREEN_WIDTH * 0.03,
      paddingHorizontal: SCREEN_WIDTH * 0.01,
      paddingVertical: SCREEN_WIDTH * 0.03,
      textAlignVertical: 'top',
    },
    gifImageStyle: {
      height: SCREEN_HEIGHT * 0.2,
      width: SCREEN_WIDTH * 0.75,
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_SemiBold,
      justifyContent: 'center',
    },
    holdText: {
      color: theme.colors.AliceGray,
      fontSize: RFValue(12, 812),
      marginTop: 15,
      textAlign: 'center',
    },
    modalContainer: {
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    micBtnContainer: {
      alignItems: 'center',
      backgroundColor: 'red',
      borderRadius: SCREEN_WIDTH * 0.08,
      height: SCREEN_WIDTH * 0.16,
      justifyContent: 'center',
      marginTop: SCREEN_HEIGHT * 0.055,
      width: SCREEN_WIDTH * 0.16,
    },
    recorderContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.primaryWhite,
      borderRadius: 32,
      marginTop: 3,
      width: '100%',
    },
    scrollContainer: {
      flex: 1,
    },
    textInputView: {
      backgroundColor: theme.colors.gray,
      flexDirection: 'row',
      marginVertical: 20,
    },
    textContainer: {
      flex: 0.9,
      justifyContent: 'center',
      textAlignVertical: 'center',
    },
  });

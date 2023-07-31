/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Vibration,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFValue} from 'react-native-responsive-fontsize';

import ImagePicker from 'react-native-image-crop-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector, useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import PlayIcon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

import DeleteIcon from '../../assets/icon_trash_bin.svg';
import MicroPhone from '../../assets/icon_microphone.svg';
import NatureComponent from '../../components/createRequest/NatureComponent';
import Loader from '../../components/customs/Loader';
import Localization from '../../localization/Localization';
import {changeColor} from '../../redux/bottomTab/changeColorOfTab-action';
import {CHANGE_COLOR_CONST} from '../../redux/bottomTab/changeColor-constant';
import {GetAllCategoryData} from '../../services/resource/CategoryApi';
import {CreateRequest} from '../../services/requestClient/CreateRequestApi';
import {GetObjectData} from '../../services/requestClient/ObjectApi';
import {
  ImageURL,
  RequestCategory,
  RequestObject,
} from '../../services/serviceHelper/ServiceUtilites';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {showToast} from '../../components/customs/Toast';

const audioRecorderPlayer = new AudioRecorderPlayer();

const CreateRequestScreen = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  //Dispatch
  const dispatch = useDispatch();

  //Selector
  const resources = useSelector(state => state.Resources);

  //Use States
  const [categoryTitle, setCategoryTitle] = useState('Select category');
  const [categoryObject, setCategoryObject] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [documentData, setDocumentData] = useState({
    fileName: '',
    data: '',
  });
  const [imageUri, setImageUri] = useState({
    data: '',
    fileName: '',
  });
  const [isLoaderVisibility, setIsLoaderVisibility] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  //Audio UseStates
  const [audioUri, setAudioUri] = useState('');
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isGifVisible, setIsGifVisible] = useState(false);
  const [isMicAnimationVisible, setIsMicAnimationVisible] = useState(false);
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);
  const [isSendBtnDisable, setIsSendBtnDisable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [voiceRecord, setVoiceRecord] = useState({
    data: '',
    fileName: '',
  });

  //Category and Object use states
  const [categoryTypeData, setCategoryTypeData] = useState({});
  const [description, setDescription] = useState('');
  const [isCategoryVisibility, setIsCategoryVisibility] = useState(false);
  const [isObjectVisibility, setIsObjectVisibility] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [objectList, setObjectList] = useState([]);
  const [isAddCategoryVisibility, setIsAddCategoryVisibility] = useState(false);
  const [isAddObjectImage, setIsAddObjectImage] = useState(false);
  const [objectTypeData, setObjectTypeData] = useState({});
  const [isObjectModalVisibility, setIsObjectModalVisibility] = useState(false);

  //Nature type states
  const [natureData, setNatureData] = useState({});

  audioRecorderPlayer.setSubscriptionDuration(0.09);

  //Variables
  const imageOptions = {
    cropping: true,
    compressImageMaxHeight: 80,
    compressImageMaxWidth: 80,
    compressImageQuality: 0.8,
    height: 400,
    includeBase64: true,
    includeExif: true,
    loadingLabelText: 'Image is Loading',
    width: 300,
  };

  useEffect(() => {
    if (Object.keys(natureData).length !== 0) {
      setIsAddCategoryVisibility(true);
      setIsObjectVisibility(false);
      setIsAddObjectImage(false);
      CategoryApi(natureData.value);
    }
  }, [natureData]);

  useEffect(() => {
    categoryObject.value
      ? setCategoryTitle(categoryObject.value)
      : setCategoryTitle('Select category');
  }, [categoryObject]);

  useEffect(async () => {
    setIsLoaderVisibility(true);
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 2));
  }, []);

  useEffect(async () => {
    var value = await AsyncStorage.getItem('resource');
    if (value !== null) {
      let resourceData = JSON.parse(value);
      const data = resourceData.RequestNatureType;
      if (data) {
        const list = Object.keys(data).map(statusKey => {
          return {
            label: data[statusKey],
            value: statusKey,
          };
        });
        setCategoryData(list);
        setIsLoaderVisibility(false);
      }
    } else {
      setIsLoaderVisibility(false);
    }
  }, []);

  //Methods

  const CategoryApi = async label => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        setIsLoaderVisibility(true);
        const response = await GetAllCategoryData(label);
        if (response.isSuccess) {
          setIsLoaderVisibility(false);
          var resourceValue = await AsyncStorage.getItem('resource');
          if (resourceValue !== null) {
            let resourceData = JSON.parse(resourceValue);
            const category = resourceData.RequestCategoryType;
            const list = response.data.map(item => {
              return {
                ...item,
                key: item,
                title: category[item.toString()],
              };
            });
            setCategoryList(list);
          } else {
            setCategoryList(response.data);
          }
        } else {
          setCategoryList([]);
          setIsLoaderVisibility(false);
        }
      } else {
        showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
      }
    } catch (err) {
      setIsLoaderVisibility(false);
    }
  };

  const ImageTapped = () => {
    setIsImageModalVisible(true);
  };

  const FileViewerMethod = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const documentType = res.name.substring(
        res.name.lastIndexOf('.') + 1,
        res.name.length,
      );
      if (documentType === 'pdf') {
        let arr = res.fileCopyUri;
        RNFetchBlob.fs.readFile(arr, 'base64').then(data => {
          setDocumentData({
            fileName: res.name,
            data: data,
          });
        });
      } else {
        Alert.alert(
          Localization.t('createRequest.pdfAlert'),
          Localization.t('createRequest.PdfDescription'),
          [{text: 'OK'}],
        );
      }
      //if()
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err);
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        console.log(err);
        throw err;
      }
    }
  };

  function dataURLtoFile(_name, _type, _base64) {
    const data = new FormData();
    data.append('image', {
      name: _name,
      type: _type,
      uri: _base64,
    });
    return data;
  }

  const TakeImage = () => {
    setTimeout(() => {
      ImagePicker.openCamera(imageOptions)
        .then(image => {
          let filename = image.path.substring(
            image.path.lastIndexOf('/') + 1,
            image.path.length,
          );
          let formatOfFile = image.path.substring(
            image.path.lastIndexOf('.') + 1,
            image.path.length,
          );
          var file = dataURLtoFile(filename, image.mime, image.data);
          setImageUri({
            fileName: filename,
            data: image.data,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }, 700);
  };

  const SelectImage = () => {
    setTimeout(() => {
      ImagePicker.openPicker(imageOptions)
        .then(image => {
          let filename = image.path.substring(
            image.path.lastIndexOf('/') + 1,
            image.path.length,
          );
          let formatOfFile = image.path.substring(
            image.path.lastIndexOf('.') + 1,
            image.path.length,
          );
          var file = dataURLtoFile(filename, image.mime, image.data);
          setImageUri({
            fileName: filename,
            data: image.data,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }, 700);
  };

  const AudioTapped = () => {
    CheckPermissions();
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

  const OnStartRecording = async () => {
    try {
      if (isPermissionGranted) {
        const dirs = RNFetchBlob.fs.dirs;
        const path = Platform.select({
          ios: 'voice.m4a',
          android: `${dirs.CacheDir}/voice.mp3`,
        });
        const audioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        try {
          await audioRecorderPlayer.pausePlayer();
          //await TrackPlayer.pause();
          setIsGifVisible(true);
          const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
          audioRecorderPlayer.addRecordBackListener(e => {
            // console.log(
            //   'ITS RECORDING====>  ',
            //   e.current_position,
            //   typeof e.current_position,
            // );
            setSeconds(e.current_position);
            if (e.current_position >= 60000) {
              OnStopRecord();
              if (Platform.OS === 'android') {
                setIsGifVisible(false);
              } else {
                setTimeout(() => {
                  setIsGifVisible(false);
                }, 200);
              }
              setIsSendBtnDisable(false);
              Vibration.vibrate(Platform.OS === 'android' ? 5 : [5], false);
            }
          });
          // console.log(`uri: ${uri}`);
          setVoiceRecord(uri);
        } catch (error) {
          console.log('CATCH OF START RECORDING===>  ', JSON.stringify(error));
        }
      } else {
        CheckPermissions();
        console.log('permission is not there');
        return;
      }
    } catch (err) {
      console.warn('ERROR IN PERMISSION===> ', err);
      return;
    }
  };

  const onCancellAudioModal = () => {
    setVoiceRecord(prevState => ({
      ...prevState,
      fileName: '',
    }));
    setAudioUri('');
    setIsAudioModalVisible(false);
  };

  const OnStopRecord = async () => {
    try {
      // console.info('IN ONSTOP');
      const result = await audioRecorderPlayer.stopRecorder();
      await audioRecorderPlayer.removeRecordBackListener();
      if (result !== 'Already stopped') {
        setAudioUri(result);
        ConvertUriToBase64(result);
        setIsSendBtnDisable(false);
        if (Platform.OS === 'android') {
          setIsGifVisible(false);
        } else {
          setTimeout(() => {
            setIsGifVisible(false);
          }, 200);
        }
      }
      // console.log('THIS IS RESULT---->  ', result);
    } catch (error) {
      // console.log('CATCH ERROR====>  ', JSON.stringify(error));
      if (Platform.OS === 'android') {
        setIsGifVisible(false);
      } else {
        setTimeout(() => {
          setIsGifVisible(false);
        }, 200);
      }
    }
  };

  const ConvertUriToBase64 = uri => {
    var filePath;
    if (Platform.OS === 'ios') {
      let arr = uri.split('/');
      const dirs = RNFetchBlob.fs.dirs;
      filePath = `${dirs.CacheDir}/${arr[arr.length - 1]}`;
    } else {
      filePath = uri;
    }
    const filename = uri.substring(uri.lastIndexOf('/') + 1, uri.length);
    RNFetchBlob.fs
      .readFile(filePath, 'base64')
      .then(data => {
        setVoiceRecord({
          data: data,
          fileName: filename,
        });
      })
      .catch(err => {
        console.debug('WE GOT ERROR  =======  ', err);
      });
  };

  const OnStartPlay = async () => {
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'voice.m4a',
      android: `${dirs.CacheDir}/voice.mp3`,
    });
    const msg = await audioRecorderPlayer.startPlayer(audioUri);
    // audioRecorderPlayer.setVolume(1.0);
    // console.log(msg);
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
    OnStartPlay();
    setIsPlaying(true);
    setIsGifVisible(true);
  };

  const DeleteIconClick = async () => {
    setIsSendBtnDisable(true);
    await audioRecorderPlayer.stopPlayer();
    setAudioUri('');
    if (Platform.OS === 'android') {
      setIsGifVisible(false);
    } else {
      setTimeout(() => {
        setIsGifVisible(false);
      }, 200);
    }
    setIsPlaying(false);
    setSeconds(0);
  };

  const PostVoiceMessage = async () => {
    setIsAudioModalVisible(false);
  };

  const HandlePressIn = () => {
    Vibration.vibrate(Platform.OS === 'android' ? 10 : [2], false);
    setIsMicAnimationVisible(true);
    OnStartRecording();
  };

  const HandlePressOut = () => {
    setIsMicAnimationVisible(false);
    OnStopRecord();
  };

  const CategoryData = () => {
    setIsCategoryVisibility(true);
  };

  const CancelImage = () => {
    setImageUri({
      fileName: '',
      data: '',
    });
  };

  const cancelDocument = () => {
    setDocumentData({
      fileName: '',
      data: '',
    });
  };

  const CancelAudioData = () => {
    setVoiceRecord({
      data: '',
      fileName: '',
    });
    DeleteIconClick();
  };

  const CategorySelected = item => async () => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        setIsCategoryVisibility(false);
        setIsAddObjectImage(false);
        setIsObjectVisibility(true);
        setIsLoaderVisibility(true);
        let value = item.key != null ? item.key : item;
        const response = await GetObjectData(value);
        setCategoryTypeData(value);
        if (response.isSuccess) {
          setTimeout(() => {
            setIsLoaderVisibility(false);
          }, 400);
          setObjectList(response.data);
          if (response.data) {
            setIsAddCategoryVisibility(false);
          }
        } else {
          setObjectList([]);
          setTimeout(() => {
            setIsLoaderVisibility(false);
          }, 400);
        }
      } else {
        showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
      }
    } catch (error) {
      setTimeout(() => {
        setIsLoaderVisibility(false);
      }, 400);
    }
  };

  const ObjectItemSelected = item => () => {
    setObjectTypeData(item);
    setIsObjectModalVisibility(false);
    setIsAddObjectImage(true);
  };

  const ObjectAddClicked = () => {
    setIsObjectModalVisibility(true);
  };

  const SubmitButton = () => {
    const enable =
      Object.keys(natureData).length !== 0 &&
      Object.keys(categoryTypeData).length !== 0 &&
      Object.keys(objectTypeData).length !== 0 &&
      (description !== '' ||
        documentData.fileName !== '' ||
        imageUri.fileName !== '' ||
        audioUri !== '')
        ? false
        : true;
    return enable;
  };

  const SuccessMessageMethod = () => {
    props.navigation.reset({
      index: 0,
      routes: [{name: 'RequestListScreen'}],
    });
  };

  const SubmitButtonTapped = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisibility(true);
      let documentFile,
        documentName,
        audioFile,
        audioName,
        imageFile,
        imageName;

      documentFile = documentData.data !== '' ? documentData.data : null;
      audioFile = voiceRecord.data !== '' ? voiceRecord.data : null;
      imageFile = imageUri.data !== '' ? imageUri.data : null;
      documentName =
        documentData.fileName !== '' ? documentData.fileName : null;
      audioName = voiceRecord.fileName !== '' ? voiceRecord.fileName : null;
      imageName = imageUri.fileName !== '' ? imageUri.fileName : null;
      console.log('see nature', natureData.value);
      const response = await CreateRequest(
        natureData.value,
        categoryTypeData,
        objectTypeData.id,
        description,
        documentFile,
        documentName,
        imageFile,
        imageName,
        audioFile,
        audioName,
      );
      if (response.isSuccess) {
        setIsLoaderVisibility(false);
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
  };

  const CategoryRenderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={[styles.modalImageContainer]}>
          <TouchableOpacity
            onPress={CategorySelected(item)}
            style={[styles.touchableContainer]}>
            <Image
              source={{
                uri: item && `${ImageURL}${RequestCategory}${'/'}${item.key}`,
              }}
              resizeMode="stretch"
              borderRadius={15}
              style={styles.modalImage}
            />
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.modalContainerText,
            {
              textAlign: 'center',
              width: SCREEN_WIDTH * 0.24,
              fontFamily: FONTS.Montserrat_Medium,
              fontSize: RFValue(15, 812),
            },
          ]}>
          {item.title != null ? item.title : item}
        </Text>
        <Text style={{textAlign: 'justify'}}>
          {/* this is the description of category */}
        </Text>
      </View>
    );
  };

  const ObjectRenderItem = ({item, index}) => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={[styles.modalImageContainer]}>
          <TouchableOpacity
            onPress={ObjectItemSelected(item)}
            style={[styles.touchableContainer]}>
            <Image
              source={{
                uri: item.id && `${ImageURL}${RequestObject}${'/'}${item.id}`,
              }}
              resizeMode="stretch"
              borderRadius={15}
              style={styles.modalImage}
            />
          </TouchableOpacity>
        </View>
        <Text
          numberOfLines={2}
          style={[
            styles.modalContainerText,
            {
              textAlign: 'center',
              width: SCREEN_WIDTH * 0.24,
              fontFamily: FONTS.Montserrat_Medium,
              fontSize: RFValue(15, 812),
            },
          ]}>
          {item.value}
        </Text>
        <Text style={{textAlign: 'justify'}}>
          {/* this is the description of category */}
        </Text>
      </View>
    );
  };

  return (
    <>
      <ImageBackground
        resizeMode="stretch"
        source={require('../../assets/backgroundImage.png')}
        style={{width: '100%', height: '100%'}}>
        <FlatList
          removeClippedSubviews={true}
          windowSize={201}
          disableVirtualization={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          bouncesZoom={false}
          data={[{key: 'Android'}]}
          renderItem={({item}) => (
            <KeyboardAwareScrollView
              enableAutomaticScroll={true}
              behavior="padding">
              <Text style={styles.headerTitle}>
                {Localization.t('createRequest.title')}
              </Text>
              <Text style={styles.belowTitle}>
                {Localization.t('createRequest.titleBelow')}
              </Text>
              <NatureComponent
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
                  <View style={[styles.categoryParentView]}>
                    <Text
                      style={{
                        fontFamily: FONTS.Montserrat_Medium,
                        fontSize: RFValue(14, 812),
                      }}>
                      {Localization.t('createRequest.category')}
                    </Text>
                    {/* Starting time useful for category */}
                    {isObjectVisibility && (
                      <TouchableOpacity
                        onPress={() => {
                          setIsCategoryVisibility(true);
                        }}
                        style={{
                          backgroundColor: theme.colors.gray,
                          flex: 1,
                          margin: 5,
                        }}>
                        <Image
                          source={{
                            uri:
                              categoryTypeData &&
                              `${ImageURL}${RequestCategory}${'/'}${categoryTypeData}`,
                          }}
                          resizeMode="stretch"
                          borderRadius={15}
                          style={{flex: 1}}
                        />
                      </TouchableOpacity>
                    )}
                    {isAddCategoryVisibility ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <TouchableOpacity
                          onPress={CategoryData}
                          style={styles.categoryTouchable}>
                          <MaterialIcons
                            name="add"
                            color={theme.colors.darkCerulean}
                            size={30}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                  <View style={{width: '4%'}}></View>
                  <View style={styles.objectView}>
                    <Text
                      style={{
                        fontFamily: FONTS.Montserrat_Medium,
                        fontSize: RFValue(14, 812),
                      }}>
                      {' '}
                      {Localization.t('createRequest.object')}
                    </Text>
                    {isAddObjectImage && (
                      <TouchableOpacity
                        onPress={() => {
                          setIsObjectModalVisibility(true);
                        }}
                        style={{
                          flex: 1,
                          margin: 5,
                        }}>
                        <Image
                          source={{
                            uri:
                              objectTypeData.id &&
                              `${ImageURL}${RequestObject}${'/'}${
                                objectTypeData.id
                              }`,
                          }}
                          resizeMode="stretch"
                          borderRadius={15}
                          style={{flex: 1}}
                        />
                      </TouchableOpacity>
                    )}

                    {/* Starting time useful for object */}
                    {isObjectVisibility && !isAddObjectImage ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          flex: 1,
                        }}>
                        <TouchableOpacity
                          onPress={ObjectAddClicked}
                          style={styles.objectTouchable}>
                          <MaterialIcons
                            name="add"
                            color={theme.colors.darkCerulean}
                            size={30}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View style={styles.textInputView}>
                  <TextInput
                    value={description}
                    onChangeText={text => setDescription(text)}
                    style={styles.textInputContainer}
                    numberOfLines={5}
                    maxHeight={SCREEN_HEIGHT * 0.18}
                    placeholder={Localization.t(
                      'createRequest.descriptionPlaceHolder',
                    )}
                    placeholderTextColor={theme.colors.primaryBlack}
                    multiline={true}
                  />
                </View>
                <View style={styles.belowThreeSParentView}>
                  <View
                    style={{
                      height: SCREEN_HEIGHT * 0.2,
                      width: SCREEN_WIDTH * 0.31,
                    }}>
                    <View style={{height: SCREEN_HEIGHT * 0.02}}></View>
                    <View style={styles.belowThreeViewContainer}>
                      <TouchableOpacity onPress={FileViewerMethod}>
                        <View style={styles.insideView}>
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
                            }}
                            numberOfLines={1}>
                            {Localization.t('createRequest.document')}
                          </Text>
                          {documentData.fileName !== '' && (
                            <Text numberOfLines={1}>
                              {documentData.fileName}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                    {documentData.fileName !== '' && (
                      <MaterialIcons
                        style={styles.materialIconContainer}
                        onPress={cancelDocument}
                        name="cancel"
                        color={theme.colors.bostonRed}
                        size={30}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      height: SCREEN_HEIGHT * 0.2,
                      width: SCREEN_WIDTH * 0.31,
                    }}>
                    <View style={{height: SCREEN_HEIGHT * 0.02}}></View>
                    <View style={styles.belowThreeViewContainer}>
                      <TouchableOpacity onPress={ImageTapped}>
                        <View style={styles.insideView}>
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
                          {imageUri.fileName !== '' && (
                            <Text
                              style={{
                                fontFamily: FONTS.Montserrat_Regular,
                                fontSize: RFValue(14, 812),
                              }}
                              numberOfLines={2}>
                              {imageUri.fileName}
                            </Text>
                          )}
                          {/* <Text numberOfLines={1}>.jpg</Text> */}
                        </View>
                      </TouchableOpacity>
                    </View>
                    {imageUri.fileName !== '' && (
                      <MaterialIcons
                        style={styles.materialIconContainer}
                        onPress={CancelImage}
                        name="cancel"
                        color={theme.colors.bostonRed}
                        size={30}
                      />
                    )}
                  </View>

                  <View
                    style={{
                      height: SCREEN_HEIGHT * 0.2,
                      width: SCREEN_WIDTH * 0.31,
                    }}>
                    <View style={{height: SCREEN_HEIGHT * 0.02}}></View>
                    <TouchableOpacity onPress={AudioTapped}>
                      <View style={styles.belowThreeViewContainer}>
                        <View style={styles.insideView}>
                          <View style={styles.circleView}>
                            <PlayIcon
                              name="microphone"
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
                            <Text numberOfLines={2}>
                              {voiceRecord.fileName}
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                    {voiceRecord.fileName !== '' && (
                      <MaterialIcons
                        style={styles.materialIconContainer}
                        onPress={CancelAudioData}
                        name="cancel"
                        color={theme.colors.bostonRed}
                        size={30}
                      />
                    )}
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={SubmitButtonTapped}
                style={[styles.buttonView, {opacity: SubmitButton() ? 0.5 : 1}]}
                disabled={SubmitButton()}>
                <Text numberOfLines={1} style={styles.buttonTextContainer}>
                  {Localization.t('createRequest.buttonText')}
                </Text>
              </TouchableOpacity>
              {/* Image Popup  */}
              <Modal
                animationType={'fade'}
                onRequestClose={() => {
                  setIsImageModalVisible(false);
                }}
                transparent={true}
                visible={isImageModalVisible}>
                <TouchableWithoutFeedback
                  onPress={() => setIsImageModalVisible(false)}>
                  <View style={styles.modalParentContainer}>
                    <View style={styles.modalMainView}>
                      <TouchableOpacity
                        style={[styles.modelItemStyle]}
                        onPress={() => {
                          setIsImageModalVisible(false);
                          SelectImage();
                        }}>
                        <Text style={styles.buttonText}>
                          {Localization.t('createRequest.gallery')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.modelItemStyle]}
                        onPress={() => {
                          setIsImageModalVisible(false);
                          TakeImage();
                        }}>
                        <Text style={styles.buttonText}>
                          {Localization.t('createRequest.cameraOption')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </KeyboardAwareScrollView>
          )}
        />
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
        statusBarTranslucent={true}
        onRequestClose={onCancellAudioModal}>
        <View style={[styles.audioWebRadioParentContainer]}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPress={onCancellAudioModal}
          />
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
                onPress={onCancellAudioModal}
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
            {isSendBtnDisable ? (
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity
                  onPressIn={HandlePressIn}
                  onPressOut={HandlePressOut}
                  style={styles.micBtnContainer}>
                  {!isMicAnimationVisible ? (
                    <MicroPhone />
                  ) : (
                    <Image
                      source={require('../../assets/micAnimation.gif')}
                      resizeMode="contain"
                      style={{
                        width: SCREEN_WIDTH * 0.55,
                        height: SCREEN_WIDTH * 0.55,
                      }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            ) : (
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
            )}
            <View style={styles.deleteAndSendContainer}>
              <TouchableOpacity
                disabled={isSendBtnDisable}
                style={[
                  styles.deleteTextContainer,
                  {
                    opacity: isSendBtnDisable ? 0.5 : 1,
                  },
                ]}
                onPress={DeleteIconClick}>
                <DeleteIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={PostVoiceMessage}
                disabled={isSendBtnDisable}
                style={[
                  styles.sendBtnContainer,
                  {
                    backgroundColor: theme.colors.darkCerulean,
                    opacity: isSendBtnDisable ? 0.2 : 1,
                  },
                ]}>
                <Text
                  style={[
                    styles.sendBtnText,
                    {
                      color: theme.colors.primaryWhite,
                      opacity: isSendBtnDisable ? 1 : 0.2,
                    },
                  ]}>
                  {Localization.t('createRequest.sendVoice').toUpperCase()}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category */}
      <Modal
        animationType="slide"
        visible={isCategoryVisibility}
        onRequestClose={() => {
          setIsCategoryVisibility(false);
        }}
        transparent={true}
        statusBarTranslucent={true}>
        <View style={[styles.audioWebRadioParentContainer]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setIsCategoryVisibility(false);
            }}
            style={{flex: 1}}
          />
          <View style={styles.audioModalView}>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <Text style={styles.audioModalTitle}>
                  {Localization.t('createRequest.category')}
                </Text>
                <AntDesign
                  name="closecircle"
                  color={theme.colors.darkCerulean}
                  size={25}
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                  onPress={() => {
                    setIsCategoryVisibility(false);
                  }}
                />
              </View>

              <FlatList
                data={categoryList}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                centerContent={true}
                contentContainerStyle={[
                  styles.modalContainer,
                  {marginTop: SCREEN_HEIGHT * 0.02},
                ]}
                renderItem={CategoryRenderItem}
                keyExtractor={(item, index) => 'key' + index}
                ListEmptyComponent={() => (
                  <View>
                    <Text style={styles.emptyText}>
                      {Localization.t('common.emptyData')}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Object */}
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isObjectModalVisibility}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setIsObjectModalVisibility(false);
        }}>
        <View style={[styles.audioWebRadioParentContainer]}>
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              setIsObjectModalVisibility(false);
            }}
          />
          <View style={styles.audioModalView}>
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <Text style={[styles.audioModalTitle]}>
                  {Localization.t('createRequest.object')}
                </Text>
                <AntDesign
                  name="closecircle"
                  color={theme.colors.darkCerulean}
                  size={25}
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                  onPress={() => {
                    setIsObjectModalVisibility(false);
                  }}
                />
              </View>
              <FlatList
                data={objectList}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                numColumns={3}
                centerContent={true}
                contentContainerStyle={[
                  styles.modalContainer,
                  {marginTop: SCREEN_HEIGHT * 0.02},
                ]}
                renderItem={ObjectRenderItem}
                keyExtractor={(item, index) => 'key' + index}
                ListEmptyComponent={() => (
                  <View>
                    <Text style={styles.emptyText}>
                      {Localization.t('common.emptyData')}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CreateRequestScreen;

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
      // flexDirection: 'column-reverse',
    },
    buttonText: {
      alignSelf: 'center',
      color: theme.colors.darkCerulean,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(14, 812),
      textAlignVertical: 'center',
    },
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: 30,
      opacity: 0.5,
    },
    belowThreeSParentView: {
      alignItems: 'stretch',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SCREEN_HEIGHT * 0.042,
    },
    belowThreeViewContainer: {
      backgroundColor: theme.colors.primaryWhite,
      height: SCREEN_HEIGHT * 0.15,
      width: SCREEN_WIDTH * 0.28,
      justifyContent: 'center',
    },
    buttonView: {
      backgroundColor: theme.colors.yellow,
      justifyContent: 'center',
      height: SCREEN_HEIGHT * 0.08,
      marginHorizontal: 20,
      marginBottom: SCREEN_HEIGHT * 0.1,
      paddingVertical: SCREEN_HEIGHT * 0.02,
    },
    buttonTextContainer: {
      alignSelf: 'center',
      color: theme.colors.darkCerulean,
      fontFamily: FONTS.Montserrat_Bold,
      fontSize: RFValue(18, 812),
      justifyContent: 'center',
    },
    categoryParentView: {
      backgroundColor: theme.colors.primaryWhite,
      height: SCREEN_HEIGHT * 0.19,
      padding: SCREEN_WIDTH * 0.02,
      width: '48%',
    },
    categoryTouchable: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      borderRadius: SCREEN_WIDTH * 0.06,
      justifyContent: 'center',
      height: SCREEN_WIDTH * 0.12,
      width: SCREEN_WIDTH * 0.12,
    },
    circleView: {
      alignItems: 'center',
      borderRadius: SCREEN_WIDTH * 0.05,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      width: SCREEN_WIDTH * 0.1,
    },
    deleteAndSendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: SCREEN_HEIGHT * 0.061,
      width: '100%',
    },
    deleteTextContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '10%',
    },
    emptyText: {
      alignSelf: 'center',
      color: theme.colors.primaryBlack,
      flex: 1,
      height: 60,
      justifyContent: 'center',
      fontSize: RFValue(15, 812),
    },
    gifImageStyle: {
      height: SCREEN_HEIGHT * 0.15,
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
      fontFamily: FONTS.OpenSans_Regular,
      marginTop: 15,
      textAlign: 'center',
    },
    insideView: {
      alignItems: 'center',
      height: '100%',
      paddingTop: SCREEN_HEIGHT * 0.013,
      justifyContent: 'space-evenly',
    },
    objectView: {
      backgroundColor: theme.colors.primaryWhite,
      height: SCREEN_HEIGHT * 0.19,
      padding: SCREEN_WIDTH * 0.02,
      width: '48%',
    },
    objectTouchable: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      borderRadius: SCREEN_WIDTH * 0.06,
      justifyContent: 'center',
      height: SCREEN_WIDTH * 0.12,
      width: SCREEN_WIDTH * 0.12,
    },
    materialIconContainer: {
      alignSelf: 'flex-end',
      position: 'absolute',
      justifyContent: 'flex-end',
    },
    modalImageContainer: {
      alignItems: 'center',
      marginRight: SCREEN_WIDTH * 0.025,
    },
    touchableContainer: {
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 5,
    },
    modalContainer: {
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    modalContainerText: {
      alignSelf: 'center',
      color: theme.colors.lightBlack,
      fontSize: RFValue(14, 812),
      marginTop: SCREEN_HEIGHT * 0.009,
    },
    modalImage: {
      alignSelf: 'flex-start',
      borderColor: 'red',
      height: SCREEN_WIDTH * 0.25,
      width: SCREEN_WIDTH * 0.25,
    },
    modalParentContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      justifyContent: 'center',
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
    materialIcon: {
      flex: 0.1,
      textAlignVertical: 'center',
    },
    modalMainView: {
      alignSelf: 'center',
      backgroundColor: theme.colors.primaryWhite,
      borderRadius: 20,
      elevation: 3,
      justifyContent: 'center',
      padding: 20,
      shadowOffset: {
        height: 2,
        width: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 5,
    },
    modelItemStyle: {
      backgroundColor: theme.colors.yellow,
      borderRadius: 250,
      marginVertical: 10,
      paddingVertical: 17,
      paddingHorizontal: 18,
    },
    sendBtnText: {
      fontSize: RFValue(12, 812),
      textAlign: 'center',
    },
    sendBtnContainer: {
      alignItems: 'center',
      borderRadius: 100,
      justifyContent: 'center',
      paddingVertical: SCREEN_HEIGHT * 0.022,
      width: '65%',
    },
    textInputView: {
      backgroundColor: theme.colors.gray,
      flexDirection: 'row',
      marginTop: SCREEN_HEIGHT * 0.024,
      marginBottom: SCREEN_HEIGHT * 0.003,
    },
    textInputContainer: {
      fontFamily: FONTS.Montserrat_Regular,
      height:
        Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.18 : SCREEN_HEIGHT * 0.18,
      marginLeft: SCREEN_WIDTH * 0.03,
      paddingVertical:
        Platform.OS === 'ios' ? SCREEN_WIDTH * 0.03 : SCREEN_WIDTH * 0.03,
      textAlignVertical: 'top',
      width: '100%',
    },
    textContainer: {
      flex: 0.9,
      justifyContent: 'center',
      textAlignVertical: 'center',
    },
  });

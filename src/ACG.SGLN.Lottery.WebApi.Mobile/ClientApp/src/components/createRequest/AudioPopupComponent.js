/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import PlayIcon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNFetchBlob from 'rn-fetch-blob';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';

import {
  ImageURL,
  ResourceNature,
} from '../../services/serviceHelper/ServiceUtilites';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import DeleteIcon from '../../assets/icon_trash_bin.svg';
import MicroPhone from '../../assets/icon_microphone.svg';
import Localization from '../../localization/Localization';
import {RFValue} from 'react-native-responsive-fontsize';
import {Set_audioData} from '../../redux/audio/audioData-action';
import {AUDIO_DATA_CONSTANT} from '../../redux/audio/audioData-constant';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioPopupComponent = props => {
  console.log('rendering componenet.....');
  const theme = useTheme();
  const styles = useStyles(theme);
  const [isGifVisible, setIsGifVisible] = useState(false);
  const [isMicAnimationVisible, setIsMicAnimationVisible] = useState(false);
  const [isSendBtnDisable, setIsSendBtnDisable] = useState(true);
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    CheckPermissions();
  }, []);

  const [voiceRecord, setVoiceRecord] = useState({
    data: '',
    fileName: '',
  });

  const onCancellAudioModal = () => {
    console.log('testing...');
    // props.setVoiceData(prevState => ({
    //   ...prevState,
    //   fileName: '',
    // }));
    dispatch(Set_audioData(AUDIO_DATA_CONSTANT.SET_AUDIO_DATA, {voiceRecord}));
    props.setAudioData('');
    props.closeClick(false);
    setIsAudioModalVisible(false);
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
          props.setVoiceData(uri);
          dispatch(
            Set_audioData(AUDIO_DATA_CONSTANT.SET_AUDIO_DATA, {voiceRecord}),
          );
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

  const PostVoiceMessage = async () => {
    props.closeClick(false);
    props.setAudioData(props.audioURI);
  };

  const DeleteIconClick = async () => {
    setIsSendBtnDisable(true);
    await audioRecorderPlayer.stopPlayer();
    props.setAudioData('');
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

  const HandlePressIn = () => {
    Vibration.vibrate(Platform.OS === 'android' ? 10 : [2], false);
    setIsMicAnimationVisible(true);
    OnStartRecording();
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
        props.setVoiceData({
          data: data,
          fileName: filename,
        });
        dispatch(
          Set_audioData(AUDIO_DATA_CONSTANT.SET_AUDIO_DATA, {voiceRecord}),
        );
      })

      .catch(err => {
        console.debug('WE GOT ERROR  =======  ', err);
      });
  };

  const OnStopRecord = async () => {
    try {
      // console.info('IN ONSTOP');
      const result = await audioRecorderPlayer.stopRecorder();
      await audioRecorderPlayer.removeRecordBackListener();
      if (result !== 'Already stopped') {
        props.setAudioData(result);
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

  const OnStartPlay = async () => {
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'voice.m4a',
      android: `${dirs.CacheDir}/voice.mp3`,
    });
    const msg = await audioRecorderPlayer.startPlayer(props.audioURI);
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

  function MillesToMinutesAndSeconds(milles) {
    var minutes = Math.floor(milles / 60000);
    var seconds = ((milles % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  const HandlePressOut = () => {
    setIsMicAnimationVisible(false);
    OnStopRecord();
  };

  const PauseClick = () => {
    OnPausePlayer();
    setIsPlaying(false);
  };

  const PlayClick = () => {
    OnStartPlay();
    setIsPlaying(true);
    setIsGifVisible(true);
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

  return (
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
  );
};

export default AudioPopupComponent;

const useStyles = theme =>
  StyleSheet.create({
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
    audioModalView: {
      backgroundColor: theme.colors.yellow,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      height: '60%',
      padding: 20,
    },
    audioWebRadioParentContainer: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      flex: 1,
      // flexDirection: 'column-reverse',
    },
    deleteTextContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '10%',
    },
    deleteAndSendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: SCREEN_HEIGHT * 0.061,
      width: '100%',
    },
    gifImageStyle: {
      height: SCREEN_HEIGHT * 0.15,
      width: SCREEN_WIDTH * 0.75,
    },
    holdText: {
      color: theme.colors.AliceGray,
      fontSize: RFValue(12, 812),
      fontFamily: FONTS.OpenSans_Regular,
      marginTop: 15,
      textAlign: 'center',
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
  });

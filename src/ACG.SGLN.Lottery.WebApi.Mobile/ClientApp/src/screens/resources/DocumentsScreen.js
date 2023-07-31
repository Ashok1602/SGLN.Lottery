/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  Modal,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {useDispatch} from 'react-redux';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SearchBarComponent from '../../components/training/SearchBarComponent';
import Loader from '../../components/customs/Loader';
import {showToast} from '../../components/customs/Toast';
import Localization from '../../localization/Localization';
import {SCREEN_HEIGHT, SCREEN_WIDTH, FONTS} from '../../styles/StyleConstant';
import {changeColor} from '../../redux/bottomTab/changeColorOfTab-action';
import {CHANGE_COLOR_CONST} from '../../redux/bottomTab/changeColor-constant';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {GetDocs} from '../../services/resource/OfficialDocsApi';
import {ImageURL} from '../../services/serviceHelper/ServiceUtilites';

const DocumentsScreen = props => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const dispatch = useDispatch();

  let headerData = [
    {name: 'Documents', type: 'OfficialDocument'},
    {name: 'Ressources', type: 'OfficialRessource'},
  ];

  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [listData, setListData] = useState([]);
  const [prevListData, setprevListData] = useState(listData);
  const [searchData, setSearchData] = useState('');
  const [selectedTab, setSelectedTab] = useState('Documents');

  useFocusEffect(
    useCallback(() => {
      dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 6));
    }, []),
  );

  useEffect(() => {
    dispatch(handleCardTap('Documents'));
  }, []);

  useEffect(() => {
    if (searchData !== '') {
      let text = searchData.trim();
      let filteredList = prevListData.filter(item => {
        if (item.title.toUpperCase().match(text.toUpperCase())) return item;
      });
      setListData([]);
      setListData(filteredList);
    }
    if (searchData === '' || !searchData) {
      setListData(prevListData);
    }
  }, [searchData]);

  const handleCardTap = type => async () => {
    setSelectedTab(type === 'Documents' ? 'Documents' : 'Ressources');
    if (NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisible(true);
      const res = await GetDocs(
        type === 'Documents' ? 'OfficialDocument' : 'OfficialRessource',
      );
      if (res.isSuccess) {
        setIsLoaderVisible(false);
        setListData(res.data.results);
        setprevListData(res.data.results);
      } else {
        setIsLoaderVisible(false);
      }
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const HandleDocumentTapped = item => () => {
    if (item.id) {
      const url = `${ImageURL}${
        selectedTab === 'Documents' ? 'OfficialDocument' : 'OfficialRessource'
      }${'/'}${item.id}`;
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

  const renderList = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          style={styles.listCard}
          onPress={HandleDocumentTapped(item)}>
          <View style={styles.listCardSubContainer}>
            <Ionicons
              name="document"
              color={theme.colors.yellow}
              size={SCREEN_WIDTH * 0.09}
              style={{marginRight: SCREEN_WIDTH * 0.029}}
            />
            <View style={{width: '50%'}}>
              <Text style={styles.listCardTitleText}>{item.title}</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.listCardDateText}>
                {' '}
                {Localization.t('resources.postedOn')}{' '}
                {moment(new Date(item.created)).format('DD/MM/YYYY')}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundImage.png')}
      style={{
        width: '100%',
        height: '100%',
      }}>
      <View style={styles.mainContainer}>
        <Text style={styles.headerTitle}>
          {Localization.t('documents.docTitle')}
        </Text>
        <Text style={styles.belowTitle}>
          {Localization.t('documents.docSubTitle')}
        </Text>
        {/* Formation section */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[
              styles.headerCardStyle,
              {
                backgroundColor:
                  selectedTab === 'Documents'
                    ? theme.colors.yellow
                    : theme.colors.primaryWhite,
              },
            ]}
            onPress={handleCardTap('Documents')}>
            <Text style={styles.headerCardText}>{headerData[0].name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCardTap('Ressources')}
            style={[
              styles.headerCardStyle,
              {
                backgroundColor:
                  selectedTab === 'Ressources'
                    ? theme.colors.yellow
                    : theme.colors.primaryWhite,
              },
            ]}>
            <Text style={styles.headerCardText}>{headerData[1].name}</Text>
          </TouchableOpacity>
        </View>
        <SearchBarComponent searchValue={setSearchData} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listData}
          renderItem={renderList}
          keyExtractor={item => item.id}
          ListFooterComponent={() => {
            return <View style={{height: 60}} />;
          }}
        />
      </View>
      <Modal
        visible={isLoaderVisible}
        transparent={true}
        statusBarTranslucent={true}>
        <Loader />
      </Modal>
    </ImageBackground>
  );
};

export default DocumentsScreen;

const useStyles = theme =>
  StyleSheet.create({
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: 40,
      opacity: 0.5,
    },
    cardContainer: {flexDirection: 'row', justifyContent: 'space-between'},

    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
      marginTop: SCREEN_HEIGHT * 0.02,
      textAlign: 'center',
    },
    headerCardStyle: {
      alignItems: 'center',
      backgroundColor: theme.colors.primaryWhite,
      height: SCREEN_HEIGHT * 0.139,
      justifyContent: 'center',
      width: '48%',
    },
    headerCardText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(16, 830),
    },
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
    mainContainer: {
      flex: 1,
      paddingHorizontal: SCREEN_HEIGHT * 0.028,
    },
  });

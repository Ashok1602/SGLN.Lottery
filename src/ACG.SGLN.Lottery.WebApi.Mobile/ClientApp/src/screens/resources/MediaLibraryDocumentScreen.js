/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  ImageBackground,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';

import SearchBarComponent from '../../components/training/SearchBarComponent';
import DocumentComponent from '../../components/resource/DocumentComponent';
import Loader from '../../components/customs/Loader';
import Localization from '../../localization/Localization';
import {SCREEN_HEIGHT, FONTS} from '../../styles/StyleConstant';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {GetAllTrainingData} from '../../services/training/GetAllDataApi';
import {MediaLibraryDocument} from '../../services/serviceHelper/ServiceUtilites';

const MediaLibraryDocumentScreen = props => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const dispatch = useDispatch();

  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [listData, setListData] = useState([]);
  const [prevListData, setprevListData] = useState(listData);
  const [searchData, setSearchData] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await handleCardTap();
    setRefreshing(false);
  };

  const handleCardTap = type => async () => {
    if (NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisible(true);
      const res = await GetAllTrainingData(
        null,
        null,
        null,
        null,
        MediaLibraryDocument,
      );
      if (res.isSuccess) {
        setIsLoaderVisible(false);
        setListData(res.data);
        setprevListData(res.data);
      } else {
        setIsLoaderVisible(false);
      }
    } else {
    }
  };

  const renderList = ({item, index}) => {
    return <DocumentComponent customProps={props} data={item} />;
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={{
        width: '100%',
        height: '100%',
      }}>
      <View style={styles.mainContainer}>
        <Text numberOfLines={2} style={styles.headerTitle}>
          {Localization.t('documents.mediaLibraryTitle')}
        </Text>
        <Text numberOfLines={1} style={styles.belowTitle}>
          {Localization.t('documents.docSubTitle')}
        </Text>
        {/* Formation section */}
        <SearchBarComponent searchValue={setSearchData} />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listData}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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

export default MediaLibraryDocumentScreen;

const useStyles = theme =>
  StyleSheet.create({
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: 30,
      opacity: 0.5,
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
      marginTop: SCREEN_HEIGHT * 0.02,
      textAlign: 'center',
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: SCREEN_HEIGHT * 0.028,
    },
  });

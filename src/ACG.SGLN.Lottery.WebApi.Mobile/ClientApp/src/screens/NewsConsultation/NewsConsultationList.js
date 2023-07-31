/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';

import Loader from '../../components/customs/Loader';
import {showToast} from '../../components/customs/Toast';
import {getAnnoucements} from '../../services/newsConsultation/GetNewsList';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import Localization from '../../localization/Localization';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';
import {CHANGE_COLOR_CONST} from '../../redux/bottomTab/changeColor-constant';
import {changeColor} from '../../redux/bottomTab/changeColorOfTab-action';
import {ImageURL} from '../../services/serviceHelper/ServiceUtilites';

const NewsConsultationList = props => {
  const [newsList, setNewsList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);

  const theme = useTheme();
  const styles = useStyle(theme);
  const dispatch = useDispatch();

  useEffect(() => {
    callApi();
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 7));
    }, []),
  );

  const callApi = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisible(true);
      const response = await getAnnoucements(pageCount, 10);
      if (response.isSuccess) {
        setIsLoaderVisible(false);
        setNewsList(response.data.results);
      } else {
        setIsLoaderVisible(false);
      }
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await callApi();
    setRefreshing(false);
  };

  const onReachEnd = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      const response = await getAnnoucements(pageCount + 1, 10);
      if (response.isSuccess) {
        setNewsList(newsList.concat(response.data.results));
      }
      setPageCount(pageCount + 1);
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 2000);
    }
  };

  const handleNavigation = item => async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      props.navigation.navigate('AnnoucementsDetails', {data: item});
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 2000);
    }
  };

  const renderList = ({item, index}) => {
    return (
      <>
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={handleNavigation(item)}>
            <Image
              style={styles.imageStyle}
              source={{
                uri: `${ImageURL}AnnouncementCoverPicture/${item.id}`,
              }}
            />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{item.title}</Text>
          </View>
        </View>
      </>
    );
  };

  const listEmptyComp = () => {
    return (
      <>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {Localization.t('common.noReviewYet')}
          </Text>
        </View>
      </>
    );
  };

  const listFooterComp = () => {
    return <View style={{marginBottom: 50}} />;
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundImage.png')}
      style={{width: '100%', height: '100%'}}>
      <View style={styles.mainContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={newsList}
          renderItem={renderList}
          keyExtractor={index => index.id}
          onEndReached={onReachEnd}
          ListEmptyComponent={listEmptyComp}
          ListFooterComponent={listFooterComp}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <Modal
          transparent={true}
          statusBarTranslucent={true}
          visible={isLoaderVisible}>
          <Loader />
        </Modal>
      </View>
    </ImageBackground>
  );
};

export default NewsConsultationList;

const useStyle = theme =>
  StyleSheet.create({
    cardContainer: {marginVertical: 10},
    imageStyle: {height: SCREEN_HEIGHT * 0.21, width: '100%'},
    mainContainer: {
      paddingHorizontal: SCREEN_WIDTH * 0.04,
      flex: 1,
    },
    noDataText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Medium,
      textAlign: 'justify',
    },
    noDataContainer: {
      alignItems: 'center',
      flex: 1,
      height: SCREEN_HEIGHT,
      justifyContent: 'center',
    },
    titleContainer: {
      marginTop: 5,
      width: '90%',
    },
    titleText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Medium,
      textAlign: 'justify',
      textTransform: 'uppercase',
    },
  });

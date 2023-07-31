/* eslint-disable prettier/prettier */
import React, {useEffect, useState, useCallback} from 'react';
import {
  BackHandler,
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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useRoute, useTheme, useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../../components/customs/Loader';
import Localization from '../../localization/Localization';
import BottomNavigation from '../../navigation/BottomNavigation';
import DrawerNavigation from '../../navigation/DrawerNavigation';
import {changeColor} from '../../redux/bottomTab/changeColorOfTab-action';
import {CHANGE_COLOR_CONST} from '../../redux/bottomTab/changeColor-constant';
import {
  ImageURL,
  ResourceNature,
} from '../../services/serviceHelper/ServiceUtilites';
import {SCREEN_HEIGHT, SCREEN_WIDTH, FONTS} from '../../styles/StyleConstant';
import {GetAllRequestData} from '../../services/requestClient/RequestAllList';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {AXIOS_INSTANCE} from '../../services/serviceHelper/Config';
import {statusRequest} from '../../utils/constants/constants';
import {showToast} from '../../components/customs/Toast';

const RequestListScreen = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  //UseStates
  const [isLogged, setIsLogged] = useState(false);
  const [isLoaderVisibility, setIsLoaderVisibility] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [isSort, setIsSort] = useState(true);
  //Dispatch
  const dispatch = useDispatch();

  const requestSelector = useSelector(state => state.RequestAll);

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 2));
      const onBackPress = () => {
        if (route.name === 'RequestListScreen') {
          BackHandler.exitApp();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [route]),
  );

  useEffect(async () => {
    setIsSort(true);
    setIsLoaderVisibility(true);
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 2));
    var value = await AsyncStorage.getItem('bearerToken');
    if (value !== null) {
      AXIOS_INSTANCE.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${value}`;
    }
    await callGetAllAPi();
  }, []);

  const callGetAllAPi = async () => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        var value = await AsyncStorage.getItem('bearerToken');
        if (value !== null) {
          AXIOS_INSTANCE.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${value}`;
        }
        setIsLoaderVisibility(true);
        dispatch(GetAllRequestData());
      } else {
        showToast(Localization.t('comman.noInternet'), 'bottom', 'error', 500);
      }
    } catch (e) {
      console.log(e + 'error.....');
    }
  };

  useEffect(() => {
    if (requestSelector.GetRequestSuccess) {
      ResponseMethod(requestSelector.GetRequestSuccess.response);
    }
    if (requestSelector.GetRequestFail) {
      setIsLoaderVisibility(false);
      setRequestList([]);
    }
  }, [requestSelector]);

  const ResponseMethod = async response => {
    setIsLoaderVisibility(false);
    var resourceValue = await AsyncStorage.getItem('resource');
    if (resourceValue !== null) {
      let resourceData = JSON.parse(resourceValue);
      const statusResource = resourceData.RequestStatusType;
      const category = resourceData.RequestCategoryType;
      const list = response.data.results.map(item => {
        return {
          ...item,
          status: item.lastStatus,
          lastStatus: statusResource[item.lastStatus],
          requestCategory: category[item.requestCategory],
        };
      });
      setRequestList(list);
    } else {
      setRequestList(response.data.results);
    }
  };

  const CreateRequest = () => {
    props.navigation.navigate('CreateRequestScreen', {data: true});
  };

  const StatusColorChange = item => {
    let status = item.status != null ? item.status : item.lastStatus;
    switch (status.toLowerCase()) {
      case statusRequest.Submitted:
        return '#000000';
        break;
      case statusRequest.InProgress:
        return '#00ee';
        break;
      case statusRequest.Closed:
        return '#ff0000';
        break;
      case statusRequest.Contested:
        return '#00ff';
        break;
      default:
        return '#ff00ef';
        break;
    }
  };

  const SortingList = () => {
    setIsSort(!isSort);
    if (isSort) {
      const sorter = (a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      };
      requestList.sort(sorter);
    } else {
      const sorter1 = (a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      };
      requestList.sort(sorter1);
    }
  };

  const ObjectName = object => {
    if (object) {
      const value = object.substring(
        object.lastIndexOf('|') + 1,
        object.length,
      );
      return value;
    }
  };

  const ItemTapped = item => () => {
    props.navigation.navigate('DetailsRequestScreen', {data: item});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await callGetAllAPi();
    setRefreshing(false);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={ItemTapped(item)}>
        <View style={styles.flatListItemView}>
          <View style={styles.itemCircle}>
            <Image
              source={{
                uri: `${ImageURL}${ResourceNature}${'/'}${item.requestNature}`,
              }}
              resizeMode="stretch"
              borderRadius={15}
              style={{
                width: SCREEN_WIDTH * 0.1,
                height: SCREEN_WIDTH * 0.1,
              }}
            />
          </View>
          <View style={styles.categoryView}>
            <View style={{width: '75%', marginRight: '3%'}}>
              <Text numberOfLines={1} style={styles.categoryText}>
                {item.requestCategory}
              </Text>
              <Text numberOfLines={1} style={styles.objectText}>
                {ObjectName(item.requestObject)}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: StatusColorChange(item),
                flex: 1,
                fontFamily: FONTS.OpenSans_Bold,
              }}>
              {item.lastStatus}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {isLogged && <DrawerNavigation />}
      <ImageBackground
        source={require('../../assets/backgroundImage.png')}
        style={{width: '100%', height: '100%'}}>
        <View style={styles.mainContainer}>
          <Text style={styles.headerTitle}>
            {Localization.t('createRequest.requestTitle')}
          </Text>
          <Text style={styles.belowTitle}>
            {Localization.t('createRequest.requestTitleBelow')}
          </Text>
          <View style={styles.parentRightView}>
            <TouchableOpacity style={styles.circleView}>
              {isSort ? (
                <FontAwesome5
                  onPress={SortingList}
                  name="sort-amount-down-alt"
                  color={theme.colors.darkCerulean}
                  size={20}
                />
              ) : (
                <FontAwesome5
                  onPress={SortingList}
                  name="sort-amount-up"
                  color={theme.colors.darkCerulean}
                  size={20}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleView}>
              <FontAwesome
                name="filter"
                color={theme.colors.darkCerulean}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bouncesZoom={false}
            keyExtractor={(item, index) => 'key' + index}
            data={requestList}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={() => {
              return <View style={{marginBottom: 60}}></View>;
            }}
            ListEmptyComponent={() => (
              <View>
                <Text style={[styles.emptyText]}>
                  {Localization.t('common.emptyData')}
                </Text>
              </View>
            )}
          />
        </View>
        <View style={styles.addContainer}>
          <TouchableOpacity onPress={CreateRequest} style={styles.createImage}>
            <SimpleLineIcons
              name="pencil"
              color={theme.colors.licorice}
              size={16}
              style={{marginRight: 5}}
            />
            <Text
              style={{
                fontFamily: FONTS.Montserrat_SemiBold,
                fontSize: RFValue(14, 830),
                color: theme.colors.licorice,
              }}>
              Nouvelle demande
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {isLogged && <BottomNavigation customProps={props} />}
      {/* Loader */}
      <Modal
        animationType={'fade'}
        statusBarTranslucent={true}
        transparent={true}
        visible={isLoaderVisibility}>
        <Loader />
      </Modal>
    </>
  );
};

export default RequestListScreen;

const useStyles = theme =>
  StyleSheet.create({
    addContainer: {
      alignItems: 'flex-end',
      bottom: SCREEN_HEIGHT * 0.11,
      justifyContent: 'flex-end',
      position: 'absolute',
      right: 20,
    },
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: 10,
      opacity: 0.5,
    },
    categoryView: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'center',
    },
    categoryText: {
      flex: 1.2,
      fontFamily: FONTS.OpenSans_Bold,
      color: theme.colors.licorice,
      marginLeft: SCREEN_WIDTH * 0.015,
    },
    circleView: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      borderRadius: SCREEN_WIDTH * 0.048,
      height: SCREEN_WIDTH * 0.097,
      justifyContent: 'center',
      marginRight: SCREEN_WIDTH * 0.03,
      width: SCREEN_WIDTH * 0.097,
    },
    createImage: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      borderRadius: SCREEN_WIDTH * 0.085,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      marginRight: SCREEN_WIDTH * 0.03,
      // width: SCREEN_WIDTH * 0.17,
      paddingHorizontal: 10,
      flexDirection: 'row',
    },
    emptyText: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      flex: 1,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Medium,
    },
    flatListItemView: {
      backgroundColor: theme.colors.primaryWhite,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SCREEN_HEIGHT * 0.017,
      paddingVertical: SCREEN_HEIGHT * 0.02,
      paddingHorizontal: SCREEN_WIDTH * 0.02,
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
    },
    itemCircle: {
      alignItems: 'center',
      backgroundColor: '#eeedf2',
      borderRadius: SCREEN_WIDTH * 0.05,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      //marginRight: SCREEN_WIDTH * 0.019,
      width: SCREEN_WIDTH * 0.1,
    },
    objectText: {
      color: theme.colors.licorice,
      flex: 0.8,
      fontFamily: FONTS.OpenSans_Regular,
      marginRight: 5,
      marginLeft: SCREEN_WIDTH * 0.015,
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: SCREEN_HEIGHT * 0.028,
    },
    parentRightView: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: SCREEN_HEIGHT * 0.015,
    },
  });

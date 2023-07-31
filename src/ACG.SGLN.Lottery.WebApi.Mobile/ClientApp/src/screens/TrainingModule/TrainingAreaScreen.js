/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {
  ImageBackground,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TrainingComponent from '../../components/training/TrainingComponent';
import YouTubeComponent from '../../components/training/YouTubeComponent';
import SearchBarComponent from '../../components/training/SearchBarComponent';
import DocumentDistanceComponent from '../../components/training/DocumentDistanceComponent';
import DistanceYoutubeComponent from '../../components/training/DistanceYoutubeComponent';
import Loader from '../../components/customs/Loader';
import Localization from '../../localization/Localization';
import {SCREEN_HEIGHT, SCREEN_WIDTH, FONTS} from '../../styles/StyleConstant';
import {GetAllTrainingData} from '../../services/training/GetAllDataApi';
import {changeColor} from '../../redux/bottomTab/changeColorOfTab-action';
import {CHANGE_COLOR_CONST} from '../../redux/bottomTab/changeColor-constant';
import {GetAllModules} from '../../services/training/GetAllModules';
import IntModuleCardComp from '../../components/training/IntModuleCardComp';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {Set_ModuleDetails_Success} from '../../redux/interactiveTraining/InteractiveTraining-action';
import {INT_FORMATION_DETAILS_CONST} from '../../redux/interactiveTraining/InteractiveTraining-constant';
import {showToast} from '../../components/customs/Toast';

const TrainingAreaScreen = props => {
  const theme = useTheme();
  const styles = useStyles(theme);
  const dispatch = useDispatch();

  let areaData = [
    {name: 'Formation', type: 'Video'},
    {name: 'Formations à distance', type: 'Live'},
    {name: 'Formations intéractives', type: 'Interactive'},
  ];

  //Nature type states
  const [trainingData, setTrainingData] = useState({});
  const [selectedFormationIndex, setSelectedFormationIndex] = useState(-1);
  const [isLoaderVisibility, setIsLoaderVisibility] = useState(false);
  const [trainingList, setTrainingList] = useState([]);
  const [trainingListByIntModule, settrainingListByIntModule] = useState([]);
  const [trainingListByIntModuleCopy, settrainingListByIntModuleCopy] =
    useState([]);
  const [searchTrainingList, setSearchTrainingList] = useState([]);
  const [type, setType] = useState('');
  const [searchData, setSearchData] = useState('');
  const [moduleSearchData, setModuleSearchData] = useState('');
  const [selectStatus, setSelectStatus] = useState(0);
  const [upcoming, setUpcoming] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [all, setAll] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedModuleId, setselectedModuleId] = useState(null);
  const [selectedModuleName, setSelectedModuleName] = useState(null);

  useEffect(() => {
    if (type == undefined || type === '') {
      GetTrainingDataApi(null, null, null, null, areaData[0].type);
      setType('Video');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 9));
    }, []),
  );

  useEffect(() => {
    const ac = new AbortController();
    if (Object.keys(trainingData).length !== 0) {
      setType(trainingData.type);
      if (trainingData.type === areaData[1].type) {
        GetTrainingDataApi(null, null, null, null, areaData[1].type);
      } else if (trainingData.type === areaData[2].type) {
        // GetTrainingDataApi(null, null, null, null, areaData[2].type);
        GetModulesForIntTraining();
      } else {
        GetTrainingDataApi(null, null, null, null, areaData[0].type);
      }
    }
    return () => ac.abort();
  }, [trainingData]);

  useEffect(() => {
    if (searchData !== '') {
      let text = searchData.trim();
      let filteredList = searchTrainingList.filter(item => {
        if (
          item.title != null &&
          item.title.toUpperCase().match(text.toUpperCase())
        )
          return item;
      });
      setTrainingList([]);
      setTrainingList(filteredList);
    }
    if (searchData === '') {
      setTrainingList(searchTrainingList);
    }
  }, [searchData]);

  useEffect(() => {
    if (moduleSearchData !== '') {
      let text = moduleSearchData.trim();
      let filteredList = trainingListByIntModuleCopy.filter(item => {
        if (
          item.title != null &&
          item.title.toUpperCase().match(text.toUpperCase())
        )
          return item;
      });
      settrainingListByIntModule([]);
      settrainingListByIntModule(filteredList);
    }
    if (moduleSearchData === '') {
      settrainingListByIntModule(trainingListByIntModuleCopy);
    }
  }, [moduleSearchData]);

  useEffect(() => {
    return () => {
      removeModuleID();
    };
  }, []);

  const removeModuleID = async () => {
    await AsyncStorage.removeItem('moduleID');
  };

  const GetModulesForIntTraining = async () => {
    // console.log('calling api' + trainingType);
    try {
      setIsLoaderVisibility(true);
      const response = await GetAllModules();
      if (response.isSuccess) {
        setIsLoaderVisibility(false);
        setTrainingList(response.data);
      } else {
        setTrainingList([]);
        setIsLoaderVisibility(false);
      }
    } catch (err) {
      setTrainingList([]);
      setIsLoaderVisibility(false);
      console.log(err);
    }
  };
  const GetTrainingDataApi = async (
    minStartDate,
    maxStartDate,
    maxEndDate,
    minEndDate,
    trainingType,
  ) => {
    console.log('calling api' + trainingType);
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        setIsLoaderVisibility(true);
        const response = await GetAllTrainingData(
          minStartDate,
          maxStartDate,
          maxEndDate,
          minEndDate,
          trainingType,
        );
        if (response.isSuccess) {
          setIsLoaderVisibility(false);
          setTrainingList(response.data);
          let list = response.data;
          setSearchTrainingList(list);
          if (list != null) {
            let upcoming = list.filter(a => new Date(a.startDate) > new Date());
            setUpcoming(upcoming.length);
            let completed = list.filter(a => new Date(a.endDate) < new Date());
            setCompleted(completed.length);
            let all = upcoming.length + completed.length;
            setAll(all);
            console.log(all + 'checking.....');
          }
        } else {
          setTrainingList([]);
          setIsLoaderVisibility(false);
        }
      } else
        showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    } catch (err) {
      setTrainingList([]);
      setIsLoaderVisibility(false);
      console.log(err);
    }
  };

  const renderItem = ({item, index}) => {
    return <YouTubeComponent customProps={props} data={item} />;
  };

  const distanceRenderItem = ({item, index}) => {
    //All tapped
    if (selectStatus === 0) {
      return (
        <>
          {all <= 0 ? (
            <View>
              <Text style={styles.emptyText}>
                {Localization.t('common.emptyData')}
              </Text>
            </View>
          ) : (
            <>
              {new Date(item.startDate) > new Date() && (
                <DistanceYoutubeComponent customProps={props} data={item} />
              )}
              {new Date(item.endDate) < new Date() && (
                <DocumentDistanceComponent customProps={props} data={item} />
              )}
            </>
          )}
        </>
      );
    }
    //Folder
    if (selectStatus === 2) {
      return (
        <>
          <DocumentDistanceComponent customProps={props} data={item} />
        </>
      );
    }
    //Youtube
    if (selectStatus === 1) {
      return (
        <>
          <DistanceYoutubeComponent customProps={props} data={item} />
        </>
      );
    }
  };

  const handleFormationEscapModule = (item, index) => async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      await AsyncStorage.removeItem('moduleID');
      await AsyncStorage.setItem('moduleID', item.id);
      setselectedModuleId(item.id);
      setSelectedModuleName(item.title);
      dispatch(
        Set_ModuleDetails_Success(
          INT_FORMATION_DETAILS_CONST.SET_FORMATION_DETAILS_SUCCESS,
          item.title,
        ),
      );
      setSelectedFormationIndex(index);
      setIsLoaderVisibility(true);
      const res = await GetAllTrainingData(
        null,
        null,
        null,
        null,
        areaData[2].type,
        item.id,
      );
      if (res.isSuccess) {
        setIsLoaderVisibility(false);
        settrainingListByIntModule(res.data);
        settrainingListByIntModuleCopy(res.data);
      }
      setIsLoaderVisibility(false);
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const renderInteractiveModules = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={handleFormationEscapModule(item, index)}
        style={[
          {
            backgroundColor:
              selectedFormationIndex === index
                ? theme.colors.yellow
                : theme.colors.cobalt,
          },
          styles.interactiveModuleContainer,
        ]}>
        <Text
          // numberOfLines={4}
          style={[
            {
              color:
                selectedFormationIndex === index
                  ? theme.colors.licorice
                  : theme.colors.primaryWhite,
            },
            styles.interactiveModuleTitleText,
          ]}>
          {item.title}
        </Text>
        <View
          style={[
            {
              backgroundColor:
                selectedFormationIndex === index
                  ? theme.colors.greyishYellow
                  : theme.colors.blackishBlue,
            },
            styles.interactiveModuleBottomContainer,
          ]}>
          <Text
            style={[
              {
                color:
                  selectedFormationIndex === index
                    ? theme.colors.lightCobalt
                    : theme.colors.yellow,
              },
              styles.interactiveModuleBottomText,
            ]}>
            {item.countTrainings} Formation
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useFocusEffect(
    useCallback(() => {
      onRefresh();
    }, []),
  );

  const onRefresh = async () => {
    const id = await AsyncStorage.getItem('moduleID');
    if (!id) return;
    setRefreshing(true);
    setselectedModuleId(id);
    const res = await GetAllTrainingData(
      null,
      null,
      null,
      null,
      areaData[2].type,
      id,
    );
    if (res.isSuccess) {
      settrainingListByIntModule(res.data);
      settrainingListByIntModuleCopy(res.data);
    }
    setRefreshing(false);
  };

  const UpcomingStateTapped = () => {
    setIsSearch(true);
    let upcoming = searchTrainingList.filter(
      a => new Date(a.startDate) > new Date(),
    );
    setTrainingList(upcoming);
    setSelectStatus(1);
  };

  const CompletedTapped = () => {
    setIsSearch(true);
    setSelectStatus(2);
    let completed = searchTrainingList.filter(
      a => new Date(a.endDate) < new Date(),
    );
    setTrainingList(completed);
  };

  const AllTapped = () => {
    setIsSearch(true);
    setSelectStatus(0);

    setTrainingList(searchTrainingList);
  };

  const IntTrainingCard = ({item, index}) => {
    return <IntModuleCardComp customProps={props} data={item} />;
  };

  return (
    <ImageBackground
      source={require('../../assets/backgroundImage.png')}
      style={{width: '100%', height: '100%'}}>
      <View style={styles.mainContainer}>
        <Text style={styles.headerTitle}>
          {Localization.t('training.trainingTitle')}
        </Text>
        <Text style={styles.belowTitle}>
          {Localization.t('training.traingingSubTitle')}
        </Text>
        <TrainingComponent selectedData={setTrainingData} list={areaData} />
        {/* Formation section */}
        {type === areaData[0].type && (
          <View style={{marginBottom: SCREEN_HEIGHT * 0.45}}>
            <SearchBarComponent searchValue={setSearchData} />
            <FlatList
              data={trainingList}
              scrollEnabled={true}
              keyExtractor={(item, index) => 'key' + index}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View>
                  <Text style={styles.emptyText}>
                    {Localization.t('common.emptyData')}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        {type === areaData[1].type && (
          <View
            style={{
              marginBottom: SCREEN_HEIGHT * 0.52,
              marginTop: SCREEN_HEIGHT * 0.023,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity onPress={UpcomingStateTapped}>
                <View
                  style={[
                    styles.parentView,
                    {
                      backgroundColor:
                        selectStatus === 1
                          ? theme.colors.wedgeWood
                          : theme.colors.cobalt,
                    },
                  ]}>
                  <Text
                    style={{
                      color: theme.colors.primaryWhite,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${'A venir '}${'('}`}</Text>
                  <Text
                    style={{
                      color: theme.colors.yellow,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${upcoming}`}</Text>
                  <Text
                    style={{
                      color: theme.colors.primaryWhite,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${')'}`}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={CompletedTapped}>
                <View
                  style={[
                    styles.parentView,
                    {
                      backgroundColor:
                        selectStatus === 2
                          ? theme.colors.wedgeWood
                          : theme.colors.cobalt,
                    },
                  ]}>
                  <Text
                    style={{
                      color: theme.colors.primaryWhite,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${'Passées '}${'('}`}</Text>
                  <Text
                    style={{
                      color: theme.colors.yellow,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${completed}`}</Text>
                  <Text
                    style={{
                      color: theme.colors.primaryWhite,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${')'}`}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={AllTapped}>
                <View
                  style={[
                    styles.parentView,
                    {
                      backgroundColor:
                        selectStatus === 0
                          ? theme.colors.wedgeWood
                          : theme.colors.cobalt,
                    },
                  ]}>
                  <Text
                    style={{
                      color: theme.colors.primaryWhite,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${'Tous '}${'('}`}</Text>
                  <Text
                    style={{
                      color: theme.colors.yellow,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${all}`}</Text>
                  <Text
                    style={{
                      color: theme.colors.primaryWhite,
                      fontFamily: FONTS.Montserrat_Medium,
                    }}>{`${')'}`}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <SearchBarComponent
              setClear={isSearch}
              searchValue={setSearchData}
            />
            <FlatList
              data={trainingList}
              scrollEnabled={true}
              keyExtractor={(item, index) => 'key' + index}
              renderItem={distanceRenderItem}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View>
                  <Text style={styles.emptyText}>
                    {Localization.t('common.emptyData')}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        {type === areaData[2].type && (
          <View>
            <FlatList
              horizontal={true}
              data={trainingList}
              keyExtractor={item => item.id}
              renderItem={renderInteractiveModules}
              showsHorizontalScrollIndicator={false}
            />
            <SearchBarComponent
              setClear={isSearch}
              searchValue={setModuleSearchData}
            />
            <FlatList
              data={trainingListByIntModule}
              scrollEnabled={true}
              keyExtractor={(item, index) => 'key' + index}
              renderItem={IntTrainingCard}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View>
                  <Text style={styles.emptyText}>
                    {Localization.t('common.emptyData')}
                  </Text>
                </View>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListFooterComponent={() => {
                return <View style={{height: 300, marginBottom: 200}} />;
              }}
            />
          </View>
        )}
      </View>
      <Modal
        animationType={'fade'}
        statusBarTranslucent={true}
        transparent={true}
        visible={isLoaderVisibility}>
        <Loader />
      </Modal>
    </ImageBackground>
  );
};

export default TrainingAreaScreen;

const useStyles = theme =>
  StyleSheet.create({
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: SCREEN_HEIGHT * 0.034,
      opacity: 0.5,
    },
    emptyText: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(15, 812),
      flex: 1,
      fontFamily: FONTS.OpenSans_SemiBold,
      height: 60,
      justifyContent: 'center',
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
    },
    interactiveModuleContainer: {
      height: SCREEN_WIDTH * 0.29,
      marginRight: SCREEN_WIDTH * 0.02,
      paddingTop: SCREEN_HEIGHT * 0.019,
      paddingLeft: SCREEN_WIDTH * 0.025,
      width: SCREEN_WIDTH * 0.29,
    },
    interactiveModuleTitleText: {
      fontSize: RFValue(14, 830),
      fontFamily: FONTS.Montserrat_SemiBold,
      marginBottom: SCREEN_HEIGHT * 0.009,
      // textAlign:'center'
    },
    interactiveModuleDescText: {
      fontSize: RFValue(14, 830),
      fontFamily: FONTS.OpenSans_Regular,
    },
    interactiveModuleBottomContainer: {
      alignItems: 'center',
      bottom: 0,
      height: SCREEN_HEIGHT * 0.028,
      justifyContent: 'center',
      position: 'absolute',
      width: SCREEN_WIDTH * 0.29,
    },
    interactiveModuleBottomText: {
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(12, 830),
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: SCREEN_HEIGHT * 0.028,
      marginTop: SCREEN_HEIGHT * 0.02,
    },
    parentView: {
      alignItems: 'center',
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.065,
      justifyContent: 'center',
      marginRight: 0.04,
      width: SCREEN_WIDTH * 0.29,
    },
  });

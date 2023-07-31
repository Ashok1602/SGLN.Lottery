/* eslint-disable prettier/prettier */
import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BottomNavigation from './BottomNavigation';
import {SCREEN_WIDTH, FONTS, SCREEN_HEIGHT} from '../styles/StyleConstant';
import Localization from '../localization/Localization';
import NewsConsultationList from '../screens/NewsConsultation/NewsConsultationList';
import AnnoucementsDetails from '../screens/NewsConsultation/AnnoucementsDetails';
import RequestListScreen from '../screens/requestModule/RequestListScreen';
import DetailsRequestScreen from '../screens/requestModule/DetailsRequestScreen';
import CreateRequestScreen from '../screens/requestModule/CreateRequestScreen';
import DocumentsScreen from '../screens/resources/DocumentsScreen';
import MediaLibraryDocumentScreen from '../screens/resources/MediaLibraryDocumentScreen';
import LegalConsultationScreen from '../screens/LegalConsultationScreen';
import TrainingAreaScreen from '../screens/TrainingModule/TrainingAreaScreen';
import YouTubeWebScreen from '../screens/TrainingModule/YouTubeWebScreen';
import {handleDrawerVisibility} from '../redux/draweTab/drawer-changeColorOfTab-action';
import {DRAWER_VISIBILITY_CONST} from '../redux/draweTab/drawer-changeColor-constant';
import {useEffect} from 'react';
import {getUserDetails} from '../services/user/GetCurrentUserDetails';
import {GetNotifications} from '../services/Notification/NotificationsApi';
import Loader from '../components/customs/Loader';
import {useState} from 'react';
import NetworkUtils from '../utils/NetInfoHelper/NetInfo';
import {showToast} from '../components/customs/Toast';
import {useSelector} from 'react-redux';
import {GetFirstLetters} from '../utils/commonHelper/CommonHelper';
import {createConnection} from '../utils/DataBaseHelpers/CreateConnection';
import {AXIOS_INSTANCE} from '../services/serviceHelper/Config';
import {DrawerContent} from './DrawerContent';
import {RightDrawerContent} from './RightDrawerContent';
import TrainingSlidesScreen from '../screens/TrainingModule/TrainingSlidesScreen';
import TrainingCompleteScreen from '../screens/TrainingModule/TrainingCompleteScreen';
import QuestionsListScreen from '../screens/TrainingModule/QuestionsListScreen';
import TestCompleteScreen from '../screens/TrainingModule/TestCompleteScreen';
import TestFailedScreen from '../screens/TrainingModule/TestFailedScreen';
import TestSuccessScreen from '../screens/TrainingModule/TestSuccessScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import ChangePassword from '../screens/authentication/ChangePassword'
import InvoiceScreen from '../screens/InvoiceSection/InvoiceScreen';
import IncentiveScreen from '../screens/IncentivesScreen/IncentiveScreen';
import {NOTIFICATION_CONSTANTS} from '../redux/notification/notification-constant';
import {New_Notification} from '../redux/notification/notification-action';

const db = createConnection();

export default function DrawerNavigation(props) {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isLoaderVisible, setisLoaderVisible] = useState(false);
  const [isDrawerPosition, setIsDrawerPosition] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [drawer, setDrawer] = useState(undefined);
  const [isNotification, setIsNotification] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastname: '',
  });
  const Stack = createStackNavigator();
  const theme = useTheme();
  const styles = useStyle(theme);
  const dispatch = useDispatch();
  const CurrentUserDetails = useSelector(state => state.CurrentUserDetails);
  const Notifications = useSelector(state => state.Notification);
  const isDrawerVisible = useSelector(state => state.DrawerReducer);
  const foregroundNotification = useSelector(state => state.NewNotification);

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    if (foregroundNotification.NotificationForeground) {
      if (foregroundNotification.NotificationForeground.data) {
        setIsNotification(true);
        callNotificationApi();
      }
    }
  }, [foregroundNotification]);

  useEffect(() => {
    if (isDrawerVisible.isDrawerVisible) {
      setIsModalVisible(true);
      drawer.openDrawer();
    }
    if (!isDrawerVisible.isDrawerVisible) {
      setIsModalVisible(false);
      drawer ? drawer.closeDrawer() : console.log('No Drawer yet');
    }
  }, [isDrawerVisible]);

  useEffect(() => {
    if (CurrentUserDetails.GetCurrentuserDetailsSuccess) {
      setIsModalVisible(false);
      setUserDetails(prevState => ({
        ...prevState,
        firstName:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .firstName,
        lastname:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .lastName,
      }));
      handleInsertData(
        CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data,
      );
    }
    if (CurrentUserDetails.GetCurrentuserDetailsFail) {
      setIsModalVisible(false);
    }
  }, [CurrentUserDetails]);

  useEffect(() => {
    if (Notifications.GetNotificationSuccess) {
      setNotificationList(Notifications.GetNotificationSuccess.response.data);
      NotificationImage(Notifications.GetNotificationSuccess.response.data[0]);
    }
    if (Notifications.GetNotificationFail) {
      NotificationImage();
      setNotificationList([]);
    }
  }, [Notifications]);

  const NotificationImage = async date => {
    var value = JSON.parse(await AsyncStorage.getItem('notification'));
    if (value !== null) {
      let currentDate = new Date();
      if (new Date(value.lastSeen) !== null && notificationList !== null) {
        date != null &&
        new Date(value.lastSeen) <= currentDate &&
        new Date(value.createdDate).getTime() !=
          new Date(date.created).getTime()
          ? setIsNotification(true)
          : setIsNotification(false);
      } else {
        setIsNotification(false);
      }
    } else {
      setIsNotification(true);
    }
  };

  const callNotificationApi = async () => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        var value = await AsyncStorage.getItem('bearerToken');
        if (value !== null) {
          AXIOS_INSTANCE.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${value}`;
        }
        dispatch(GetNotifications());
      } else {
        showToast(Localization.t('comman.noInternet'), 'bottom', 'error', 500);
      }
    } catch (e) {
      console.log(e + 'error.....');
    }
  };

  const callAPI = async () => {
    try {
      if (await NetworkUtils.isNetworkAvailable()) {
        var value = await AsyncStorage.getItem('bearerToken');
        if (value !== null) {
          AXIOS_INSTANCE.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${value}`;
        }
        await Promise.all([
          dispatch(getUserDetails()),
          dispatch(GetNotifications()),
        ]);
      } else {
        showToast(Localization.t('comman.noInternet'), 'bottom', 'error', 500);
      }
    } catch (e) {
      console.log(e + 'error.....');
    }
  };

  const handleInsertData = async data => {
    var value = await AsyncStorage.getItem('bearerToken');
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='LoggedInUsers'",
        [],
        function (tx, res) {
          if (res.rows.length === 0) {
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS LoggedInUsers(serialNo INTEGER ,user_id VARCHAR(50) PRIMARY KEY , user_firstName VARCHAR(20), user_lastName INT(20), AgentID VARCHAR(50),id VARCHAR(50), phoneNumber VARCHAR(20), email VARCHAR(50), accessToken VARCHAR(7000))',
              [],
            );
            tx.executeSql(
              'INSERT INTO LoggedInUsers (serialNo,user_id, user_firstName, user_lastName, AgentID, id, phoneNumber , email , accessToken ) VALUES (?,?,?,?,?,?,?,?,?)',
              [
                1,
                data.userid,
                data.firstName,
                data.lastName,
                data.agentId,
                data.id,
                data.phone ? data.phone : 'NA',
                data.email ? data.email : 'NA',
                value,
              ],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('Added in DB');
                } else {
                  console.log('NOT ADDED IN DB SOMETHING WENT WRONG');
                }
              },
            );
          } else {
            tx.executeSql(
              'INSERT INTO LoggedInUsers (serialNo,user_id, user_firstName, user_lastName, AgentID, id, phoneNumber , email , accessToken ) VALUES (?,?,?,?,?,?,?,?,?)',
              [
                1,
                data.userid,
                data.firstName,
                data.lastName,
                data.agentId,
                data.id,
                data.phone ? data.phone : 'NA',
                data.email ? data.email : 'NA',
                value,
              ],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.warn('Added in DB');
                } else {
                  console.log('NOT ADDED IN DB SOMETHING WENT WRONG');
                }
              },
            );
          }
        },
      );
    });
  };

  const headerLeftComp = () => {
    return (
      <TouchableOpacity
        style={styles.headerLeftCompStyle}
        onPress={() => {
          drawer.openDrawer();
        }}>
        <Text style={styles.hearderLeftText}>
          {GetFirstLetters(`${userDetails.firstName} ${userDetails.lastname}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  const NotificationIconTapped = () => {
    dispatch(
      New_Notification(NOTIFICATION_CONSTANTS.NEW_NOTIFICATION, {
        data: false,
      }),
    );
    let createdDate, lastSeen;
    setIsNotification(false);
    if (notificationList != null) {
      createdDate = notificationList[0].created;
    }
    lastSeen = new Date();
    const data = {
      lastSeen: lastSeen,
      createdDate: createdDate,
    };
    AsyncStorage.setItem('notification', JSON.stringify(data));
    if (isDrawerPosition) {
      setIsDrawerPosition(false);
    } else {
      setIsDrawerPosition(true);
    }
  };

  const headerRightComp = () => {
    return (
      <TouchableOpacity
        style={styles.headerRightCompStyle}
        onPress={() => {
          NotificationIconTapped();
        }}>
        {isNotification ? (
          <Image
            source={require('../assets/newNotification.png')}
            style={{height: 25, width: 25}}
          />
        ) : (
          <Ionicons
            name="notifications-outline"
            size={25}
            color={theme.colors.primaryWhite}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <DrawerLayout
        ref={drawer => {
          setDrawer(drawer);
        }}
        enableTrackpadTwoFingerGesture
        drawerWidth={SCREEN_WIDTH * 0.75}
        keyboardDismissMode="on-drag"
        onDrawerClose={() => {
          setIsModalVisible(false);
        }}
        onDrawerOpen={() => {
          setIsModalVisible(true);
        }}
        onDrawerStateChanged={(newState, drawerWillShow) => {
          if (drawerWillShow) {
            setIsModalVisible(true);
          } else {
            setIsModalVisible(false);
          }
        }}
        drawerPosition="left"
        drawerType={'front'}
        drawerContainerStyle={styles.drawerContainerStyle}
        overlayColor={'rgba(0,0,0,0)'}
        renderNavigationView={() => {
          return (
            <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
              {/* <View style={styles.drawerTopHeader}></View> */}
              <View style={[styles.drawerMainContainer, {height: '100%'}]}>
                <View style={styles.drawerLeftComp}>
                  <DrawerContent customProps={props} />
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    display: isModalVisible ? 'flex' : 'none',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width: isModalVisible ? '35%' : 1,
                  }}
                  onPress={() =>
                    dispatch(
                      handleDrawerVisibility(
                        DRAWER_VISIBILITY_CONST.HIDE_DRAWER,
                      ),
                    )
                  }
                />
              </View>
            </View>
          );
        }}>
        <Stack.Navigator
          initialRouteName={'RequestListScreen'}
          screenOptions={{
            headerStyle: {
              height: SCREEN_HEIGHT * 0.073,
              shadowOpacity: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.darkCerulean,
            },
            title: Localization.t('screenTitles.request'),
            headerTintColor: theme.colors.primaryWhite,
            headerTitleStyle: styles.headerTitleText,
            headerLeft: headerLeftComp,
            headerRight: headerRightComp,
          }}>
          <Stack.Screen
            options={{
              title: Localization.t('screenTitles.consultation'),
            }}
            name="NewsConsultationList"
            component={NewsConsultationList}
          />
          <Stack.Screen
            name="RequestListScreen"
            options={{
              title: Localization.t('screenTitles.request'),
            }}
            component={RequestListScreen}
          />
          <Stack.Screen
            name="CreateRequestScreen"
            component={CreateRequestScreen}
          />
          <Stack.Screen
            name="DetailsRequestScreen"
            component={DetailsRequestScreen}
          />
          <Stack.Screen
            options={{
              title: Localization.t('screenTitles.consultation'),
            }}
            name="AnnoucementsDetails"
            component={AnnoucementsDetails}
          />
          <Stack.Screen
            name="TrainingAreaScreen"
            component={TrainingAreaScreen}
            options={{
              headerTitle: '',
            }}
          />
          <Stack.Screen
            name="DocumentsScreen"
            component={DocumentsScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="MediaLibraryDocumentScreen"
            component={MediaLibraryDocumentScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="TrainingSlideScreen"
            component={TrainingSlidesScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="LegalConsultationScreen"
            component={LegalConsultationScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="TrainingCompleteScreen"
            component={TrainingCompleteScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="QuestionsListScreen"
            component={QuestionsListScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="TestCompleteScreen"
            component={TestCompleteScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="TestFailedScreen"
            component={TestFailedScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="TestSuccessScreen"
            component={TestSuccessScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="SettingScreen"
            component={SettingScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="InvoiceScreen"
            component={InvoiceScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="IncentiveScreen"
            component={IncentiveScreen}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword}
            options={{
              title: '',
            }}
          />
          <Stack.Screen name="YouTubeWebScreen" component={YouTubeWebScreen} />
        </Stack.Navigator>
        <BottomNavigation customProps={props} />
      </DrawerLayout>
      <Modal
        onRequestClose={() => setIsDrawerPosition(false)}
        isVisible={isDrawerPosition}
        propagateSwipe={true}
        backdropColor={'transparent'}
        onBackdropPress={() => setIsDrawerPosition(false)}
        style={{
          margin: 0,
        }}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        statusBarTranslucent={true}>
        <View
          style={[
            {
              height: '82%',
              marginTop: SCREEN_HEIGHT * 0.04,
              flexDirection: 'row',
            },
          ]}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              width: '35%',
            }}
            onPress={() => setIsDrawerPosition(false)}
          />
          <View style={styles.rightDrawerView}>
            <RightDrawerContent
              drawerPosition={setIsDrawerPosition}
              customProps={props}
              list={notificationList}
            />
          </View>
        </View>
      </Modal>

      <Modal
        style={{margin: 0}}
        visible={isLoaderVisible}
        transparent={true}
        statusBarTranslucent={true}>
        <Loader />
      </Modal>
    </>
  );
}

const useStyle = theme =>
  StyleSheet.create({
    drawerbackDropContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      width: '1%',
    },
    drawerContainerStyle: {
      position: 'absolute',
      top: SCREEN_HEIGHT * 0.073,
    },
    drawerTopHeader: {
      alignContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0)',
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.204,
      justifyContent: 'space-between',
      paddingHorizontal: '3%',
      paddingBottom: '1%',
    },
    drawerMainContainer: {
      flexDirection: 'row',
      width: '100%',
    },
    drawerLeftComp: {
      backgroundColor: theme.colors.primaryWhite,
      width: '100%',
    },
    headerStyle: {
      height: SCREEN_HEIGHT * 0.073,
      shadowOpacity: 0,
      shadowColor: 'transparent',
      backgroundColor: theme.colors.darkCerulean,
    },
    headerTitleText: {
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(15, 731),
      alignSelf: 'center',
    },
    headerLeftCompStyle: {
      alignItems: 'center',
      backgroundColor: 'red',
      height: SCREEN_WIDTH * 0.072,
      justifyContent: 'center',
      marginBottom: 5,
      marginLeft: 10,
      width: SCREEN_WIDTH * 0.072,
    },
    hearderLeftText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(14, 830),
      textTransform: 'uppercase',
    },
    headerRightCompStyle: {
      alignItems: 'center',
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      marginRight: 10,
      width: SCREEN_WIDTH * 0.1,
    },
    headerStyle: {
      backgroundColor: theme.colors.darkCerulean,
      shadowOpacity: 0,
    },
    headerTitleStyle: {
      color: theme.colors.primaryWhite,
    },
    rightDrawerView: {backgroundColor: theme.colors.primaryWhite, width: '65%'},
  });

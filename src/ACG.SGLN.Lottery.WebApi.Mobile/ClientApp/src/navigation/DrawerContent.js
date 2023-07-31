import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  FONTS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../src/styles/StyleConstant';
import {changeColor} from '../redux/bottomTab/changeColorOfTab-action';
import Localization from '../localization/Localization';
import * as Index from '../assets/index';
import {CHANGE_COLOR_CONST} from '../redux/bottomTab/changeColor-constant';
import {handleDrawerVisibility} from '../redux/draweTab/drawer-changeColorOfTab-action';
import {DRAWER_VISIBILITY_CONST} from '../redux/draweTab/drawer-changeColor-constant';
import {createConnection} from '../utils/DataBaseHelpers/CreateConnection';
import {GetFirstLetters} from '../utils/commonHelper/CommonHelper';
import Loader from '../components/customs/Loader';
import {Reset_CurrentUser_state} from '../redux/currentUser/currentUser-action';
import {CURRENT_USER_DETAILS_CONST} from '../redux/currentUser/currentUser-constant';

const db = createConnection();
export function DrawerContent(props) {
  //UseState
  const [selectedTab, setSelectedTab] = useState(-1);
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [userDetails, setuserDetails] = useState({
    firstName: '',
    lastname: '',
    type: 'Retailer',
    image: '',
    agentEmail: '',
    agentFirstName: 'x',
    agentLastName: 'x',
    agentPhoneNumber: '',
    userid: '',
  });
  const [userList, setUserList] = useState([]);

  const theme = useTheme();
  const styles = useStyle(theme);
  const dispatch = useDispatch();

  const SelectedIndex = useSelector(state => state.ChangeBottomTabColor);
  const CurrentUserDetails = useSelector(state => state.CurrentUserDetails);

  useEffect(() => {
    if (SelectedIndex) {
      setSelectedTab(SelectedIndex.tabSelectedIndex);
    }
  }, [SelectedIndex]);

  useEffect(() => {
    if (CurrentUserDetails.GetCurrentuserDetailsSuccess) {
      setuserDetails(prevState => ({
        ...prevState,
        firstName:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .firstName,
        lastname:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .lastName,
        type: 'Retailer',
        agentEmail:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .agentEmail,
        agentFirstName:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .agentFirstName,
        agentLastName:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .agentLastName,
        agentPhoneNumber:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data
            .agentPhoneNumber,
        userid:
          CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data.userid,
      }));
      setTimeout(() => {
        retriveLoggedUsers();
      }, 500);
    }
  }, [CurrentUserDetails]);

  useEffect(() => {
    retriveLoggedUsers();
  }, []);

  const retriveLoggedUsers = async () => {
    await db.transaction(txx => {
      txx.executeSql('SELECT * FROM LoggedInUsers', [], (tx, resultss) => {
        var temp = [];
        for (let i = 0; i < resultss.rows.length; ++i) {
          temp.push(resultss.rows.item(i));
        }
        setUserList(temp);
      });
    });
  };

  useEffect(() => {}, [userList]);

  const renderList = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={item.user_id === userDetails.userid}
        style={styles.userListItem}
        onPress={() => handleSwitchAccount(item)}>
        <View
          style={[
            styles.itemView,
            {
              backgroundColor:
                item.user_id === userDetails.userid
                  ? theme.colors.yellow
                  : theme.colors.darkCerulean,
            },
          ]}>
          <Text style={styles.loggedUsersListAbbr}>
            {GetFirstLetters(
              `${item.user_firstName} ${item.user_lastName}`,
            ).slice(0, 3)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const userListFooterComp = () => {
    return (
      <>
        {userList.length < 8 && (
          <TouchableOpacity
            style={styles.userListAddIcon}
            onPress={handleAddNew}>
            <IonIcon name="add" size={30} color={theme.colors.primaryWhite} />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const handleAddNew = async () => {
    await AsyncStorage.removeItem('prevUsers');
    await AsyncStorage.setItem('prevUsers', userDetails.userid);
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
    props.customProps.navigation.navigate('LoginScreen');
  };

  const handleSwitchAccount = async item => {
    setIsLoaderVisible(true);
    await AsyncStorage.removeItem('prevUsers');
    await AsyncStorage.setItem('prevUsers', userDetails.userid);
    await AsyncStorage.removeItem('bearerToken');
    await db.transaction(txx => {
      txx.executeSql(
        'SELECT * FROM LoggedInUsers where user_id=?',
        [item.user_id],
        async (tx, resultss) => {
          await AsyncStorage.setItem(
            'bearerToken',
            resultss.rows.item(0).accessToken,
          );
          setTimeout(() => {
            setIsLoaderVisible(false);
            dispatch(
              handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER),
            );
            props.customProps.navigation.replace('DrawerNavigation');
          }, 500);
        },
      );
    });
  };

  const handleResourceNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 6));
    props.customProps.navigation.navigate('DocumentsScreen');
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
  };

  const handleFacturationNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 10));
    props.customProps.navigation.navigate('InvoiceScreen');
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
  };

  const handleMediaLibraryNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 12));
    props.customProps.navigation.navigate('MediaLibraryDocumentScreen');
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
  };
  const handleActualiteNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 7));
    props.customProps.navigation.navigate('NewsConsultationList');
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
  };

  const handleLegalNoticeNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 8));
    props.customProps.navigation.navigate('LegalConsultationScreen');
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
  };

  const handleFormationavigatio = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 9));
    props.customProps.navigation.navigate('TrainingAreaScreen');
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
  };

  const handleDemandeNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 2));
    props.customProps.navigation.navigate('RequestListScreen');
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
  };

  const handleProfileNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, -1));
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
    props.customProps.navigation.navigate('ProfileScreen');
  };

  const handleIncentiveScreenNavigation = () => {
    dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 11));
    dispatch(handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER));
    props.customProps.navigation.navigate('IncentiveScreen');
  };

  const handleLogOut = async () => {
    const prevUserId = await AsyncStorage.getItem('prevUsers');
    await AsyncStorage.removeItem('prevUsers');
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  LoggedInUsers where user_id=?',
        [userDetails.userid],
        async (tx, results) => {
          if (results.rowsAffected > 0) {
            if (prevUserId && prevUserId !== userDetails.userid) {
              setIsLoaderVisible(true);
              tx.executeSql(
                'SELECT * FROM LoggedInUsers where user_id=?',
                [prevUserId],
                async (tx, resultss) => {
                  await AsyncStorage.setItem(
                    'bearerToken',
                    resultss.rows.item(0).accessToken,
                  );
                  setTimeout(() => {
                    setIsLoaderVisible(false);
                    dispatch(
                      handleDrawerVisibility(
                        DRAWER_VISIBILITY_CONST.HIDE_DRAWER,
                      ),
                    );
                    dispatch(
                      Reset_CurrentUser_state(
                        CURRENT_USER_DETAILS_CONST.RESET_CURRENTUSER_DETAILS,
                      ),
                    );
                    props.customProps.navigation.replace('DrawerNavigation');
                  }, 500);
                },
              );
            } else {
              if (userList.length === 1) {
                setIsLoaderVisible(false);
                await AsyncStorage.removeItem('bearerToken');
                dispatch(
                  handleDrawerVisibility(DRAWER_VISIBILITY_CONST.HIDE_DRAWER),
                );
                props.customProps.navigation.replace('LoginScreen');
              } else {
                tx.executeSql(
                  'SELECT * FROM LoggedInUsers WHERE ROWID IN ( SELECT max( ROWID ) FROM LoggedInUsers )',
                  [],
                  async (tx, resultss) => {
                    console.info(resultss.rows);
                    await AsyncStorage.setItem(
                      'bearerToken',
                      resultss.rows.item(0).accessToken,
                    );
                    setTimeout(() => {
                      setIsLoaderVisible(false);
                      dispatch(
                        handleDrawerVisibility(
                          DRAWER_VISIBILITY_CONST.HIDE_DRAWER,
                        ),
                      );
                      dispatch(
                        Reset_CurrentUser_state(
                          CURRENT_USER_DETAILS_CONST.RESET_CURRENTUSER_DETAILS,
                        ),
                      );
                      props.customProps.navigation.replace('DrawerNavigation');
                    }, 500);
                  },
                );
              }
            }
          }
        },
      );
    });
  };

  const handlePhoneCall = number => () => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
      Linking.openURL(phoneNumber);
    } else {
      phoneNumber = `telprompt:${number}`;
      setTimeout(() => {
        Linking.openURL(phoneNumber);
      }, 400);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.drawerMainContaier}>
        <View style={styles.userListContainer}>
          <FlatList
            data={userList}
            renderItem={renderList}
            key={item => item.userId}
            ListFooterComponent={userListFooterComp}
          />
        </View>
        <View style={styles.separatorLine} />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={[styles.scrollViewStyle]}>
          <TouchableOpacity
            style={styles.currentUserDetailsContainer}
            onPress={handleProfileNavigation}>
            <View style={styles.parentView}>
              <Image
                resizeMode={'contain'}
                source={{
                  uri: 'https://asisscientific.com.au/wp-content/uploads/2017/06/dummy-profile.jpg',
                }}
                style={styles.imageContainer}
              />
            </View>
            <View style={styles.userView}>
              <Text numberOfLines={1} style={styles.userName}>
                {userDetails.firstName} {userDetails.lastname}
              </Text>
              <Text style={styles.userBelowName}>{userDetails.type}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dailyLimitContaier}>
            <Text numberOfLines={2} style={styles.dailyLimitText}>
              {Localization.t('menu.dailyLimit')} :{' '}
              {Localization.toNumber(30000, {
                strip_insignificant_zeros: true,
              })}{' '}
              {Localization.t('common.dh')}
            </Text>
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 2
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 2
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleDemandeNavigation}>
              {selectedTab === 2 ? (
                <Index.SelectDemand style={styles.imageView} />
              ) : (
                <Index.Demands style={styles.imageView} />
              )}
              <Text
                style={[
                  {
                    color:
                      selectedTab === 2 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.demand')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 6
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 6
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleResourceNavigation}>
              {selectedTab === 6 ? (
                <Index.SelectDocument style={styles.imageView} />
              ) : (
                <Index.UnselectDocument style={styles.imageView} />
              )}
              <Text
                style={[
                  {
                    color:
                      selectedTab === 6 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.documents')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 7
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 7
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleActualiteNavigation}>
              {selectedTab === 7 ? (
                <Index.SelectSound style={styles.imageView} />
              ) : (
                <Index.Sound style={styles.imageView} />
              )}
              <Text
                style={[
                  {
                    color:
                      selectedTab === 7 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.alert')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 8
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 8
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleLegalNoticeNavigation}>
              {selectedTab === 8 ? (
                <Index.SelectToolBox style={styles.imageView} />
              ) : (
                <Index.ToolBox style={styles.imageView} />
              )}
              <Text
                style={[
                  {
                    color:
                      selectedTab === 8 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.outils')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 9
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 9
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleFormationavigatio}>
              {selectedTab === 9 ? (
                <Index.SelectTraining style={styles.imageView} />
              ) : (
                <Index.Training style={styles.imageView} />
              )}

              <Text
                style={[
                  {
                    color:
                      selectedTab === 9 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.formation')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 10
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 10
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleFacturationNavigation}>
              {selectedTab === 10 ? (
                <Index.SelectList style={styles.imageView} />
              ) : (
                <Index.List style={styles.imageView} />
              )}
              <Text
                style={[
                  {
                    color:
                      selectedTab === 10 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.facturation')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 11
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 11
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleIncentiveScreenNavigation}>
              {selectedTab === 11 ? (
                <Index.SelectCertificate style={styles.imageView} />
              ) : (
                <Index.Certificate style={styles.imageView} />
              )}
              <Text
                style={[
                  {
                    color:
                      selectedTab === 11 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.classification')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.drawerItemStyle,
                {
                  backgroundColor:
                    selectedTab === 12
                      ? theme.colors.paleNavy
                      : theme.colors.primaryWhite,
                  borderColor:
                    selectedTab === 12
                      ? theme.colors.darkCerulean
                      : 'transparent',
                },
              ]}
              onPress={handleMediaLibraryNavigation}>
              {selectedTab === 12 ? (
                <Image
                  source={require('../assets/media_select.png')}
                  style={styles.drawerItemIconContainer}
                />
              ) : (
                <Image
                  source={require('../assets/media_unselect.png')}
                  style={styles.drawerItemIconContainer}
                />
              )}
              <Text
                style={[
                  {
                    color:
                      selectedTab === 12 ? theme.colors.darkCerulean : 'grey',
                  },
                  styles.drawerNameText,
                ]}>
                {Localization.t('menu.mediaLibrary')}
              </Text>
            </TouchableOpacity>

            <View style={styles.associateContainer}>
              <View style={styles.associateAccountProfileContainer}>
                <Text style={styles.associateAccountProfileText}>
                  {GetFirstLetters(
                    `${userDetails.agentFirstName} ${userDetails.agentLastName}`,
                  ).slice(0, 3)}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.agentAddress}>
                    {userDetails.agentFirstName} {userDetails.agentLastName}
                  </Text>
                  <TouchableOpacity
                    style={[styles.circleView]}
                    onPress={handlePhoneCall(userDetails.agentPhoneNumber)}>
                    <IonIcon
                      name="md-call"
                      color={theme.colors.primaryWhite}
                      style={{height: '70%', width: '70%'}}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.commercialView}>Commercial Chef</Text>
                <Text style={styles.email}>{userDetails.agentEmail}</Text>
              </View>
              <View style={styles.callIconContainer}></View>
            </View>
            <TouchableOpacity
              style={styles.logoutContainer}
              onPress={handleLogOut}>
              <AntDesign
                name="logout"
                size={20}
                color={'grey'}
                style={{marginHorizontal: 20}}
              />
              <Text style={styles.logOutText}>
                {Localization.t('menu.logout')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Modal visible={isLoaderVisible} transparent={true}>
        <Loader />
      </Modal>
    </View>
  );
}

const useStyle = theme =>
  StyleSheet.create({
    associateContainer: {
      borderColor: theme.colors.aliceGray,
      borderLeftWidth: 0,
      borderWidth: 0.5,
      flexDirection: 'row',
      paddingVertical: 20,
      paddingHorizontal: 10,
    },
    associateAccountProfileContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.paleNavy,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      marginRight: 15,
      width: SCREEN_WIDTH * 0.1,
    },
    associateAccountProfileText: {
      color: theme.colors.spindle,
      fontSize: RFValue(16, 830),
      fontFamily: FONTS.Montserrat_SemiBold,
    },
    agentAddress: {
      color: theme.colors.licorice,
      fontSize: RFValue(14, 812),
      fontFamily: FONTS.Montserrat_Medium,
      flex: 1,
    },
    commercialView: {
      color: theme.colors.lightGray,
      fontSize: RFValue(14, 812),
      fontFamily: FONTS.Montserrat_Medium,
    },
    circleView: {
      backgroundColor: theme.colors.vividGreen,
      width: SCREEN_WIDTH * 0.05,
      height: SCREEN_WIDTH * 0.05,
      borderRadius: SCREEN_WIDTH * 0.025,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.vividGreen,
    },
    callIconContainer: {alignItems: 'center', justifyContent: 'center'},
    currentUserDetailsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingVertical: '6%',
      paddingHorizontal: '5%',
      width: '100%',
    },
    currentUserImageStyle: {
      height: '80%',
      width: '80%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dailyLimitText: {
      color: theme.colors.darkRed,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(12, 830),
      textAlign: 'center',
    },
    dailyLimitContaier: {
      backgroundColor: theme.colors.paleNavy,
      alignItems: 'center',
      paddingVertical: 4,
    },
    drawerTabStyle: {
      alignItems: 'center',
      flexDirection: 'row',
      height: '20%',
      justifyContent: 'flex-start',
    },
    drawerTabText: {fontSize: 18, marginLeft: 5, fontWeight: '600'},
    drawerItemStyle: {
      alignItems: 'center',
      borderLeftWidth: 3,
      flexDirection: 'row',
      width: '100%',
      marginTop: SCREEN_HEIGHT * 0.01,
    },
    drawerItemIconContainer: {
      marginLeft: '5%',
      marginRight: '5%',
      marginVertical: '4%',
      height: SCREEN_WIDTH * 0.056,
      width: SCREEN_WIDTH * 0.056,
    },
    drawerMainContaier: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    drawerNameText: {
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(12, 812),
    },
    email: {
      color: theme.colors.lightGray,
      fontSize: RFValue(14, 812),
      fontFamily: FONTS.Montserrat_Medium,
    },
    imageContainer: {
      width: '60%',
      height: '60%',
      borderRadius: SCREEN_WIDTH * 0.01,
    },
    imageView: {
      marginLeft: '5%',
      marginRight: '5%',
      marginVertical: '4%',
    },
    itemView: {
      backgroundColor: theme.colors.darkCerulean,
      width: SCREEN_WIDTH * 0.1,
      height: SCREEN_WIDTH * 0.1,
      // borderRadius: SCREEN_WIDTH * 0.01,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageContainer: {
      width: '60%',
      height: '60%',
      borderRadius: SCREEN_WIDTH * 0.01,
    },
    logOutText: {
      color: theme.colors.primaryBlack,
      fontSize: RFValue(16, 812),
      fontFamily: FONTS.Montserrat_Medium,
    },
    loggedUsersListAbbr: {
      color: 'white',
      textTransform: 'uppercase',
      fontSize: RFValue(16, 830),
      fontFamily: FONTS.Montserrat_Regular,
    },
    logoutContainer: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      height: '100%',
      paddingVertical: SCREEN_HEIGHT * 0.03,
      marginBottom: 25,
    },

    parentView: {
      backgroundColor: theme.colors.paleNavy,
      width: SCREEN_WIDTH * 0.1,
      height: SCREEN_WIDTH * 0.1,
      borderRadius: SCREEN_WIDTH * 0.01,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userName: {
      fontWeight: '800',
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_Medium,
      fontSize: RFValue(14, 812),
    },
    userView: {
      flex: 1,
      marginLeft: SCREEN_WIDTH * 0.026,
      justifyContent: 'center',
    },
    userBelowName: {
      color: theme.colors.frostedSilver,
      fontFamily: FONTS.Montserrat_Medium,
      fontSize: RFValue(14, 812),
    },
    userListItem: {
      alignSelf: 'center',
      height: SCREEN_WIDTH * 0.1,
      marginVertical: 15,
      width: SCREEN_WIDTH * 0.1,
    },
    userListAddIcon: {
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: theme.colors.secondaryGray,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      width: SCREEN_WIDTH * 0.1,
    },
    userListContainer: {width: '20%', paddingTop: '5%'},
    separatorLine: {
      borderWidth: 0.5,
      borderColor: theme.colors.aliceGray,
      height: SCREEN_HEIGHT,
    },
    scrollViewStyle: {
      paddingTop: '5%',
      height: SCREEN_HEIGHT * 0.9,
    },
  });

import {useFocusEffect, useTheme} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';

import Dollar from '../../assets/dollar.svg';
import Classification from '../../assets/classification.svg';
import Points from '../../assets/points.svg';
import CardText from '../../components/IncentiveSection/CardText';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {useDispatch} from 'react-redux';
import {changeColor} from '../../redux/bottomTab/changeColorOfTab-action';
import {CHANGE_COLOR_CONST} from '../../redux/bottomTab/changeColor-constant';
import {showToast} from '../../components/customs/Toast';
import Loader from '../../components/customs/Loader';

import {GetClassification} from '../../services/IncentiveClient/GetClassification';
import {removeEmptySpaces} from '../../utils/commonHelper/CommonHelper';
import {GetIncentives} from '../../services/IncentiveClient/GetIncentives';
import {
  ImageURL,
  IncentiveCategory,
} from '../../services/serviceHelper/ServiceUtilites';

const IncentiveScreen = () => {
  const theme = useTheme();
  const styles = useStyle(theme);
  const dispatch = useDispatch();

  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [incentiveData, setIncentiveData] = useState([]);
  const [classificationDetails, setClassificationDetails] = useState({
    ca: 0,
    classification: '',
    loyaltyPoints: 0,
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 11));
      getData();
    }, []),
  );

  const getData = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisible(true);
      const classification_res = await GetClassification();
      const incentive_res = await GetIncentives();
      if (classification_res.isSuccess) {
        setClassificationDetails(prevState => ({
          ...prevState,
          ca: removeEmptySpaces(classification_res.data.ca),
          classification: classification_res.data.classification,
          loyaltyPoints: removeEmptySpaces(
            classification_res.data.loyaltyPoints,
          ),
        }));
      } else {
        setIsLoaderVisible(false);
      }
      if (incentive_res.isSuccess) {
        setIncentiveData(incentive_res.data);
      } else {
        setIsLoaderVisible(false);
      }
      setIsLoaderVisible(false);
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const listEmptyComp = () => {
    return (
      <>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {Localization.t('common.emptyData')}
          </Text>
        </View>
      </>
    );
  };

  const renderCards = ({item}) => {
    return (
      <>
        <View style={styles.cardMainContainer}>
          <View style={{width: '30%', marginRight: 4}}>
            <Text style={styles.lotoText}>{item.type}</Text>
            <Image
              resizeMode="contain"
              source={{uri: `${ImageURL}${IncentiveCategory}/${item.type}`}}
              style={styles.imageStyle}
            />
          </View>
          <View style={{width: '35%'}}>
            <CardText
              title={Localization.t('incentiveScreen.createdDate')}
              subTitle={`${item.startDate}`}
            />
            <CardText
              title={Localization.t('incentiveScreen.goal')}
              subTitle={`${Localization.toNumber(removeEmptySpaces(item.goal), {
                strip_insignificant_zeros: true,
              })} ${Localization.t('common.dh')}`}
            />
            <CardText
              title={`% ${Localization.t('incentiveScreen.production')}`}
              subTitle={`${item.achievementRate}%`}
            />
            <CardText
              title={Localization.t('incentiveScreen.bonus')}
              subTitle={`${Localization.toNumber(
                removeEmptySpaces(item.bonus),
                {
                  strip_insignificant_zeros: true,
                },
              )} ${Localization.t('common.dh')}`}
            />
          </View>
          <View style={{width: '36%'}}>
            <CardText
              title={Localization.t('incentiveScreen.endDate')}
              subTitle={`${item.endDate}`}
            />
            <CardText
              title={Localization.t('incentiveScreen.production')}
              subTitle={`${Localization.toNumber(
                removeEmptySpaces(item.achievement),
                {
                  strip_insignificant_zeros: true,
                },
              )} ${Localization.t('common.dh')}`}
            />
            <CardText
              title={Localization.t('incentiveScreen.stillToAchieve')}
              subTitle={`${Localization.toNumber(
                removeEmptySpaces(item.remains),
                {
                  strip_insignificant_zeros: true,
                },
              )} ${Localization.t('common.dh')}`}
            />
          </View>
        </View>
      </>
    );
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/backgroundImage.png')}
        style={styles.mainContainer}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          style={styles.mainScrollContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>
              {Localization.t('incentiveScreen.title')}
            </Text>
            <Text style={styles.subHeadingText}>
              {Localization.t('incentiveScreen.subTitle')}
            </Text>
          </View>
          <View style={styles.infoComTextContainer}>
            <Text style={styles.sectionHeadingText}>
              {Localization.t('incentiveScreen.programExellence')}
            </Text>
          </View>
          <View style={styles.classificationCardContainer}>
            <View style={styles.infoHorizotalCardContainer}>
              <View style={styles.infoCardsContainer}>
                <Dollar />
                <View style={styles.infoCardSubContainer}>
                  <Text style={styles.infoCardHeadingText}>
                    {Localization.t('incentiveScreen.ca')}
                  </Text>
                  <Text numberOfLines={3} style={styles.infoCardSubHeadingText}>
                    {Localization.toNumber(classificationDetails.ca, {
                      strip_insignificant_zeros: true,
                    })}{' '}
                    {Localization.t('common.dh')}
                  </Text>
                </View>
              </View>
              <View style={styles.infoCardsContainer}>
                <Classification />
                <View style={styles.infoCardSubContainer}>
                  <Text style={styles.infoCardHeadingText}>
                    {Localization.t('incentiveScreen.classification')}
                  </Text>
                  <Text numberOfLines={2} style={styles.infoCardSubHeadingText}>
                    {classificationDetails.classification}
                  </Text>
                </View>
              </View>
              <View style={styles.infoCardsContainer}>
                <Points />
                <View style={styles.infoCardSubContainer}>
                  <Text style={styles.infoCardHeadingText}>
                    {Localization.t('incentiveScreen.points')}
                  </Text>
                  <Text numberOfLines={3} style={styles.infoCardSubHeadingText}>
                    {classificationDetails.loyaltyPoints}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.infoComTextContainer,
              {marginBottom: SCREEN_HEIGHT * 0.01},
            ]}>
            <Text style={styles.sectionHeadingText}>
              {Localization.t('incentiveScreen.incentives')}
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <FlatList
              data={incentiveData}
              keyExtractor={item => `${item.id}${Math.random()}`}
              renderItem={renderCards}
              bounces={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={listEmptyComp}
            />
          </View>
          <Modal
            visible={isLoaderVisible}
            transparent={true}
            statusBarTranslucent={true}>
            <Loader />
          </Modal>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

export default IncentiveScreen;

const useStyle = theme =>
  StyleSheet.create({
    cardMainContainer: {
      backgroundColor: theme.colors.primaryWhite,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingVertical: SCREEN_HEIGHT * 0.018,
      paddingHorizontal: SCREEN_WIDTH * 0.036,
      marginVertical: 8,
      width: '100%',
    },
    classificationCardContainer: {
      marginBottom: SCREEN_HEIGHT * 0.028,
      width: '100%',
    },
    headingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(24, 830),
      textAlign: 'center',
    },
    headingContainer: {
      alignItems: 'center',
      marginBottom: SCREEN_HEIGHT * 0.028,
      width: '100%',
    },
    imageStyle: {width: '100%', height: SCREEN_HEIGHT * 0.138},
    infoComTextContainer: {
      alignSelf: 'flex-start',
      marginBottom: SCREEN_HEIGHT * 0.012,
    },
    infoCardsContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.lightBlue,
      height: SCREEN_WIDTH * 0.25,
      justifyContent: 'center',
      minWidth: SCREEN_WIDTH * 0.285,
    },
    infoCardSubContainer: {
      alignItems: 'center',
      position: 'absolute',
      width: '90%',
    },
    infoHorizotalCardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: SCREEN_HEIGHT * 0.015,
    },
    infoCardHeadingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(14, 830),
      marginBottom: 8,
      textAlign: 'center',
    },
    infoCardSubHeadingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(14, 830),
      textAlign: 'center',
    },
    infoComTextContainer: {
      alignSelf: 'flex-start',
      marginBottom: SCREEN_HEIGHT * 0.005,
    },
    infoPerTextConainer: {
      alignSelf: 'flex-start',
      marginTop: SCREEN_HEIGHT * 0.013,
    },
    lotoText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(12, 830),
    },
    mainContainer: {
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    mainScrollContainer: {
      flex: 1,
      marginBottom: SCREEN_HEIGHT * 0.07,
      paddingHorizontal: SCREEN_WIDTH * 0.047,
      width: '100%',
    },
    noDataText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Medium,
      textAlign: 'justify',
    },
    noDataContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    subHeadingText: {
      color: theme.colors.lightChoco,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(15, 830),
    },
    sectionHeadingText: {
      color: theme.colors.yellow,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(16, 830),
    },
  });

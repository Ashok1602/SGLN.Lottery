import React, {useCallback, useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';

import Money from '../../assets/money.svg';
import Commision from '../../assets/commision.svg';
import Impays from '../../assets/impayes.svg';
import Actual from '../../assets/actual.svg';
import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import PersonalInfoCard from '../../components/ProfileScreen/PersonalInfoCard';

const ProfileScreen = () => {
  const theme = useTheme();
  const styles = useStyle(theme);
  const dispatch = useDispatch();

  const [userDetails, setuserDetails] = useState({
    civility: '',
    firstName: '',
    lastname: '',
    address: null,
    annualCA: undefined,
    companyIdentifier: undefined,
    contractNumber: undefined,
    internalRetailerCode: null,
    externalRetailerCode: null,
    geographicSector: undefined,
    phone: '',
    totalCommissions: undefined,
    totalUnpaid: undefined,
    actual: 0,
    adressLatitude: undefined,
    adressLongitude: undefined,
  });

  const CurrentUserDetails = useSelector(state => state.CurrentUserDetails);

  useEffect(() => {
    if (CurrentUserDetails.GetCurrentuserDetailsSuccess) {
      const data =
        CurrentUserDetails.GetCurrentuserDetailsSuccess.response.data;
      setuserDetails(prevState => ({
        ...prevState,
        firstName: data.firstName,
        lastname: data.lastName,
        civility: data.civility,
        address: data.address ? data.address : '-',
        annualCA: data.annualCA ? data.annualCA : 0,
        companyIdentifier: data.companyIdentifier
          ? data.companyIdentifier
          : '-',
        contractNumber: data.contractNumber ? data.contractNumber : '-',
        internalRetailerCode: data.internalRetailerCode
          ? data.internalRetailerCode
          : '-',
        externalRetailerCode: data.externalRetailerCode
          ? data.externalRetailerCode
          : '-',
        geographicSector: data.geographicSector,
        phone: data.phone,
        totalCommissions: data.totalCommissions ? data.totalCommissions : 0,
        totalUnpaid: data.totalUnpaid ? data.totalUnpaid : 0,
        adressLatitude: data.adressLatitude,
        adressLongitude: data.adressLongitude,
      }));
    }
  }, [CurrentUserDetails]);

  return (
    <ImageBackground
      source={require('../../assets/backgroundImage.png')}
      style={{
        width: '100%',
        height: '100%',
      }}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center'}}
        style={styles.mainScrollContainer}>
        <View style={styles.headerCotainer}>
          <Text style={styles.headingText}>
            {Localization.t('profileScreen.myProfile')}
          </Text>
          <Text style={styles.subHeadingText}>
            {Localization.t('profileScreen.myInfo')}
          </Text>
        </View>
        <View style={styles.infoComTextContainer}>
          <Text style={styles.sectionHeadingText}>
            {Localization.t('profileScreen.commercialInfo')}
          </Text>
        </View>
        <View style={{width: '85%'}}>
          <View style={styles.infoHorizotalCardContainer}>
            <View style={styles.infoCardsContainer}>
              <Money />
              <View style={styles.infoCardSubContainer}>
                <Text style={styles.infoCardHeadingText}>
                  {Localization.t('profileScreen.annualTurnOver')}
                </Text>
                <Text style={styles.infoCardSubHeadingText}>
                  {userDetails.annualCA} {Localization.t('common.dh')}
                </Text>
              </View>
            </View>
            <View style={styles.infoCardsContainer}>
              <Commision />
              <View style={styles.infoCardSubContainer}>
                <Text style={styles.infoCardHeadingText}>
                  {Localization.t('profileScreen.commisions')}
                </Text>
                <Text style={styles.infoCardSubHeadingText}>
                  {userDetails.totalCommissions}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.infoHorizotalCardContainer}>
            <View style={styles.infoCardsContainer}>
              <Impays />
              <View style={styles.infoCardSubContainer}>
                <Text style={styles.infoCardHeadingText}>
                  {Localization.t('profileScreen.unPaid')}
                </Text>
                <Text style={styles.infoCardSubHeadingText}>
                  {userDetails.totalUnpaid} {Localization.t('common.dh')}
                </Text>
              </View>
            </View>
            <View style={styles.infoCardsContainer}>
              <Actual />
              <View style={styles.infoCardSubContainer}>
                <Text style={styles.infoCardHeadingText}>
                  {Localization.t('profileScreen.currentBalance')}
                </Text>
                <Text style={styles.infoCardSubHeadingText}>
                  {userDetails.actual}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.infoPerTextConainer}>
          <Text style={styles.sectionHeadingText}>
            {Localization.t('profileScreen.personalInfo')}
          </Text>
        </View>
        <View style={{width: '110%', marginBottom: 20}}>
          <PersonalInfoCard
            title={Localization.t('profileScreen.retailerName')}
            subTitle={`${userDetails.civility} ${userDetails.firstName} ${userDetails.lastname}`}
            isAddress={false}
          />
          <PersonalInfoCard
            title={Localization.t('profileScreen.contactNo')}
            subTitle={`${userDetails.contractNumber}`}
            isAddress={false}
          />
          <PersonalInfoCard
            title={Localization.t('profileScreen.dealerCode')}
            subTitle={`${userDetails.internalRetailerCode}`}
            isAddress={false}
          />
          <PersonalInfoCard
            title={Localization.t('profileScreen.dealerCodeOperator')}
            subTitle={`${userDetails.externalRetailerCode}`}
            isAddress={false}
          />
          <PersonalInfoCard
            title={`${Localization.t('profileScreen.rc')} / ${Localization.t(
              'profileScreen.tp',
            )} / ${Localization.t('profileScreen.ice')}`}
            subTitle={`${userDetails.companyIdentifier}`}
            isAddress={false}
          />
          <PersonalInfoCard
            title={Localization.t('profileScreen.address')}
            subTitle={`${userDetails.address}`}
            lat={19.07609}
            long={72.877426}
            label={userDetails.address}
            isAddress={true}
          />
          <PersonalInfoCard
            title={Localization.t('profileScreen.telephone')}
            subTitle={`${userDetails.phone}`}
            isAddress={false}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const useStyle = theme =>
  StyleSheet.create({
    headerCotainer: {
      alignItems: 'center',
      marginTop: 10,
    },
    headingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(24, 830),
    },
    infoCardsContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.lightBlue,
      height: SCREEN_WIDTH * 0.25,
      justifyContent: 'center',
      width: SCREEN_WIDTH * 0.34,
    },
    infoCardSubContainer: {
      alignItems: 'center',
      maxWidth: '90%',
      minWidth: '80%',
      position: 'absolute',
    },
    infoHorizotalCardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: SCREEN_HEIGHT * 0.015,
    },
    infoCardHeadingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(14, 830),
      marginBottom: 8,
    },
    infoCardSubHeadingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(14, 830),
    },
    infoComTextContainer: {
      alignSelf: 'flex-start',
      marginTop: SCREEN_HEIGHT * 0.028,
      marginBottom: SCREEN_HEIGHT * 0.012,
    },
    infoPerTextConainer: {
      alignSelf: 'flex-start',
      marginTop: SCREEN_HEIGHT * 0.013,
    },
    mainScrollContainer: {
      flex: 1,
      marginBottom: SCREEN_HEIGHT * 0.07,
      paddingHorizontal: SCREEN_WIDTH * 0.047,
    },
    sectionHeadingText: {
      color: theme.colors.yellow,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(16, 830),
    },
    subHeadingText: {
      color: theme.colors.lightChoco,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(15, 830),
    },
  });

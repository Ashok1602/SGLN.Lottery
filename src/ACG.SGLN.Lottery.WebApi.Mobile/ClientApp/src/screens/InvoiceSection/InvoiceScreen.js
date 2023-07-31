import React, {useCallback, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import {useDispatch} from 'react-redux';
import {useFocusEffect, useTheme} from '@react-navigation/native';

import Localization from '../../localization/Localization';
import AmountCategoryComp from '../../components/InvoiceSection/AmountCategoryComp';
import Loader from '../../components/customs/Loader';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import {RFValue} from 'react-native-responsive-fontsize';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {GetInvoice} from '../../services/InvoiceClient/GetInvoice';
import {showToast} from '../../components/customs/Toast';
import {GetByMonth} from '../../services/InvoiceClient/GetMonthlyReport';
import {DateFormats} from '../../utils/constants/constants';
import {changeColor} from '../../redux/bottomTab/changeColorOfTab-action';
import {CHANGE_COLOR_CONST} from '../../redux/bottomTab/changeColor-constant';
import { removeEmptySpaces } from '../../utils/commonHelper/CommonHelper';

const InvoiceScreen = () => {
  const theme = useTheme();
  const styles = useStyle(theme);
  const dispatch = useDispatch();

  const [isLoaderVisible, setisLoaderVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [amountData, setAmountData] = useState({
    paidAmountInvoicesLastSixMonths: 0,
    unPaidAmountInvoicesLastSixMonths: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlyDetailedData, setMonthlyDetailedData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      dispatch(changeColor(CHANGE_COLOR_CONST.CHANGE_SUCCESS, 10));
      getInvoiceData();
    }, []),
  );

  

  const getInvoiceData = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      setisLoaderVisible(true);
      const res = await GetInvoice();
      if (res.isSuccess) {
        setisLoaderVisible(false);
        setAmountData(prevState => ({
          ...prevState,
          paidAmountInvoicesLastSixMonths: removeEmptySpaces(
            res.data.paidAmountInvoicesLastSixMonths,
          ),
          unPaidAmountInvoicesLastSixMonths: removeEmptySpaces(
            res.data.unPaidAmountInvoicesLastSixMonths,
          ),
        }));
        dispatch(handlemMonthTap(res.data.monthlyReport[0], 0));
        setMonthlyData(res.data.monthlyReport);
      } else {
        setisLoaderVisible(false);
      }
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const handlemMonthTap = (item, index) => async () => {
    setSelectedIndex(index);
    if (await NetworkUtils.isNetworkAvailable()) {
      setisLoaderVisible(true);
      const res = await GetByMonth(item.startDate, item.endDate);
      if (res.isSuccess) {
        setisLoaderVisible(false);
        setMonthlyDetailedData(res.data);
      } else {
        setisLoaderVisible(false);
      }
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const renderMonthList = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={handlemMonthTap(item, index)}
          style={[
            styles.monthCard,
            {
              backgroundColor:
                selectedIndex === index
                  ? theme.colors.yellow
                  : theme.colors.primaryWhite,
            },
          ]}>
          <View style={styles.monthCardInnerContainer}>
            <View style={styles.monthYearInnerContainer}>
              <Text style={styles.monthAndYearText}>{item.month}</Text>
              <Text style={styles.monthAndYearText}>{item.year}</Text>
            </View>
            <View style={{marginVertical: SCREEN_HEIGHT * 0.013}}>
              <Text style={styles.totalText}>Total </Text>
              <Text style={styles.totalAmtText}>
                {Localization.toNumber(removeEmptySpaces(item.total), {
                  strip_insignificant_zeros: true,
                })}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.monthCardImpayeeContainer,
              {
                backgroundColor:
                  selectedIndex === index
                    ? theme.colors.yellow
                    : theme.colors.darkRed,
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    selectedIndex === index
                      ? theme.colors.darkNavyBlue
                      : theme.colors.primaryWhite,
                },
              ]}>
              {Localization.t('profileScreen.unPaid')}{' '}
            </Text>
            <Text
              style={[
                styles.statusAmtText,
                {
                  color:
                    selectedIndex === index
                      ? theme.colors.darkNavyBlue
                      : theme.colors.primaryWhite,
                },
              ]}>
              {Localization.toNumber(removeEmptySpaces(item.unpaid), {
                strip_insignificant_zeros: true,
              })}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderDetailedList = ({item, index}) => {
    return (
      <>
        <View style={styles.detailedCardContainer}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={styles.detailedCardSecHeading}>
              {item.reference}
            </Text>
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor:
                    item.status === 'Payée'
                      ? theme.colors.lightGreen
                      : theme.colors.darkRed,
                },
              ]}>
              <Text style={styles.detailedStatusText}>{item.status}</Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.detailedCardSecHeading}>
              {Localization.t('invoiceScreen.dateOfInvoice')}
            </Text>
            <Text style={styles.detailedCardSecText}>
              {moment(new Date(item.date)).format(DateFormats.DateMonthYear)}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.detailedCardSecHeading}>
              {Localization.t('invoiceScreen.amount')}
            </Text>
            <Text style={styles.detailedCardSecText}>
              {Localization.toNumber(removeEmptySpaces(item.amount), {
                strip_insignificant_zeros: true,
              })}{' '}
              {Localization.t('common.dh')}
            </Text>
          </View>
        </View>
      </>
    );
  };
  return (
    <ImageBackground
      source={require('../../assets/backgroundImage.png')}
      style={styles.mainContainer}>
      <View style={{alignItems: 'center', marginBottom: SCREEN_HEIGHT * 0.034}}>
        <Text style={styles.headingText}>
          {Localization.t('invoiceScreen.invoiceArea')}
        </Text>
        <Text style={styles.subHeadingText}>
          {Localization.t('invoiceScreen.invoiceDesc')}
        </Text>
      </View>
      <View style={styles.categoryContainer}>
        <AmountCategoryComp
          headingMsg={Localization.t('invoiceScreen.allPaidMsg')}
          amnt={amountData.paidAmountInvoicesLastSixMonths}
          bgcColor={theme.colors.lightGreen}
        />
        <AmountCategoryComp
          amnt={amountData.unPaidAmountInvoicesLastSixMonths}
          headingMsg={Localization.t('invoiceScreen.allPaidMsg')}
          bgcColor={theme.colors.darkRed}
        />
      </View>
      <View style={styles.horizontalFlatlistContaier}>
        <FlatList
          bounces={false}
          contentContainerStyle={{marginLeft: '5%'}}
          data={monthlyData}
          keyExtractor={item => item.startDate}
          horizontal
          renderItem={renderMonthList}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={() => {
            return <View style={{width: 30}} />;
          }}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyContaier}>
                <Text style={styles.emptyText}>
                  {Localization.t('common.emptyData')}
                </Text>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.bottomListContainer}>
        <FlatList
          data={monthlyDetailedData}
          keyExtractor={item => `${item.reference}${Math.random()}`}
          renderItem={renderDetailedList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            return <View style={{marginBottom: SCREEN_HEIGHT * 0.1}} />;
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

export default InvoiceScreen;

const useStyle = theme =>
  StyleSheet.create({
    bottomListContainer: {
      marginTop: SCREEN_HEIGHT * 0.026,
      width: '90%',
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
    },
    detailedCardSecHeading: {
      color: theme.colors.licorice,
      fontFamily: FONTS.OpenSans_Bold,
      fontSize: RFValue(14, 830),
      textTransform: 'uppercase',
    },
    detailedCardSecText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(15, 830),
    },
    detailedCardContainer: {
      backgroundColor: theme.colors.primaryWhite,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: SCREEN_HEIGHT * 0.02,
      paddingHorizontal: SCREEN_WIDTH * 0.024,
      marginBottom: SCREEN_HEIGHT * 0.012,
    },
    detailedStatusText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(12, 830),
    },
    emptyText: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      flex: 1,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Medium,
    },
    emptyContaier: {
      width: '100%',
      alignItems: 'center',
    },
    headingText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(24, 830),
    },
    horizontalFlatlistContaier: {
      marginTop: SCREEN_HEIGHT * 0.026,
      width: '100%',
    },
    mainContainer: {
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    monthCard: {
      minWidth: SCREEN_WIDTH * 0.3,
      marginRight: SCREEN_WIDTH * 0.029,
    },
    monthCardInnerContainer: {
      paddingHorizontal: SCREEN_WIDTH * 0.029,
      paddingTop: SCREEN_HEIGHT * 0.013,
    },
    monthCardImpayeeContainer: {
      paddingHorizontal: SCREEN_WIDTH * 0.029,
      paddingVertical: 7,
    },
    monthYearInnerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    monthAndYearText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(16, 830),
      textTransform: 'capitalize',
    },
    subHeadingText: {
      color: theme.colors.lightChoco,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(15, 830),
    },
    statusContainer: {
      paddingLeft: 5,
      width: '70%',
    },
    statusText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(12, 830),
    },
    statusAmtText: {
      color: theme.colors.primaryWhite,
      fontFamily: FONTS.OpenSans_SemiBold,
      fontSize: RFValue(12, 830),
    },
    totalText: {
      color: theme.colors.cobalt,
      fontFamily: FONTS.OpenSans_SemiBold,
      fontSize: RFValue(14, 830),
    },
    totalAmtText: {
      color: theme.colors.cobalt,
      fontFamily: FONTS.OpenSans_Bold,
      fontSize: RFValue(14, 830),
    },
  });

/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import Localization from '../../localization/Localization';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import {useDispatch} from 'react-redux';
import {Set_ModuleDetails_Success} from '../../redux/interactiveTraining/InteractiveTraining-action';
import {INT_FORMATION_DETAILS_CONST} from '../../redux/interactiveTraining/InteractiveTraining-constant';
import {lastStatus} from '../../utils/commonHelper/LastStatus';
import { DateFormats } from '../../utils/constants/constants';

const IntModuleCardComp = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const dispatch = useDispatch();

  let date =
    props.data != undefined
      ? moment(new Date(props.data.created)).format(DateFormats.DateMonthYear)
      : '';

  const getStatus = status => {
    switch (status) {
      case lastStatus.inProgress:
        return {
          status: Localization.t('training.inProgress'),
          color: theme.colors.inProgessColor,
        };
      case lastStatus.CourseFinished:
        return {
          status: Localization.t('training.testAvailable'),
          color: theme.colors.orange,
        };
      case lastStatus.TestCompleted:
        return {
          status: Localization.t('training.testSuccess'),
          color: theme.colors.lightGreen,
        };
      case lastStatus.TestFailed:
        return {
          status: Localization.t('training.testFailed'),
          color: theme.colors.darkRed,
        };
      default:
        //this is for null
        return {
          status: Localization.t('training.trainingAvailable'),
          color: theme.colors.skyBlue,
        };
    }
  };

  const handleNavigation = () => {
    dispatch(
      Set_ModuleDetails_Success(
        INT_FORMATION_DETAILS_CONST.SET_MODULENAME_SUCCESS,
        props.data.title,
      ),
    );
    if (
      !props.data.lastStatus ||
      props.data.lastStatus === lastStatus.inProgress
    ) {
      props.customProps.navigation.navigate('TrainingSlideScreen', {
        data: props.data,
      });
    }
    if (props.data.lastStatus === lastStatus.CourseFinished) {
      props.customProps.navigation.navigate('QuestionsListScreen', {
        id: props.data.id,
      });
    }
    if (
      props.data.lastStatus === lastStatus.TestCompleted &&
      Number(props.data.scoreRate) >= 50
    ) {
      props.customProps.navigation.navigate('TestSuccessScreen', {
        testRes: props.data,
      });
    }
    if (
      props.data.lastStatus === lastStatus.TestCompleted &&
      Number(props.data.scoreRate) < 50
    ) {
      props.customProps.navigation.navigate('TestFailedScreen', {
        testRes: props.data,
        id: props.data.id,
      });
    }
  };

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View style={styles.parentView}>
        <Ionicons
          name="document"
          color={theme.colors.darkCerulean}
          size={SCREEN_WIDTH * 0.09}
        />
        <View style={{marginLeft: SCREEN_WIDTH * 0.034, flex: 1}}>
          <Text numberOfLines={1} style={styles.title}>
            {props.data.title}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={[
                styles.boxView,
                {
                  backgroundColor:
                    props.data.lastStatus === lastStatus.TestCompleted
                      ? Number(props.data.scoreRate) >= 50
                        ? theme.colors.lightGreen
                        : theme.colors.darkRed
                      : getStatus(props.data.lastStatus).color,
                },
              ]}>
              <Text style={styles.typeText}>
                {props.data.lastStatus === lastStatus.TestCompleted
                  ? Number(props.data.scoreRate) >= 50
                    ? Localization.t('training.testSuccess')
                    : Localization.t('training.testFailed')
                  : getStatus(props.data.lastStatus).status}
              </Text>
            </View>
            <Text
              style={{
                marginLeft: 3,
                fontFamily: FONTS.OpenSans_SemiBold,
                fontSize: RFValue(14, 830),
                color:
                  Number(props.data.scoreRate) >= 50
                    ? theme.colors.lightGreen
                    : theme.colors.darkRed,
              }}>
              {props.data.scoreRate ? `${props.data.scoreRate}%` : null}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.dateText}>
            {`${Localization.t('training.majDate')}${'\n'}${date}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default IntModuleCardComp;

const useStyles = theme =>
  StyleSheet.create({
    boxView: {
      backgroundColor: theme.colors.darkRed,
      height: SCREEN_HEIGHT * 0.027,
      justifyContent: 'center',
      paddingHorizontal: SCREEN_WIDTH * 0.024,
      width: SCREEN_WIDTH * 0.3,
    },
    dateText: {
      alignItems: 'flex-end',
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(14, 812),
      paddingRight: SCREEN_WIDTH * 0.036,
      textAlignVertical: 'center',
    },
    parentView: {
      backgroundColor: theme.colors.primaryWhite,
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.084,
      marginBottom: SCREEN_HEIGHT * 0.019,
      padding: SCREEN_HEIGHT * 0.014,
    },
    title: {
      color: theme.colors.licorice,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.OpenSans_SemiBold,
    },
    threeAboveSectionTouch: {
      flex: 1,
      height: SCREEN_WIDTH * 0.29,
      marginRight: SCREEN_WIDTH * 0.02,
      paddingVertical: 10,
      width: SCREEN_WIDTH * 0.29,
    },

    typeText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(12, 812),
      fontFamily: FONTS.OpenSans_Regular,
      textAlignVertical: 'center',
    },
  });

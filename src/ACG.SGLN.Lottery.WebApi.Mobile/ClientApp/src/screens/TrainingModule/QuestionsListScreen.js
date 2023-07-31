import {useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RadioGroup from '../../components/RadioBtn/RadioGroup';

import {showToast} from '../../components/customs/Toast';
import Localization from '../../localization/Localization';
import {GetQuestions} from '../../services/training/GetQuestions';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import {getOptionsArray} from '../../utils/commonHelper/RadioBtnHelper';
import TestCompleteScreen from './TestCompleteScreen';

const QuestionsListScreen = props => {
  const theme = useTheme();
  const styles = useStyle(theme);
  const [questionsList, setQuestionsList] = useState([]);
  const [answerListObj, setanswerListObj] = useState({});
  const [answersList, setAnswersList] = useState([]);
  const [noOfQuestions, setNoOfQuestions] = useState(0);
  const [listRef, setlistRef] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setisCompleted] = useState(false);
  const [formationData, setFormationData] = useState({
    formationName: '',
    moduleName: '',
  });

  const formations = useSelector(state => state.formationDetails);

  useEffect(() => {
    callQuestionsAPI();
  }, []);

  useEffect(() => {
    if (formations.formationName) {
      setFormationData(prevState => ({
        ...prevState,
        formationName: formations.formationName ? formations.formationName : '',
        moduleName: formations.moduleName ? formations.moduleName : '',
      }));
    }
  }, [formations]);

  useEffect(() => {}, [formationData]);
  const callQuestionsAPI = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      const res = await GetQuestions(props.route.params.id);
      setNoOfQuestions(res.data.length);
      processArray(res.data);
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const processArray = data => {
    var finalArray = [];
    var tempArray = [];
    for (let i = 0; i < data.length; i++) {
      if (i % 2 === 0) {
        tempArray.push(data[i], data[i + 1] ? data[i + 1] : null);
        finalArray.push(tempArray);
        tempArray = [];
      }
    }
    setQuestionsList(finalArray);
  };

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View>
          <Card {...item[0]} />
          {item[1] && <Card {...item[1]} />}
        </View>
      );
    },
    [formationData],
  );

  const keyExtractor = useCallback(item => {
    return item.id;
  }, []);

  const handleScrollToNext = () => {
    if (currentIndex < questionsList.length - 1) {
      listRef.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    } else {
      if (Object.keys(answerListObj).length === noOfQuestions) {
        setisCompleted(true);
      } else {
        showToast(
          Localization.t('common.allAreMendatory'),
          'bottom',
          'error',
          2000,
        );
      }
    }
  };

  const handleScrollToPrev = () => {
    if (currentIndex > 0) {
      listRef.scrollToIndex({index: currentIndex - 1});
      setCurrentIndex(currentIndex - 1);
    }
  };

  function Card(item) {
    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={[styles.cardScrollAbleContainer]}>
        <View style={styles.questionHeaderContainer}>
          <View style={styles.moduleNameContainer}>
            <Text style={styles.questionLabelText} numberOfLines={1}>
              {formationData.formationName}
            </Text>
            <Text style={styles.questionLabelSubText} numberOfLines={3}>
              {formationData.moduleName}
            </Text>
          </View>
          <View style={styles.questionContainer}>
            <Text style={styles.questionHeadingText}>Question </Text>
            <Text style={styles.questionText}>{item.label}</Text>
          </View>
        </View>
        <View style={styles.radioBtnContainer}>
          <RadioGroup
            activeButtonId={answerListObj[item.id]}
            circleStyle={{
              fillColor: theme.colors.darkCerulean,
            }}
            onChange={value => {
              answerListObj[item.id] = value.id;
            }}
            options={getOptionsArray(item)}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <ImageBackground
        source={require('../../assets/backgroundImage.png')}
        style={{width: '100%', height: '100%'}}>
        {isCompleted ? (
          <TestCompleteScreen
            isVisible={setisCompleted}
            changeCurrentIdex={setCurrentIndex}
            trainingID={props.route.params.id}
            customProps={props}
            answerList={answerListObj}
          />
        ) : (
          <>
            <View style={styles.mainContainer}>
              <Text style={styles.headerTitle}>
                {Localization.t('training.trainingTitle')}
              </Text>
              <Text style={styles.belowTitle}>
                {Localization.t('training.traingingSubTitle')}
              </Text>
            </View>
            <View>
              <FlatList
                bounces={false}
                data={questionsList}
                horizontal={true}
                keyExtractor={keyExtractor}
                ListFooterComponent={() => {
                  return <View style={{height: 150}} />;
                }}
                pagingEnabled={true}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                ref={ref => {
                  setlistRef(ref);
                }}
              />
            </View>
            <View style={[styles.navigationBtnContainer]}>
              {currentIndex > 0 && (
                <TouchableOpacity
                  onPress={handleScrollToPrev}
                  style={styles.arrowLeftContainer}>
                  <AntDesign
                    name="arrowleft"
                    size={24}
                    color={theme.colors.darkCerulean}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleScrollToNext}
                style={styles.arrowRightContainer}>
                <AntDesign
                  name="arrowright"
                  size={24}
                  color={theme.colors.darkCerulean}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </ImageBackground>
    </>
  );
};

export default QuestionsListScreen;

const useStyle = theme =>
  StyleSheet.create({
    arrowLeftContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      marginRight: 5,
      width: SCREEN_WIDTH * 0.1,
    },
    arrowRightContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      width: SCREEN_WIDTH * 0.1,
    },
    belowTitle: {
      alignSelf: 'center',
      color: theme.colors.lightGray,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Regular,
      justifyContent: 'center',
      marginBottom: SCREEN_HEIGHT * 0.034,
      opacity: 0.5,
    },
    cardScrollAbleContainer: {
      paddingHorizontal: '5%',
      width: SCREEN_WIDTH * 0.999,
      //   borderWidth:2
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
    },
    questionHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    questionLabelText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(14, 830),
    },
    questionLabelSubText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(12, 830),
    },
    questionContainer: {
      backgroundColor: theme.colors.primaryWhite,
      justifyContent: 'center',
      paddingHorizontal: 15,
      flex: 1,
    },
    questionHeadingText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(14, 830),
    },
    questionText: {
      color: theme.colors.fentGray,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(14, 830),
    },
    radioBtnContainer: {
      alignSelf: 'flex-start',
      marginVertical: 15,
      width: '100%',
    },
    mainContainer: {
      //   flex: 1,
      paddingHorizontal: SCREEN_HEIGHT * 0.01,
      marginTop: SCREEN_HEIGHT * 0.02,
    },
    moduleNameContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      justifyContent: 'center',
      minHeight: SCREEN_HEIGHT * 0.12,
      padding: 5,
      width: SCREEN_HEIGHT * 0.12,
    },
    navigationBtnContainer: {
      bottom: '10%',
      flexDirection: 'row',
      position: 'absolute',
      right: SCREEN_WIDTH * 0.06,
    },
  });

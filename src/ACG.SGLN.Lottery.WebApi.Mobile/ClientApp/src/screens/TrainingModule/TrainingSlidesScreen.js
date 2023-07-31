import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../components/customs/Loader';
import {showToast} from '../../components/customs/Toast';

import Localization from '../../localization/Localization';
import {ImageURL} from '../../services/serviceHelper/ServiceUtilites';
import {GetTrainingSlidesById} from '../../services/training/GetTrainingSlidesByID';
import {StartTraining} from '../../services/training/StartTraining';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import NetworkUtils from '../../utils/NetInfoHelper/NetInfo';
import TrainingCompleteScreen from './TrainingCompleteScreen';

const TrainingSlidesScreen = props => {
  const theme = useTheme();
  const styles = useStyle(theme);
  const [trainingSlides, setTrainingSlides] = useState([]);
  const [slidesAdditionalData, setSlidesAdditionalData] = useState({});
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const [listRef, setlistRef] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setisCompleted] = useState(false);

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = async () => {
    if (await NetworkUtils.isNetworkAvailable()) {
      setIsLoaderVisible(true);
      
      const res = await GetTrainingSlidesById(props.route.params.data.id);
      if (res.isSuccess) {
        setTrainingSlides(res.data.listTrainingCourseSlide);
        setSlidesAdditionalData(prevState => ({
          ...prevState,
          trainingTitle: res.data.trainingTitle,
          moduleName: res.data.moduleName,
        }));
        const startRes = await StartTraining(props.route.params.data.id);
        if (startRes.isSuccess) {
          console.log('Started SuccessFull');
        } else {
          console.log('Started failed');
        }
        setIsLoaderVisible(false);
      } else {
        setIsLoaderVisible(true);
      }
    } else {
      showToast(Localization.t('common.noInternet'), 'bottom', 'error', 1000);
    }
  };

  const handleScrollToNext = () => {
    if (currentIndex < trainingSlides.length - 1) {
      listRef.scrollToIndex({index: currentIndex + 1});
      setCurrentIndex(currentIndex + 1);
    } else {
      setisCompleted(true);
    }
  };

  const handleScrollToPrev = () => {
    if (currentIndex > 0) {
      listRef.scrollToIndex({index: currentIndex - 1});
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderSlides = ({item, index}) => {
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.cardScrollAbleContainer}>
          <View style={styles.cardSubContainer}>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.moduleNameContainer}>
                <Text style={styles.moduleNameText}>
                  {slidesAdditionalData.moduleName}
                </Text>
              </View>
              <View style={styles.trainingTitleContainer}>
                <Text style={styles.trainingTitleText}>
                  {slidesAdditionalData.trainingTitle}
                </Text>
              </View>
            </View>
            <Image
              resizeMode="stretch"
              source={{uri: `${ImageURL}TrainingCourseSlide/${item.id}`}}
              style={styles.imageStyle}
            />
            <View style={styles.descTextContainer}>
              <Text style={styles.descText}>{item.body}</Text>
            </View>
          </View>
        </ScrollView>
      </>
    );
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/backgroundImage.png')}
        style={{width: '100%', height: '100%'}}>
        {isCompleted ? (
          <TrainingCompleteScreen
            isVisible={setisCompleted}
            id={props.route.params.data.id}
            customProps={props}
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
            <FlatList
              contentContainerStyle={{
                height: SCREEN_HEIGHT * 0.8,
              }}
              bounces={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              pagingEnabled={true}
              data={trainingSlides}
              keyExtractor={item => item.id}
              renderItem={renderSlides}
              ref={ref => {
                setlistRef(ref);
              }}
            />

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
        <Modal
          visible={isLoaderVisible}
          transparent={true}
          statusBarTranslucent={true}>
          <Loader />
        </Modal>
      </ImageBackground>
    </>
  );
};

export default TrainingSlidesScreen;

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
      width: SCREEN_WIDTH * 0.99,
    },
    cardSubContainer: {
      marginBottom: 80,
    },
    descTextContainer: {marginTop: SCREEN_HEIGHT * 0.028, marginBottom: 100},
    descText: {
      color: theme.colors.primaryWhite,
      fontSize: RFValue(16, 830),
      fontFamily: FONTS.OpenSans_Regular,
      textAlign: 'justify',
    },
    headerTitle: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(20, 812),
      fontFamily: FONTS.Montserrat_Bold,
      justifyContent: 'center',
    },
    imageStyle: {width: '100%', height: SCREEN_HEIGHT * 0.24},
    mainContainer: {
      paddingHorizontal: SCREEN_HEIGHT * 0.01,
      marginTop: SCREEN_HEIGHT * 0.02,
    },
    moduleNameContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.yellow,
      height: SCREEN_WIDTH * 0.24,
      justifyContent: 'center',
      width: SCREEN_WIDTH * 0.24,
    },
    moduleNameText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(14, 830),
    },
    navigationBtnContainer: {
      bottom: 100,
      flexDirection: 'row',
      position: 'absolute',
      right: SCREEN_WIDTH * 0.06,
    },
    trainingTitleContainer: {
      backgroundColor: theme.colors.primaryWhite,
      flex: 1,
      paddingHorizontal: SCREEN_WIDTH * 0.0364,
      paddingVertical: SCREEN_HEIGHT * 0.018,
    },
    trainingTitleText: {
      color: theme.colors.licorice,
      fontFamily: FONTS.OpenSans_SemiBold,
      fontSize: RFValue(15, 830),
    },
  });

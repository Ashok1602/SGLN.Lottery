import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import {useSelector} from 'react-redux';

import {
  FONTS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../src/styles/StyleConstant';
import Localization from '../localization/Localization';
import {RFValue} from 'react-native-responsive-fontsize';
import {Screens} from '../utils/constants/constants';

export function RightDrawerContent(props) {
  //UseState
  const theme = useTheme();
  const styles = useStyle(theme);

  const requestSelector = useSelector(state => state.RequestAll);

  const ParticularScreenNavigation = item => () => {
    if (item.targetScreen != null) {
      let screen = item.targetScreen.toLowerCase();
      props.drawerPosition(false);
      if (screen === Screens.AnnoucementsDetails.toLowerCase()) {
        const information = {
          id: item.targetId,
        };
        props.customProps.navigation.navigate(Screens.AnnoucementsDetails, {
          data: information,
        });
      } else if (screen === Screens.DetailsRequestScreen) {
        let filter =
          requestSelector.GetRequestSuccess.response.data.results.filter(
            a => a.id === item.targetId,
          );
        props.customProps.navigation.navigate(Screens.DetailsRequestScreen, {
          data: filter,
        });
      } else {
        props.customProps.navigation.navigate(item.targetScreen);
      }
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={ParticularScreenNavigation(item)}>
        <View
          style={{
            padding: SCREEN_HEIGHT * 0.019,
            borderBottomWidth: 0.8,
            borderBottomColor: theme.colors.lightGray,
          }}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={3}>
            {item.body}
          </Text>
          <View style={styles.imageView}>
            <View>
              <Feather
                name="arrow-right-circle"
                size={25}
                style={{justifyContent: 'center'}}
                color={theme.colors.yellow}
              />
            </View>
            <Text style={styles.dateContainer}>
              {Localization.t('common.Date')}
            </Text>
            <Text style={styles.dateContainer}>
              {moment(new Date(item.created)).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={{flex: 1}}>
        <FlatList
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bouncesZoom={false}
          data={props.list}
          keyExtractor={(item, index) => 'key' + index}
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
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const useStyle = theme =>
  StyleSheet.create({
    description: {
      color: theme.colors.licorice,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.OpenSans_Regular,
    },
    dateContainer: {
      color: theme.colors.cobalt,
      fontFamily: FONTS.OpenSans_Regular,
      fontSize: RFValue(13, 812),
      justifyContent: 'center',
      marginBottom: 3,
    },
    imageView: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    title: {
      color: theme.colors.licorice,
      fontSize: RFValue(15, 812),
      fontFamily: FONTS.Montserrat_Bold,
      marginBottom: 4,
    },
  });

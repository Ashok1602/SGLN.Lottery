/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {
  ImageURL,
  ResourceNature,
} from '../../services/serviceHelper/ServiceUtilites';
import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';
import {RFValue} from 'react-native-responsive-fontsize';

const NatureComponent = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const [tappedItem, setTappedItem] = useState('');

  const TappedItem = item => () => {
    setTappedItem(item.value);
    props.selectedData(item);
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          disabled={props.selection}
          onPress={TappedItem(item)}
          style={[
            styles.threeAboveSectionTouch,
            {
              backgroundColor:
                props.selection && item.value === props.natureName
                  ? theme.colors.yellow
                  : tappedItem === item.value
                  ? theme.colors.yellow
                  : theme.colors.gray,
            },
          ]}>
          <View style={styles.circleImage}>
            <Image
              source={{
                uri:
                  item.label &&
                  `${ImageURL}${ResourceNature}${'/'}${item.value}`,
              }}
              resizeMode="stretch"
              borderRadius={15}
              style={{
                width: SCREEN_WIDTH * 0.15,
                height: SCREEN_WIDTH * 0.15,
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: FONTS.Montserrat_Bold,
              fontSize: RFValue(12, 812),
            }}
            numberOfLines={1}>
            {item.label}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: SCREEN_WIDTH * 0.05,
        marginBottom: 10,
      }}>
      <FlatList
        data={props.list}
        horizontal
        keyExtractor={(item, index) => 'key' + index}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default NatureComponent;

const useStyles = theme =>
  StyleSheet.create({
    circleImage: {
      alignItems: 'center',
      borderRadius: SCREEN_WIDTH * 0.05,
      height: SCREEN_WIDTH * 0.1,
      justifyContent: 'center',
      width: SCREEN_WIDTH * 0.1,
    },
    mainContainer: {
      flex: 1,
    },
    threeAboveSectionTouch: {
      alignItems: 'center',
      flex: 1,
      height: SCREEN_HEIGHT * 0.15,
      justifyContent: 'space-evenly',
      marginBottom: SCREEN_HEIGHT * 0.013,
      marginRight: SCREEN_WIDTH * 0.02,
      paddingVertical: 10,
      paddingTop: SCREEN_HEIGHT * 0.013,
      width: SCREEN_WIDTH * 0.29,
    },
  });

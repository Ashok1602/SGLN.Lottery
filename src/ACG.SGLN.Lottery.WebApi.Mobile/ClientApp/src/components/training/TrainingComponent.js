/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';

import {FONTS, SCREEN_WIDTH} from '../../styles/StyleConstant';

const TrainingComponent = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const [tappedItem, setTappedItem] = useState('');
  useEffect(() => {
    if (tappedItem === '') {
      setTappedItem('Formation');
    }
  }, []);

  const TappedItem = item => () => {
    setTappedItem(item.name);
    props.selectedData(item);
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          onPress={TappedItem(item)}
          style={[
            styles.threeAboveSectionTouch,
            {
              backgroundColor:
                tappedItem === item.name
                  ? theme.colors.yellow
                  : theme.colors.gray,
            },
          ]}>
          <View style={styles.parentView}>
            <Text style={styles.titleContainer}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View
      style={{
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

export default TrainingComponent;

const useStyles = theme =>
  StyleSheet.create({
    parentView: {
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
    threeAboveSectionTouch: {
      flex: 1,
      height: SCREEN_WIDTH * 0.29,
      paddingVertical: 10,
      width: SCREEN_WIDTH * 0.29,
      marginRight: SCREEN_WIDTH * 0.02,
    },
    titleContainer: {
      color: theme.colors.primaryBlack,
      fontFamily: FONTS.Montserrat_SemiBold,
      fontSize: RFValue(15, 812),
      textAlign: 'center',
    },
  });

/* eslint-disable prettier/prettier */
import React, {useState, useRef} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Localization from '../../localization/Localization';

import {FONTS, SCREEN_HEIGHT, SCREEN_WIDTH} from '../../styles/StyleConstant';

const SearchBarComponent = props => {
  const theme = useTheme();
  const styles = useStyles(theme);

  const [isCancel, setIsCancel] = useState(false);
  const [inputText, setInputText] = useState('');

  const SearchMethod = text => {
    text === '' ? setIsCancel(false) : setIsCancel(true);
    setInputText(text);
    props.searchValue(text);
  };
  const CancelClicked = () => {
    setIsCancel(false);
    props.searchValue('');
    setInputText('');
  };

  return (
    <View style={styles.parentView}>
      <TextInput
        placeholder={Localization.t('training.placeHolderText')}
        placeholderTextColor={theme.colors.primaryBlack}
        style={styles.textInput}
        value={inputText}
        onChangeText={text => SearchMethod(text)}
      />
      {isCancel && (
        <View style={{justifyContent: 'center'}}>
          <MaterialIcons
            onPress={CancelClicked}
            name="cancel"
            style={styles.iconContainer}
            color={theme.colors.darkCerulean}
            size={30}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBarComponent;

const useStyles = theme =>
  StyleSheet.create({
    iconContainer: {
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    parentView: {
      backgroundColor: theme.colors.gray,
      flexDirection: 'row',
      height: SCREEN_HEIGHT * 0.067,
      marginVertical: SCREEN_HEIGHT * 0.029,
      paddingHorizontal: 10,
    },
    threeAboveSectionTouch: {
      flex: 1,
      height: SCREEN_WIDTH * 0.28,
      paddingVertical: 10,
      width: SCREEN_WIDTH * 0.28,
      marginRight: SCREEN_WIDTH * 0.02,
    },
    textInput: {
      color: theme.colors.primaryBlack,
      fontFamily: FONTS.Montserrat_Regular,
      fontSize: RFValue(16, 812),
      flex: 1,
    },
  });

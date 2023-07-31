import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import RadioOn from 'react-native-vector-icons/Fontisto';
import {useTheme} from '@react-navigation/native';

import Localization from '../../localization/Localization';

const CustomPopup = props => {
  const theme = useTheme();
  const styles = useStyles(theme);
  //Methods
  const TappedCategory = item => () => {
    props.statechange(false);
    props.categoryObject(item);
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <TouchableOpacity onPress={TappedCategory(item)}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.itemTextContainer}>{item.value}</Text>
            <RadioOn
              style={{flex: 0.2}}
              name={
                item.value === props.selectedTitle
                  ? 'radio-btn-active'
                  : 'radio-btn-passive'
              }
              color={theme.colors.primaryBlack}
              size={18}
            />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={props.visibility}
        onRequestClose={() => {
          props.statechange(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            props.statechange(false);
          }}>
          <View style={styles.parentViewContainer}>
            <View style={styles.modalStyle}>
              <Text style={styles.textContainer}> {props.categoryTitle}</Text>
              <FlatList
                data={props.list}
                renderItem={renderItem}
                keyExtractor={(item, index) => 'key' + index}
                ListEmptyComponent={() => (
                  <View>
                    <Text style={[styles.emptyText]}>
                      {Localization.t('common.emptyData')}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default CustomPopup;

const useStyles = theme =>
  StyleSheet.create({
    buttonText: {
      alignSelf: 'center',
      color: theme.colors.primaryWhite,
      fontSize: RFValue(14, 812),
      textAlignVertical: 'center',
    },
    emptyText: {
      alignSelf: 'center',
      color: theme.colors.primaryBlack,
      flex: 1,
      fontSize: RFValue(15, 812),
    },
    mainContainer: {
      flex: 1,
      height: '100%',
    },
    modalMainView: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
    },
    modalStyle: {
      alignSelf: 'center',
      backgroundColor: theme.colors.primaryWhite,
      width: '80%',
    },
    modelItemStyle: {
      backgroundColor: theme.colors.primaryBlack,
      borderRadius: 250,
      marginVertical: 10,
      paddingVertical: 17,
      paddingHorizontal: 18,
    },
    parentViewContainer: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      flex: 1,
      height: '100%',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
    },
    textContainer: {
      alignSelf: 'center',
      color: theme.colors.darkCerulean,
      justifyContent: 'center',
      paddingVertical: 10,
    },
    itemTextContainer: {
      flex: 0.8,
      justifyContent: 'center',
      paddingLeft: 30,
      marginBottom: 10,
      marginHorizontal: 10,
    },
  });

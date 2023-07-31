import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Text} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {FONTS} from '../../styles/StyleConstant';

const labelView = (item, index) => {
  const theme = useTheme();
  return (
    <Text
      style={{
        flex: 1,
        color: theme.colors.primaryWhite,
        fontFamily: FONTS.OpenSans_Regular,
        fontSize: RFValue(14, 830),
      }}>
      {item.options ? item.options[index].label : '-'}
    </Text>
  );
};

export const getOptionsArray = item => {
  if (item.options.length === 4) {
    return [
      {
        trainingQuestionId: item.options
          ? item.options[0].trainingQuestionId
          : '-',
        id: item.options ? item.options[0].id : '-',
        labelView: labelView(item, 0),
        // index:ite
      },
      {
        labelView: labelView(item, 1),
        trainingQuestionId: item.options
          ? item.options[1].trainingQuestionId
          : '-',
        id: item.options ? item.options[1].id : '-',
      },
      {
        labelView: item.options[2] ? labelView(item, 2) : null,
        trainingQuestionId: item.options
          ? item.options[2].trainingQuestionId
          : '-',
        id: item.options ? item.options[2].id : '-',
      },
      {
        labelView: item.options[3] ? labelView(item, 3) : <View />,
        trainingQuestionId: item.options
          ? item.options[3]?.trainingQuestionId
          : '-',
        id: item.options ? item.options[3]?.id : '-',
      },
    ];
  }
  if (item.options.length === 3) {
    return [
      {
        trainingQuestionId: item.options
          ? item.options[0].trainingQuestionId
          : '-',
        id: item.options ? item.options[0].id : '-',
        labelView: labelView(item, 0),
        // index:ite
      },
      {
        labelView: labelView(item, 1),
        trainingQuestionId: item.options
          ? item.options[1].trainingQuestionId
          : '-',
        id: item.options ? item.options[1].id : '-',
      },
      {
        labelView: item.options[2] ? labelView(item, 2) : null,
        trainingQuestionId: item.options
          ? item.options[2].trainingQuestionId
          : '-',
        id: item.options ? item.options[2].id : '-',
      },
    ];
  }
};

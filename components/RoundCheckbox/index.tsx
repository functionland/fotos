import * as React from 'react';
import { Animated, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
interface Props {
  onValueChange: Function;
  icon: 'check';
  size: number;
  backgroundColor: string;
  iconColor: string;
  borderColor: string;
  checked: Animated.Value;
}

const RoundCheckbox: React.FC<Props> = (props) => {


    const { size, backgroundColor, borderColor, icon, iconColor } = props;
    const iconSize = size * 1.3;

    const _onPress = () => {
      //props.onValueChange(!props.checked.value);
    };

    return (
      <TouchableWithoutFeedback hitSlop={hitSlop} onPress={_onPress}>
        <View style={styles.parentWrapper} shouldRasterizeIOS={true}>
          <Animated.View
            style={[
              {
                borderColor,
                backgroundColor: 'transparent',
                width: size,
                height: size,
                borderRadius: size / 2,
                opacity: props.checked.interpolate({
                  inputRange: [0, 0.9],
                  outputRange: [1, 0],
                  }
                )
              },
              styles.commonWrapperStyles,
            ]}
          />
          <Animated.View style={
            [
              {
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                width: size,
                height: size,
                borderRadius: size / 2,
                opacity: props.checked,
                transform: [
                  {
                    scale: props.checked
                  }
                ]
              },
              styles.checkedStyles, styles.commonWrapperStyles, 
            ]}>
            <MaterialIcons
              name={icon}
              color={iconColor}
              size={Math.ceil(iconSize/1.5)}
              style={{
                height: iconSize,
                backgroundColor: 'transparent',
                alignSelf: 'center',
                textAlignVertical:'center'
              }}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  parentWrapper: {
    position: 'relative',
  },
  commonWrapperStyles: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedStyles: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
});

export default RoundCheckbox;
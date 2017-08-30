// @flow
import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 50,
    paddingVertical: 10,
  },
  content: {
    alignSelf: 'center',
  },
});

type Props = {
  icon?: ?React.Element<*>,
  children?: ?React.Element<*>,
  onPress: (event: Event) => void,
};

const defaultProps = {
  icon: null,
  children: null,
};

const Section = ({ icon, children, onPress }: Props) =>
  (<TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.SelectableBackground()}
  >
    <View style={styles.container}>
      {icon &&
        <View style={styles.iconContainer}>
          {icon}
        </View>}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  </TouchableNativeFeedback>);

Section.defaultProps = defaultProps;

export default Section;

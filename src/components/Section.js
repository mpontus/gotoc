// @flow
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
};

const defaultProps = {
  icon: null,
  children: null,
};

const Section = ({ icon, children }: Props) =>
  (<View style={styles.container}>
    {icon &&
      <View style={styles.iconContainer}>
        {icon}
      </View>}
    <View style={styles.content}>
      {children}
    </View>
  </View>);

Section.defaultProps = defaultProps;

export default Section;

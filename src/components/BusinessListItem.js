// @flow
import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import type { Business } from 'types/Business';

type Props = {
  style?: Object,
  business: Business,
};

const defaultProps = {
  style: undefined,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  image: {
    width: 90,
    height: 90,
    flex: 0,
    margin: 5,
  },
  name: {
    fontWeight: '900',
    fontSize: 15,
    lineHeight: 25,
  },
});

const BusinessListItem = ({ style, business }: Props): React.Element<*> =>
  (<View style={style}>
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: business.image_url }} />
      <View>
        <View>
          <Text style={styles.name}>
            {business.name}
          </Text>
        </View>
        <View>
          <View>
            <Text>{`${business.location.display_address[0]}\n${business.location
              .display_address[1]}`}</Text>
          </View>
          <View>
            <Text>
              {business.display_phone}
            </Text>
          </View>
        </View>
      </View>
    </View>
  </View>);

BusinessListItem.defaultProps = defaultProps;

export default BusinessListItem;

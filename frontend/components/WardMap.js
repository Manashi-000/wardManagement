import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Card, Button } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';

const { width } = Dimensions.get('window');

const WardMap = ({ organizations }) => {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 27.7172, // Kathmandu center
        longitude: 85.3240,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {organizations.map(org => (
        <Marker
          key={org.id}
          coordinate={{
            latitude: org.latitude,
            longitude: org.longitude,
          }}
          title={org.name}
          description={org.type}
        >
          <Callout tooltip>
            <Card style={{ width: 250 }}>
              <Card.Title title={org.name} subtitle={org.type} />
              <Carousel
                data={org.images}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item }}
                    style={{ width: 230, height: 120, borderRadius: 8 }}
                  />
                )}
                sliderWidth={250}
                itemWidth={230}
              />
              <Card.Actions>
                <Button onPress={() => alert(`Contact: ${org.contact}`)}>Contact</Button>
              </Card.Actions>
            </Card>
          </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

export default WardMap;

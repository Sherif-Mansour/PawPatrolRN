import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';

const AdDetailsScreen = ({ route }) => {
  const theme = useTheme();
  const { ad } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: ad.picture }} style={styles.adImage} />
        <Card.Title
          titleStyle={styles.adTitle}
          title={ad.title}
          subtitle={`Rating: ${ad.rating || 'N/A'}`}
          subtitleStyle={styles.adTitle}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.adContent}>
            {ad.description}
          </Text>
          <Text style={styles.adContent}>Address: {ad.address}</Text>
          <Text style={styles.adContent}>
            Services: {ad.services.join(', ')}
          </Text>
          <Text style={styles.adContent}>Category: {ad.category}</Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF3D6',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  adImage: {
    height: 300,
  },
  adTitle: {
    fontWeight: 'bold',
  },
  adContent: {
    marginBottom: 10,
  },
});

export default AdDetailsScreen;

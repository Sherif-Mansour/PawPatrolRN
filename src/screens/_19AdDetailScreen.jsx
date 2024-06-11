import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useTheme, Card, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

const AdDetails = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { ad } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.adContainer}>
        {ad.picture ? (
          <Card.Cover source={{ uri: ad.picture }} style={styles.adImage} />
        ) : (
          <Image source={require('../../assets/images/OIP.jpeg')} style={styles.adImage} />
        )}
        <Card.Title
          titleStyle={styles.adTitle}
          title={ad.title}
          subtitle={`Category: ${ad.category}`}
          subtitleStyle={styles.adTitle}
        />
        <Card.Content>
          <Text style={styles.adContent}>
            {ad.description}
          </Text>
          <Text style={styles.adContent}>
            Address: {ad.address}
          </Text>
          <Text style={styles.adContent}>
            Services: {ad.services.join(', ')}
          </Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('BookAppointment', { ad })}
        style={styles.bookButton}
      >
        Book Appointment
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  adContainer: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    paddingTop: 5,
    marginBottom: 10,
    position: 'relative',
  },
  adImage: {
    height: 200,
    width: '90%',
    alignSelf: 'center',
  },
  adTitle: {
    fontWeight: 'bold',
    color: 'black',
  },
  adContent: {
    color: 'black',
    marginBottom: 10,
  },
  bookButton: {
    marginTop: 20,
  },
});

export default AdDetails;

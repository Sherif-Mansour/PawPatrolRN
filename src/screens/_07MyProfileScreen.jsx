import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useUser } from '../../utils/UserContext';
import { Avatar, Card, Button, Icon, Text, Divider, SegmentedButtons, useTheme, IconButton } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ViewMyProfile = ({ navigation }) => {
    const theme = useTheme();
    const route = useRoute();
    const { profile } = route.params;
    const { user, ads, fetchUserAds, deleteAd, loadingUserAds, setCurrentAd } = useUser();
    const [selectedSegment, setSelectedSegment] = useState('user');

    useEffect(() => {
        if (user) {
            fetchUserAds();
        }
    }, [user]);

    const handleDeleteAd = async adId => {
        Alert.alert('Delete Ad', 'Are you sure you want to delete this ad?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deleteAd(adId),
            },
        ]);
    };

    const handleEditAd = ad => {
        setCurrentAd(ad); // Set the current ad in the context
        navigation.navigate('Ad'); // Navigate to the Ad screen
    };

    const renderButton = () => {
        if (user) {
            return (
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Profile')}
                >
                    Edit Profile
                </Button>
            );
        }
    };

    const renderUserInfo = () => (
        <View style={styles.section}>
            <Text>Age: {profile.age}</Text>
            <Text>Occupation: {profile.occupation}</Text>
            <Text>Bio: {profile.bio}</Text>
            <Divider style={styles.divider} />
            <Text>My Listings</Text>
            {renderAds()}
        </View>
    );

    const renderPetInfo = () => (
        <View style={styles.section}>
            {profile.pets && profile.pets.map((pet, index) => (
                <View key={index}>
                    <Text>Name: {pet.name}</Text>
                    <Text>Species: {pet.species}</Text>
                    <Text>Breed: {pet.breed}</Text>
                    <Text>Age: {pet.age}</Text>
                    <Text>Gender: {pet.gender}</Text>
                </View>
            ))}
        </View>
    );

    const renderOtherInfo = () => (
        <View style={styles.section}>
            <Text>Favorite Hobby: {profile.otherInfo.favoriteHobby}</Text>
            <Text>Favorite Food: {profile.otherInfo.favoriteFood}</Text>
        </View>
    );


    const renderAds = () => (
        <FlatList
            data={ads}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
            ListEmptyComponent={<Text>No ads found.</Text>}
        />
    );

    const renderItem = ({ item }) => (
        <Card style={styles.adContainer}
            onPress={() => navigation.navigate('AdDetails', { ad: item })}
        >
            <Card.Cover source={{ uri: item.mainPicture || 'https://picsum.photos/id/237/200/' }} style={styles.adImage} />
            <Card.Title
                title={item.title}
                subtitle={`Price: ${item.price}`}
                subtitleStyle={styles.adSubtitle}
                titleStyle={styles.adTitle}
            />
            <View style={styles.buttonsContainer}>
                <IconButton
                    icon="square-edit-outline"
                    iconColor='#009B7D'
                    mode="contained"
                    onPress={() => handleEditAd(item)} />
                <IconButton
                    icon="trash-can-outline"
                    iconColor='#ff0000'
                    mode="contained"
                    onPress={() => handleDeleteAd(item.id)} />
            </View>
        </Card>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 20,
            marginBottom: 12,
            backgroundColor: 'white',
        },
        headerContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
        },
        profilePicture: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 20,
        },
        username: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        adContainer: {
            borderWidth: 1,
            borderColor: '#ddd',
            marginBottom: 10,
            position: 'relative',
            width: '46%',
            margin: '2%',
        },
        adImage: {
            height: 200,
            width: '100%',
        },
        adTitle: {
            fontWeight: 'bold',
        },
        adSubtitle: {
            fontSize: 14,
            color: '#666',
        },
        renderButtonContainer: {
            position: 'absolute',
            top: 8,
            right: 8,
        },
        sectionContainer: {
            width: '100%',
            alignItems: 'flex-start',
            marginBottom: 16,
        },
        buttonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        divider: {
            width: '100%',
            marginVertical: 8,
        },
        editButton: {
            padding: 5,
            margin: 10,
        },
        deleteButton: {
            padding: 5,
            margin: 10,
        },
        flatListContent: {
            flexGrow: 1,
            justifyContent: 'center',
        },
    });

    if (loadingUserAds) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.headerContainer}>
                    <View style={styles.renderButtonContainer}>
                        {renderButton()}
                    </View>
                    {profile.profilePicture ? (
                        <Image source={{ uri: profile.profilePicture }} style={styles.profilePicture} />
                    ) : (
                        <Avatar.Icon size={60} icon="account" style={styles.profilePicture} />
                    )}
                    <Text style={styles.username}>{profile.firstName} {profile.lastName}</Text>
                    <Text >5.0 <Icon source='star' color='gold' size={20} /></Text>
                    <Text style={{ fontSize: 16 }}>
                        {profile.address && profile.address.city ? (
                            <><Icon source='map-marker' color='rgb(0, 104, 123)' size={20} />{profile.address.city}</>
                        ) : null}
                    </Text>
                    <Divider style={styles.divider} />
                </View>
                <SegmentedButtons
                    value={selectedSegment}
                    onValueChange={setSelectedSegment}
                    buttons={[
                        { value: 'user', label: `About Me` },
                        { value: 'pets', label: `My Pets` },
                        { value: 'other', label: 'Other Info' },
                    ]}
                />
                {selectedSegment === 'user' && renderUserInfo()}
                {selectedSegment === 'pets' && renderPetInfo()}
                {selectedSegment === 'other' && renderOtherInfo()}
            </View>
        </SafeAreaProvider>
    );
};

export default ViewMyProfile;

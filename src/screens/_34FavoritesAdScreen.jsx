import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useUser } from '../../utils/UserContext';
import { Card, Text } from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

const FavoriteAdsScreen = ({ route, navigation }) => {
    const { list } = route.params;
    const theme = useTheme();
    const {
        favorites,
        ads,
        handleAddToFavorites,
        loadingAllAds,
        fetchUserFavorites,
        loadingFavorites,
    } = useUser();
    const [favoriteAds, setFavoriteAds] = useState([]);

    useEffect(() => {
        const loadFavorites = async () => {
            await fetchUserFavorites();
        };
        loadFavorites();
    }, []);

    useEffect(() => {
        if (ads.length > 0) {
            const favAds = ads.filter(ad => list.favorites.includes(ad.id));
            setFavoriteAds(favAds);
        }
    }, [list.favorites, ads]);

    const renderAd = ({ item }) => (
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
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleAddToFavorites(item.id)}>
                <Icon
                    name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                    size={24}
                    color="#ff0000"
                />
            </TouchableOpacity>
        </Card>
    );

    if (loadingAllAds || loadingFavorites) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{list.name}</Text>
            </View>
            {favoriteAds.length > 0 ? (
                <FlatList
                    data={favoriteAds}
                    renderItem={renderAd}
                    keyExtractor={item => item.id}
                    numColumns={2}
                />
            ) : (
                <Text style={styles.noFavoritesText}>No favorites in this list.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 5,
    },
    headerText: {
        fontSize: 32,
        color: 'black',
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
        height: 150,
        width: '100%',
    },
    adTitle: {
        fontWeight: 'bold',
        // color: theme.colors.onPrimaryContainer,
    },
    favoriteButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    noFavoritesText: {
        textAlign: 'center',
        marginTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FavoriteAdsScreen;

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

const MyButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
};

MyButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default MyButton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'blue',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    title: {
        color: 'white',
        textAlign: 'center',
    },
});

import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const MyTextInput = (props) => {
    const theme = useTheme();

    return (
        <View>
            <TextInput {...props} placeholderTextColor={'white'} color='white' style={[styles.input, {color: theme.colors.onSurface, borderBottomColor: theme.colors.onPrimary}]} />
            <View style={styles.border} />
        </View>
    );
};

export default MyTextInput;

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderBottomWidth: 1,
    },
    border: {
        height: 1,
        marginBottom: 10,
    },
});
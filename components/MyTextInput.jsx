import { StyleSheet, TextInput, View } from "react-native";
import React from "react";

const myTextInput = (props) => {
    return (
        <View style={styles.container}>
            <TextInput style={styles.input} {...props} />
            <View style={styles.border} />
        </View>
    );
};

export default myTextInput;

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
    },
    border: {
        height: 1,
        backgroundColor: "black",
    },
});
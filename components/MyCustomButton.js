import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyCustomButton = ({ onPress, label }) => {
    const { colors } = useTheme();

    return (
        <Button
            mode="text"
            onPress={onPress}
            contentStyle={[styles.buttonContent, { backgroundColor: colors.background }]}
            style={styles.fullWidthButton}
            labelStyle={{ color: colors.onBackground }} // Set text color to onBackground color
            icon={({ size }) => <Icon name="chevron-right" size={size} color={colors.onBackground} />}
        >
            {label}
        </Button>
    );
};

const styles = StyleSheet.create({
    fullWidthButton: {
        width: '100%'
    },
    buttonContent: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
})

export default MyCustomButton
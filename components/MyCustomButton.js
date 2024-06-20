import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';


const MyCustomButton = ({ onPress, label }) => (
    <Button
        mode="text"
        onPress={onPress}
        contentStyle={styles.buttonContent}
        style={styles.fullWidthButton}
        icon={({ size }) => <Icon name="chevron-right" size={size} />}
    >
        {label}
    </Button>
);

const styles=StyleSheet.create({
    fullWidthButton: {
        width: '100%'
    },
    buttonContent: {
        flexDirection: 'row-reverse', // Places the icon to the right of the text
        justifyContent: 'space-between',
        alignItems: 'center'
    },
})

export default MyCustomButton
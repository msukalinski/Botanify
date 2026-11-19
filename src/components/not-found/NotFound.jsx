import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
// import { Ionicons } from '@expo/vector-icons'; // optional

export default function NotFound() {
    const navigation = useNavigation();

    return (
        <View style={styles.fullScreen}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.iconBackground}>
                        <Ionicons name='alert-circle-outline' size={36} color={colors.primaryGreen} />
                    </View>

                    <Text style={styles.title}>Page not found</Text>

                    <Text style={styles.message}>
                        The plant you’re looking for doesn’t exist or has been removed.
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.actionButton,
                            pressed && styles.pressed,
                        ]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name='arrow-back-circle' size={28} color="#FFFFFF" />
                        <Text style={styles.actionText}>Go back</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        padding: 18,
        backgroundColor: colors.screenBackground,
    },
    card: {
        width: '100%',
        maxWidth: 560,
        paddingHorizontal: 23,
        paddingVertical: 28,
        alignItems: 'center',
        gap: 10,
        borderRadius: 23,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    iconBackground: {
        width: 72,
        height: 72,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E7EFDD',
        marginBottom: 5,
    },
    title: {
        fontSize: 20,
        lineHeight: 27,
        fontWeight: '700',
        letterSpacing: -0.3,
        color: colors.mainText,
        textAlign: 'center',
    },
    message: {
        maxWidth: 320,
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        minHeight: 48,
        paddingHorizontal: 17,
        paddingVertical: 13,
        borderRadius: 15,
        backgroundColor: colors.primaryGreen,
        gap: 8,
        marginTop: 8,
    },
    actionText: {
        flexShrink: 1,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        opacity: 0.75,
    },
});
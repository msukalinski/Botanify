import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import { colors } from "../../theme";

export default function ErrorMessage({
    title = 'Something went wrong',
    message = 'We could not load this right now. Please try again',
    onRetry,
    retryLabel = 'Try again',
    fullScreen = false,
    style
}) {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen, style]}>
            <View style={styles.card}>
                <View style={styles.messageRow}>
                    <View style={styles.iconBackground} accessible={false}>
                        <Ionicons name="alert-circle-outline" size={25} color="#A63D32" />
                    </View>
                    <View style={styles.copy}>
                        <Text style={styles.title} accessibilityRole="header">{title}</Text>
                        <Text
                            style={styles.message}
                            accessibilityRole="header"
                            accessibilityLiveRegion="polite"
                        >
                            {message}
                        </Text>
                    </View>
                </View>

                {typeof onRetry === 'function' && (
                    <Pressable
                        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
                        onPress={onRetry}
                        accessibilityRole="button"
                        accessibilityLabel={retryLabel}
                    >
                        <Ionicons name="refresh-outline" size={19} color="#FFFFFF" />
                        <Text style={styles.retryText}>{retryLabel}</Text>
                    </Pressable>
                )}
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
        padding: 17,
        borderRadius: 21,
        borderWidth: 1,
        borderColor: '#F0D1CC',
        backgroundColor: '#FFF3F0',
        gap: 16,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 11,
    },
    iconBackground: {
        width: 41,
        height: 41,
        borderRadius: 14,
        backgroundColor: '#FBE0DA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    copy: {
        flex: 1,
        minWidth: 0,
        gap: 5,
    },
    title: {
        fontSize: 16,
        lineHeight: 23,
        fontWeight: '700',
        color: '#8E382C',
    },
    message: {
        fontSize: 13,
        lineHeight: 20,
        color: '#8C4239',
    },
    retryButton: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        minHeight: 46,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: '#A63D32',
        gap: 7,
    },
    retryText: {
        flexShrink: 1,
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.75,
    },
});
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme";

export default function LoadingIndicator({
    message = 'Loading...',
    fullScreen = false,
    style,
}) {
    return (
        <View
            style={[styles.container, fullScreen && styles.fullScreen, style]}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={message || 'Loading'}
            accessibilityState={{ busy: true }}
            accessibilityLiveRegion="polite"
        >
            <View style={styles.spinnerBackground} accessible={false}>
                <ActivityIndicator
                    size="large"
                    color={colors.primaryGreen}
                    animating
                    accessible={false}
                />
            </View>
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 14,
    },
    fullScreen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    spinnerBackground: {
        width: 74,
        height: 74,
        borderRadius: 25,
        backgroundColor: '#EAF0E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        maxWidth: 320,
        fontSize: 14,
        lineHeight: 21,
        color: colors.secondaryText,
        textAlign: 'center',
    },
});
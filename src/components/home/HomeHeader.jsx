import { Image, StyleSheet, Text, View } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";

import samplePlants from "../../data/plants";

import { colors } from "../../theme";

export default function HomeHeader() {
    return (
        <View style={styles.hero}>
            <View style={styles.heroText}>
                <View style={styles.greetingRow}>
                    <Text style={styles.greeting}>Good morning</Text>
                    <Text style={styles.greeting}></Text>
                    <Ionicons name="sunny" size={20} color='#E8AE2E' />
                </View>
                <Text style={styles.appName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                    Botanify
                </Text>
                <Text style={styles.tagline}>Happier plants.{'\n'}A brighter you.</Text>
            </View>
            <View style={styles.heroArt} accessible={false}>
                <View style={styles.heroBlob} />
                <Image source={samplePlants[0].image} style={styles.heroImage} />
                <View style={styles.heroLeafBadge}>
                    <Ionicons name="leaf" size={22} color={colors.primaryGreen} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 148,
    },
    heroText: {
        flex: 1,
        zIndex: 1,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
    },
    greeting: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.mainText,
    },
    appName: {
        fontSize: 43,
        lineHeight: 53,
        fontWeight: '800',
        letterSpacing: -1.8,
        color: colors.mainText,
        marginTop: 3,
    },
    tagline: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.secondaryText,
        marginTop: 4,
    },
    heroArt: {
        width: 124,
        height: 148,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
    },
    heroBlob: {
        position: 'absolute',
        width: 122,
        height: 128,
        borderRadius: 55,
        backgroundColor: '#E3EBD6',
        transform: [{ rotate: '14deg' }],
        bottom: 2,
        right: 0,
    },
    heroImage: {
        width: 102,
        height: 132,
        borderRadius: 48,
        resizeMode: 'cover',
        transform: [{ rotate: '7deg' }],
    },
    heroLeafBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F9FBF5',
        borderWidth: 3,
        borderColor: colors.screenBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
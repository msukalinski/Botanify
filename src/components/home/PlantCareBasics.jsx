import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme";
import Ionicons from "@react-native-vector-icons/ionicons";

const categories = [
    {
        id: 'watering',
        title: 'Watering',
        subtitle: 'Find the right balance',
        icon: 'water-outline',
        color: '#168C96',
        background: '#E4F2EF',
        tips: [
            'Check the soil before watering. Moisture needs vary between plant species.',
            'Use pots with drainage holes so excess water can escape.',
            'Empty standing water from the saucer after watering.',
        ],
    },
    {
        id: 'light',
        title: 'Light',
        subtitle: 'A spot to feel at home',
        icon: 'sunny-outline',
        color: '#AD7B19',
        background: '#FFF3D6',
        tips: [
            'Check whether your plant prefers direct sun, indirect light, or shade.',
            'Move plants gradually when introducing them to stronger sunlight.',
            'Watch for changes after moving a plant to a different spot.',
        ],
    },
    {
        id: 'repotting',
        title: 'Soil & Repotting',
        subtitle: 'Room for new growth',
        icon: 'flower-outline',
        color: '#658245',
        background: '#EAF0DE',
        tips: [
            'Choose a potting mix suited to your plant rather than garden soil.',
            'Roots growing through drainage holes can be a sign to check whether repotting is needed.',
            'When repotting, choose a pot only slightly larger than the current one.',
        ],
    },
    {
        id: 'problems',
        title: 'Common Problems',
        subtitle: 'Notice the little signs',
        icon: 'leaf-outline',
        color: '#B46C52',
        background: '#F8EAE2',
        tips: [
            'Yellow leaves can have several causes. Check watering, light, and drainage before making changes.',
            'Inspect the undersides of leaves regularly for pests.',
            'Keep a plant with suspected pests away from your other plants while you investigate.',
        ],
    },
];

export default function PlantCareBasics() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const closeModal = () => setSelectedCategory(null);

    return (
        <View style={styles.section}>
            <View style={styles.heading}>
                <Text style={styles.title} accessibilityRole="header">Plant Care Basics</Text>
                <Text style={styles.subtitle}>Little things that help your plants thrive.</Text>
            </View>

            <View style={styles.grid}>
                {categories.map((category) => (
                    <Pressable
                        key={category.id}
                        onPress={() => setSelectedCategory(category)}
                        style={({ pressed }) => [styles.card, { backgroundColor: category.background }, pressed && styles.pressed]}
                        accessibilityRole="button"
                        accessibilityLabel={`${category.title} care tips`}
                    >
                        <View style={styles.cardTop}>
                            <View style={styles.iconCircle}>
                                <Ionicons name={category.icon} size={25} color={category.color} />
                            </View>

                            <Ionicons name="arrow-forward" size={18} color={category.color} />
                        </View>

                        <Text style={styles.cardTitle}>{category.title}</Text>
                        <Text style={styles.cardSubtitle}>{category.subtitle}</Text>
                    </Pressable>
                ))}
            </View>

            <Modal
                visible={selectedCategory !== null}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.overlay}>
                    <Pressable
                        style={StyleSheet.absoluteFillObject}
                        onPress={closeModal}
                        accessibilityRole="button"
                        accessibilityLabel="Close care tips"
                    />

                    {selectedCategory && (
                        <View style={styles.modalCard} accessibilityViewIsModal>
                            <View style={styles.modalHeader}>
                                <View style={[styles.modalIcon, { backgroundColor: selectedCategory.background }]}>
                                    <Ionicons name={selectedCategory.icon} size={28} color={selectedCategory.color} />
                                </View>

                                <Pressable
                                    onPress={closeModal}
                                    style={styles.closeButton}
                                    accessibilityRole="button"
                                    accessibilityLabel="Close care tips"
                                >
                                    <Ionicons name="close" size={24} color={colors.secondaryText} />
                                </Pressable>
                            </View>

                            <Text style={styles.modalTitle} accessibilityRole="header">{selectedCategory.title}</Text>

                            <Text style={styles.modalSubtitle}>A few simple things to keep in mind.</Text>

                            <ScrollView
                                style={styles.tipsScroll}
                                contentContainerStyle={styles.tipsList}
                                showsVerticalScrollIndicator={false}
                            >
                                {selectedCategory.tips.map((tip, index) => (
                                    <View key={tip} style={styles.tipRow}>
                                        <View style={[styles.tipNumber, { backgroundColor: selectedCategory.background }]}>
                                            <Text style={[styles.tipNumberText, { color: selectedCategory.color }]}>{index + 1}</Text>
                                        </View>

                                        <Text style={styles.tipText}>{tip}</Text>
                                    </View>
                                ))}
                            </ScrollView>

                            <Pressable
                                onPress={closeModal}
                                style={({ pressed }) => [
                                    styles.doneButton,
                                    pressed && styles.pressed,
                                ]}
                                accessibilityRole="button"
                            >
                                <Text style={styles.doneText}>Got it</Text>
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    )}
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 16,
    },
    heading: {
        gap: 5,
    },
    title: {
        fontSize: 21,
        fontWeight: '700',
        color: colors.mainText,
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 19,
        color: colors.secondaryText,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    card: {
        flexBasis: '46%',
        flexGrow: 1,
        minWidth: 130,
        padding: 16,
        borderRadius: 20,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 17,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.mainText,
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: 'rgba(26, 43, 29, 0.4)',
    },
    modalCard: {
        width: '100%',
        maxWidth: 440,
        maxHeight: '85%',
        padding: 24,
        borderRadius: 26,
        backgroundColor: colors.cardBackground,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    modalIcon: {
        width: 58,
        height: 58,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.mainText,
        marginBottom: 6,
    },
    modalSubtitle: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        marginBottom: 22,
    },
    tipsScroll: {
        flexGrow: 0,
        flexShrink: 1,
    },
    tipsList: {
        gap: 18,
        paddingBottom: 6,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    tipNumber: {
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipNumberText: {
        fontSize: 13,
        fontWeight: '700',
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 22,
        color: colors.mainText,
        paddingTop: 3,
    },
    doneButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        marginTop: 24,
        borderRadius: 15,
        backgroundColor: colors.primaryGreen,
    },
    doneText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    pressed: {
        opacity: 0.8,
    },
});
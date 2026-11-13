import { useState } from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";

import { colors } from "../../theme";

const lightOptions = [
    { label: 'Low light', value: 'Low light', icon: 'cloud-outline' },
    { label: 'Indirect light', value: 'Bright indirect light', icon: 'partly-sunny-outline' },
    { label: 'Direct sun', value: 'Direct sunlight', icon: 'sunny-outline' },
];

const wateredOptions = [
    { label: 'Today', value: 0 },
    { label: 'Yesterday', value: 1 },
    { label: 'Not sure', value: null },
];

export default function CreatePlantView({
    navigation,
    onTakePhoto,
    onChoosePhoto,
    onAddPlant,
    photoSource = null,
}) {
    const [values, setValues] = useState({
        name: '',
        species: '',
        location: '',
        wateringFrequencyDays: 7,
        lastWateredDaysAgo: null,
        lightPreference: 'Bright indirect light',
        remindersEnabled: false,
        notes: '',
    });
    const [nameError, setNameError] = useState('');

    const changeHandler = (field, value) => {
        setValues((previous) => ({ ...previous, [field]: value }));

        if (field === 'name') {
            setNameError('');
        };
    };

    const changeWateringFrequency = (change) => {
        setValues((previous) => ({
            ...previous,
            wateringFrequencyDays: Math.min(30, Math.max(1, previous.wateringFrequencyDays + change)),
        }));
    };

    const addPlantHandler = () => {
        const name = values.name.trim();

        if (!name) {
            setNameError('Please give your plant a name.');
            return;
        }

        Keyboard.dismiss();

        onAddPlant?.({
            ...values,
            name,
            species: values.species.trim(),
            location: values.location.trim(),
            notes: values.notes.trim(),
            photoSource,
        });
    };

    return (
        <SafeAreaView style={styles.screen}>
            <View style={styles.toolbar}>
                <Pressable
                    style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                    onPress={() => navigation.navigate('Plants')}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="arrow-back" size={24} color={colors.mainText} />
                </Pressable>
                <Text style={styles.toolbarTitle} accessibilityRole="header">Add plant</Text>
                <View style={styles.toolbarDecoration} accessible={false}>
                    <Ionicons name="leaf-outline" size={23} color={colors.primaryGreen} />
                </View>
            </View>

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    contentInsetAdjustmentBehavior="never"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={styles.introduction}>
                        <Text style={styles.title} accessibilityRole="header">Make room for green</Text>
                        <Text style={styles.subtitle}>Add your plant and make its care a little easier.</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Plant Photo</Text>
                        <View style={[styles.photoArea, photoSource && styles.photoAreaFilled]}>
                            {photoSource ? (
                                <Image
                                    source={photoSource}
                                    style={styles.photo}
                                    accessibilityLabel="Selected plant photo"
                                />
                            ) : (
                                <>
                                    <View style={styles.photoIcon} accessible={false}>
                                        <Ionicons name="leaf-outline" size={38} color={colors.primaryGreen} />
                                        <View style={styles.cameraBadge} accessible={false}>
                                            <Ionicons name="camera" size={15} color="#FFFFFF" />
                                        </View>
                                    </View>
                                    <Text style={styles.photoTitle}>A face for your new plant</Text>
                                    <Text style={styles.photoHint}>Take a photo or choose one you love.</Text>
                                </>
                            )}
                        </View>
                        <View style={styles.photoActions}>
                            <Pressable
                                style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}
                                onPress={onTakePhoto}
                                accessibilityRole="button"
                                accessibilityLabel="Take a plant photo"
                            >
                                <Ionicons name="camera-outline" size={20} color={colors.primaryGreen} />
                                <Text style={styles.photoButtonText}>Take photo</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [styles.photoButton, pressed && styles.pressed]}
                                onPress={onChoosePhoto}
                                accessibilityRole="button"
                                accessibilityLabel="Choose a plant photo from your gallery"
                            >
                                <Ionicons name="images-outline" size={20} color={colors.primaryGreen} />
                                <Text style={styles.photoButtonText}>Gallery</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Meet your plant</Text>
                        <View style={styles.formCard}>
                            <PlantField
                                label='Plant name'
                                required
                                icon="leaf-outline"
                                placeholder="e.g. Monstera"
                                value={values.name}
                                onChangeText={(value) => changeHandler('name', value)}
                                error={nameError}
                                maxLength={80}
                            />
                            <PlantField
                                label='Species (optional)'
                                icon="flower-outline"
                                placeholder="e.g. Monstera deliciosa"
                                value={values.species}
                                onChangeText={(value) => changeHandler('species', value)}
                                autoCorrect={false}
                                maxLength={120}
                            />
                            <PlantField
                                label='Location (optional)'
                                icon="location-outline"
                                placeholder="e.g. Living room"
                                value={values.location}
                                onChangeText={(value) => changeHandler('location', value)}
                                maxLength={100}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle} accessibilityRole="header">Your care plan</Text>
                        <View style={styles.careCard}>
                            <View style={styles.careHeading}>
                                <View style={styles.waterIcon}>
                                    <Ionicons name="water-outline" size={23} color="#168C96" />
                                </View>
                                <View style={styles.careHeadingText}>
                                    <Text style={styles.careTitle}>Watering schedule</Text>
                                    <Text style={styles.hint}>Choose a routine that suits your plant.</Text>
                                </View>
                            </View>

                            <View style={styles.frequencyRow}>
                                <Text style={styles.fieldLabel}>Water every</Text>
                                <View style={styles.stepper}>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.stepButton,
                                            values.wateringFrequencyDays === 1 && styles.disabled,
                                            pressed && styles.pressed,
                                        ]}
                                        onPress={() => changeWateringFrequency(-1)}
                                        disabled={values.wateringFrequencyDays === 1}
                                        accessibilityRole="button"
                                        accessibilityLabel="Decrease days between watering"
                                        accessibilityState={{ disabled: values.wateringFrequencyDays === 1 }}
                                    >
                                        <Ionicons name="remove" size={21} color={colors.primaryGreen} />
                                    </Pressable>
                                    <Text
                                        style={styles.frequencyValue}
                                        accessibilityLabel={`Every ${values.wateringFrequencyDays} ${values.wateringFrequencyDays === 1 ? 'day' : 'days'}`}
                                        accessibilityLiveRegion="polite"
                                    >
                                        {values.wateringFrequencyDays} {values.wateringFrequencyDays === 1 ? 'day' : 'days'}
                                    </Text>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.stepButton,
                                            values.wateringFrequencyDays === 30 && styles.disabled,
                                            pressed && styles.pressed,
                                        ]}
                                        onPress={() => changeWateringFrequency(1)}
                                        disabled={values.wateringFrequencyDays === 30}
                                        accessibilityRole="button"
                                        accessibilityLabel="Increase days between watering"
                                        accessibilityState={{ disabled: values.wateringFrequencyDays === 30 }}
                                    >
                                        <Ionicons name="add" size={21} color={colors.primaryGreen} />
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.field}>
                                <Text style={styles.fieldLabel}>Last watered</Text>
                                <View style={styles.choices}>
                                    {wateredOptions.map((option) => (
                                        <Choice
                                            key={option.label}
                                            label={option.label}
                                            selected={values.lastWateredDaysAgo === option.value}
                                            onPress={() => changeHandler('lastWateredDaysAgo', option.value)}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.field}>
                                <View style={styles.labelRow}>
                                    <Ionicons name="sunny-outline" size={19} color="#B78014" />
                                    <Text style={styles.fieldLabel}>Light preference</Text>
                                </View>
                                <View style={styles.choices}>
                                    {lightOptions.map((option) => (
                                        <Choice
                                            key={option.value}
                                            label={option.label}
                                            icon={option.icon}
                                            selected={values.lightPreference === option.value}
                                            onPress={() => changeHandler('lightPreference', option.value)}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.reminderCard}>
                        <View style={styles.reminderIcon} accessible={false}>
                            <Ionicons name="notifications-outline" size={22} color={colors.primaryGreen} />
                        </View>
                        <View style={styles.reminderCopy} accessible={false}>
                            <Text style={styles.reminderTitle}>Watering reminders</Text>
                            <Text style={styles.hint}>Remind me when watering is due.</Text>
                        </View>
                        <Switch
                            value={values.remindersEnabled}
                            onValueChange={(value) => changeHandler('remindersEnabled', value)}
                            trackColor={{ false: '#D7DDCE', true: '#B6CC9E' }}
                            thumbColor={values.remindersEnabled ? colors.primaryGreen : "#FFFFFF"}
                            ios_backgroundColor="#D7DDCE"
                            accessibilityLabel="Watering reminders"
                        />
                    </View>

                    <View style={styles.section}>
                        <PlantField
                            label="My notes (optional)"
                            icon="document-text-outline"
                            placeholder="A gift from a friend? A favourite sunny spot? Write it here."
                            value={values.notes}
                            onChangeText={(value) => changeHandler('notes', value)}
                            multiline
                            maxLength={1000}
                        />
                    </View>

                    <Pressable
                        style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
                        onPress={addPlantHandler}
                        accessibilityRole="button"
                        accessibilityLabel="Add plant"
                    >
                        <Ionicons name="add-circle-outline" size={23} color="#FFFFFF" />
                        <Text style={styles.submitText}>Add plant</Text>
                    </Pressable>

                    <View style={styles.footer} accessible={false}>
                        <Ionicons name="leaf-outline" size={15} color={colors.secondaryText} />
                        <Text style={styles.footerText}>A little care. A lot of green.</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function PlantField({
    label,
    icon,
    required = false,
    error,
    multiline = false,
    ...inputProps
}) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>
                {label}{required && <Text style={styles.required}> *</Text>}
            </Text>
            <View
                style={[
                    styles.inputContainer,
                    multiline && styles.notesContainer,
                    error && styles.inputError
                ]}
            >
                <Ionicons name={icon} size={20} color={colors.secondaryText} />
                <TextInput
                    {...inputProps}
                    style={[styles.input, multiline && styles.notesInput]}
                    placeholderTextColor={colors.secondaryText}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    accessibilityLabel={`${label}${required ? ', required' : ''}`}
                    accessibilityHint={error || undefined}
                />
            </View>
            {error ? <Text style={styles.errorText} accessibilityLiveRegion="polite">{error}</Text> : null}
        </View>
    );
}

function Choice({
    label,
    icon,
    selected,
    onPress,
}) {
    return (
        <Pressable
            style={({ pressed }) => [styles.choice, selected && styles.choiceSelected, pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ checked: selected }}
        >
            {icon && <Ionicons name={icon} size={17} color={selected ? colors.primaryGreen : colors.secondaryText} />}
            <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    toolbar: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 14,
        paddingTop: 6,
        paddingBottom: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolbarTitle: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '600',
        color: colors.mainText,
        textAlign: 'center',
    },
    toolbarDecoration: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyboardContainer: {
        flex: 1,
    },
    scroll: {
        flex: 1

    },
    content: {
        width: '100%',
        maxWidth: 560,
        alignSelf: 'center',
        paddingHorizontal: 18,
        paddingTop: 10,
        paddingBottom: 26,
        gap: 24,
    },
    introduction: {
        gap: 7
    },
    title: {
        fontSize: 29,
        lineHeight: 37,
        fontWeight: '800',
        letterSpacing: -0.8,
        color: colors.mainText,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.secondaryText,
    },
    section: {
        gap: 12
    },
    sectionTitle: {
        fontSize: 20,
        lineHeight: 27,
        fontWeight: '700',
        letterSpacing: -0.4,
        color: colors.mainText,
    },
    photoArea: {
        width: '100%',
        minHeight: 190,
        padding: 22,
        borderRadius: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#B7C6A7',
        backgroundColor: '#EDF1E6',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        overflow: 'hidden',
    },
    photoAreaFilled: {
        padding: 0,
        borderStyle: 'solid',
        aspectRatio: 1.7,
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    photoIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#DEE8D3',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    cameraBadge: {
        position: 'absolute',
        right: -2,
        bottom: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 3,
        borderColor: '#EDF1E6',
        backgroundColor: colors.primaryGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoTitle: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '600',
        color: colors.mainText,
        textAlign: 'center',
    },
    photoHint: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    photoActions: {
        flexDirection: 'row',
        gap: 10
    },
    photoButton: {
        flex: 1,
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 10,
        paddingVertical: 11,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    photoButtonText: {
        flexShrink: 1,
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '600',
        color: colors.primaryGreen,
        textAlign: 'center',
    },
    formCard: {
        padding: 16,
        gap: 18,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    field: {
        gap: 9
    },
    fieldLabel: {
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '600',
        color: colors.mainText,
    },
    required: {
        color: colors.primaryGreen
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minHeight: 52,
        paddingHorizontal: 13,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.screenBackground,
    },
    input: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 14,
        paddingHorizontal: 0,
        fontSize: 14,
        lineHeight: 21,
        color: colors.mainText,
    },
    inputError: {
        borderColor: '#B14D3E'
    },
    errorText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#A63D32'
    },
    careCard: {
        padding: 16,
        gap: 18,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
    },
    careHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 11
    },
    waterIcon: {
        width: 43,
        height: 43,
        borderRadius: 15,
        backgroundColor: '#D8EEEB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    careHeadingText: {
        flex: 1,
        gap: 3
    },
    careTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        color: colors.mainText,
    },
    hint: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText
    },
    frequencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
    },
    stepper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#D6E1CC',
        backgroundColor: '#EDF2E7',
    },
    stepButton: {
        width: 44,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center'
    },
    frequencyValue: {
        minWidth: 65,
        paddingHorizontal: 4,
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '700',
        color: colors.primaryGreen,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7
    },
    choices: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    choice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        minHeight: 44,
        paddingHorizontal: 13,
        paddingVertical: 10,
        gap: 6,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.screenBackground,
    },
    choiceSelected: {
        borderColor: colors.primaryGreen,
        backgroundColor: '#E7EFDD'
    },
    choiceText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText
    },
    choiceTextSelected: {
        fontWeight: '600',
        color: colors.primaryGreen
    },
    reminderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 20,
        backgroundColor: '#EAF0E2',
    },
    reminderIcon: {
        width: 39,
        height: 39,
        borderRadius: 14,
        backgroundColor: '#DCE8CE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reminderCopy: {
        flex: 1,
        gap: 3
    },
    reminderTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '700',
        color: colors.mainText
    },
    notesContainer: {
        alignItems: 'flex-start',
        paddingTop: 14,
        backgroundColor: colors.cardBackground
    },
    notesInput: {
        minHeight: 110,
        paddingTop: 0,
        paddingBottom: 14
    },
    submitButton: {
        minHeight: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 9,
        borderRadius: 17,
        backgroundColor: colors.primaryGreen,
    },
    submitText: {
        flexShrink: 1,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700', color: '#FFFFFF'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', gap: 6
    },
    footerText: {
        flexShrink: 1,
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
        textAlign: 'center'
    },
    pressed: {
        opacity: 0.75
    },
    disabled: {
        opacity: 0.35
    },
});
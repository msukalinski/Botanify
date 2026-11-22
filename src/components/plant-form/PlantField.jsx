import { StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { colors } from '../../theme';

export default function PlantField({
    label,
    icon,
    required = false,
    error,
    multiline = false,
    inputRef = null,
    ...inputProps
}) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>
                {label}
                {required && <Text style={styles.required}> *</Text>}
            </Text>

            <View
                style={[
                    styles.inputContainer,
                    multiline && styles.notesContainer,
                    error && styles.inputError,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={colors.secondaryText}
                />

                <TextInput
                    {...inputProps}
                    ref={inputRef}
                    style={[
                        styles.input,
                        multiline && styles.notesInput,
                    ]}
                    placeholderTextColor={colors.secondaryText}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    accessibilityLabel={`${label}${required ? ', required' : ''}`}
                    accessibilityHint={error || undefined}
                />
            </View>

            {error ? (
                <Text
                    style={styles.errorText}
                    accessibilityLiveRegion="polite"
                >
                    {error}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        gap: 9,
    },
    fieldLabel: {
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '600',
        color: colors.mainText,
    },
    required: {
        color: colors.primaryGreen,
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
        color: '#A63D32',
    },
    notesContainer: {
        alignItems: 'flex-start',
        paddingTop: 14,
        backgroundColor: colors.cardBackground,
    },
    notesInput: {
        minHeight: 110,
        maxHeight: 150,
        paddingTop: 0,
        paddingBottom: 14,
    },
});
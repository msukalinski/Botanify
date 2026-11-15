import { useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../theme';

export default function RegisterField({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    error,
    inputRef,
    autoComplete,
    onSubmitEditing,
    KeyboardType = 'default',
    returnKeyType = 'next',
    isPassword = false,
}) {
    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const passwordLabel = label === 'Confirm password'
        ? 'password confirmation'
        : 'password';

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>

            <View
                style={[
                    styles.inputContainer,
                    focused && styles.inputFocused,
                    error && styles.inputInvalid,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={colors.secondaryText}
                />

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    placeholderTextColor={colors.secondaryText}
                    keyboardType={KeyboardType}
                    secureTextEntry={isPassword && !passwordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={autoComplete}
                    returnKeyType={returnKeyType}
                    submitBehavior={
                        returnKeyType === 'next'
                            ? 'submit'
                            : 'blurAndSubmit'
                    }
                    onSubmitEditing={onSubmitEditing}
                    accessibilityLabel={label}
                    accessibilityHint={error}
                />

                {isPassword && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.passwordToggle,
                            pressed && styles.pressed,
                        ]}
                        onPress={() => {
                            setPasswordVisible((previous) => !previous);
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`${passwordVisible ? 'Hide' : 'Show'} ${passwordLabel}`}
                    >
                        <Ionicons
                            name={
                                passwordVisible
                                    ? 'eye-off-outline'
                                    : 'eye-outline'
                            }
                            size={21}
                            color={colors.secondaryText}
                        />
                    </Pressable>
                )}
            </View>

            {error && (
                <Text style={styles.error} accessibilityRole="alert">
                    {error}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: colors.mainText,
    },
    inputContainer: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 14,
        paddingRight: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: '#F8FAF5',
    },
    inputFocused: {
        borderColor: colors.primaryGreen,
        backgroundColor: colors.cardBackground,
    },
    inputInvalid: {
        borderColor: '#B4493B',
    },
    input: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 15,
        paddingHorizontal: 0,
        fontSize: 15,
        color: colors.mainText,
    },
    passwordToggle: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    error: {
        fontSize: 12,
        lineHeight: 18,
        color: '#A63D32',
    },
    pressed: {
        opacity: 0.7,
    },
});
import { useRef, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../../theme";
import Ionicons from "@react-native-vector-icons/ionicons";

export default function Login({
    onLogin,
    onRegister,
}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({});
    const passwordInput = useRef(null);

    const loginHandler = () => {
        const nextErrors = {};
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            nextErrors.email = 'Please enter your email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            nextErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            nextErrors.password = 'Please enter your password.';
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        Keyboard.dismiss();
        onLogin?.({ email: trimmedEmail, password });
    }

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <View style={styles.brand}>
                            <View style={styles.logo} accessible={false}>
                                <Ionicons name="leaf" size={35} color={colors.primaryGreen} />
                            </View>
                            <Text style={styles.appName}>Botanify</Text>
                            <Text style={styles.tagline}>Happier plants. A brighter you.</Text>
                        </View>

                        <View style={styles.introduction}>
                            <Text style={styles.title} accessibilityRole="header">Welcome back</Text>
                            <Text style={styles.subtitle}>Sign in to care for your little green world.</Text>
                        </View>

                        <View style={styles.formCard}>
                            <View style={styles.field}>
                                <Text style={styles.label}>Email address</Text>
                                <View
                                    style={[
                                        styles.inputContainer,
                                        focusedField === 'email' && styles.inputFocused,
                                        errors.email && styles.inputInvalid
                                    ]}
                                >
                                    <Ionicons name="mail-outline" size={20} color={colors.secondaryText} />
                                    <TextInput
                                        style={styles.input}
                                        value={email}
                                        onChangeText={(value) => {
                                            setEmail(value)
                                            setErrors((previous) => ({ ...previous, email: undefined }));
                                        }}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="you@example.com"
                                        placeholderTextColor={colors.secondaryText}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="email"
                                        returnKeyType="next"
                                        submitBehavior="submit"
                                        onSubmitEditing={() => passwordInput.current?.focus()}
                                        accessibilityLabel="Email address"
                                        accessibilityHint={errors.email}
                                    />
                                </View>
                                {errors.email && (
                                    <Text style={styles.error} accessibilityRole="alert">{errors.email}</Text>
                                )}
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>Password</Text>
                                <View
                                    style={[
                                        styles.inputContainer,
                                        focusedField === 'password' && styles.inputFocused,
                                        errors.password && styles.inputInvalid
                                    ]}
                                >
                                    <Ionicons name="lock-closed-outline" size={20} color={colors.secondaryText} />
                                    <TextInput
                                        ref={passwordInput}
                                        style={styles.input}
                                        value={password}
                                        onChangeText={(value) => {
                                            setPassword(value)
                                            setErrors((previous) => ({ ...previous, password: undefined }));
                                        }}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter your password"
                                        placeholderTextColor={colors.secondaryText}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="current-password"
                                        returnKeyType="done"
                                        onSubmitEditing={loginHandler}
                                        accessibilityLabel="Password"
                                        accessibilityHint={errors.password}
                                    />
                                    <Pressable
                                        style={({ pressed }) => [styles.passwordToggle, pressed && styles.pressed]}
                                        onPress={() => setShowPassword((previous) => !previous)}
                                        accessibilityRole="button"
                                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={21}
                                            color={colors.secondaryText}
                                        />
                                    </Pressable>
                                </View>
                                {errors.password && (
                                    <Text style={styles.error} accessibilityRole="alert">{errors.password}</Text>
                                )}
                            </View>

                            <Pressable
                                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
                                onPress={loginHandler}
                                accessibilityRole="button"
                                accessibilityLabel="Sign in"
                            >
                                <Text style={styles.submitText}>Sign in</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </Pressable>
                        </View>

                        <View style={styles.registerRow}>
                            <Text style={styles.registerText}>New to Botanify</Text>
                            <Pressable
                                style={({ pressed }) => [styles.registerButton, pressed && styles.pressed]}
                                onPress={onRegister}
                                accessibilityRole="button"
                                accessibilityLabel="Create an account"
                            >
                                <Text style={styles.registerLink}>Create an account</Text>
                            </Pressable>
                        </View>

                        <View style={styles.footer}>
                            <Ionicons name="leaf-outline" size={15} color={colors.secondaryText} />
                            <Text style={styles.footerText}>A little care. A lot of green.</Text>
                        </View>

                    </View>
                </ScrollView>

            </KeyboardAvoidingView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    content: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        gap: 24,
    },
    brand: {
        alignItems: 'center',
    },
    logo: {
        width: 76,
        height: 76,
        borderRadius: 27,
        backgroundColor: colors.lightGreenBackground,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        transform: [{ rotate: '-6deg' }],
    },
    appName: {
        fontSize: 34,
        lineHeight: 42,
        fontWeight: '800',
        letterSpacing: -1.2,
        color: colors.mainText,
    },
    tagline: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
        textAlign: 'center',
        marginTop: 4,
    },
    introduction: {
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 27,
        lineHeight: 34,
        fontWeight: '700',
        letterSpacing: -0.6,
        color: colors.mainText,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 21,
        color: colors.secondaryText,
        textAlign: 'center',
        maxWidth: 270,
    },
    formCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
        gap: 20,
    },
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
    submitButton: {
        minHeight: 54,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 15,
        backgroundColor: colors.primaryGreen,
        marginTop: 4,
    },
    submitText: {
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    registerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 5,
    },
    registerText: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
    },
    registerButton: {
        minHeight: 44,
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    registerLink: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '700',
        color: colors.primaryGreen,
    },
    footer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 12,
        lineHeight: 18,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    pressed: {
        opacity: 0.7,
    },
})
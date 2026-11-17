import { useRef, useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import RegisterField from '../components/register/RegisterField';

import { colors } from '../theme';
import { registerUser } from '../services/userService';

export default function RegisterScreen({
    navigation,
}) {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const confirmPasswordInput = useRef(null);

    const changeHandler = (name, value) => {
        setValues((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
            ...(name === 'password' ? { confirmPassword: undefined } : {}),
        }));
    }

    const registerHandler = async () => {
        if (submitting) {
            return;
        }

        const nextErrors = {};
        const username = values.username.trim();
        const email = values.email.trim();

        if (!username) {
            nextErrors.username = 'Please enter a username.';
        }

        if (!email) {
            nextErrors.email = 'Please enter your email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = 'Please enter a valid email address.';
        }

        if (!values.password.trim()) {
            nextErrors.password = 'Please enter a password.';
        } else if (values.password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters long.';
        }

        if (!values.confirmPassword) {
            nextErrors.confirmPassword = 'Please confirm your password.';
        } else if (values.password !== values.confirmPassword) {
            nextErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        Keyboard.dismiss();

        setSubmitting(true);

        try {
            const data = await registerUser({
                username,
                email,
                password: values.password,
            });

            if (!data.session) {
                setErrors((previous) => ({
                    ...previous,
                    registerError: 'Your account was created, but automatic log in failed. Please log in.',
                }));
                return;
            }
        } catch (err) {
            setErrors((previous) => ({
                ...previous,
                registerError: err instanceof Error
                    ? err.message
                    : 'Registration failed. Please try again.',
            }));
        } finally {
            setSubmitting(false);
        }
    }

    const onLogin = () => {
        return navigation.goBack();
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
                            <Text style={styles.title} accessibilityRole="header">Let's grow together</Text>
                            <Text style={styles.subtitle}>Create an account and give your plants a little extra care.</Text>
                        </View>

                        <View style={styles.formCard}>
                            <RegisterField
                                label="Username"
                                icon="person-outline"
                                placeholder="Your username"
                                value={values.username}
                                onChangeText={(value) => changeHandler('username', value)}
                                error={errors.username}
                                autoComplete="username"
                                onSubmitEditing={() => emailInput?.current.focus()}
                            />

                            <RegisterField
                                label="Email address"
                                icon="mail-outline"
                                placeholder="you@example.com"
                                inputRef={emailInput}
                                value={values.email}
                                onChangeText={(value) => changeHandler('email', value)}
                                error={errors.email}
                                KeyboardType="email-address"
                                autoComplete="email"
                                onSubmitEditing={() => passwordInput?.current.focus()}
                            />

                            <RegisterField
                                label="Password"
                                icon="lock-closed-outline"
                                placeholder="At least 6 characters"
                                inputRef={passwordInput}
                                value={values.password}
                                onChangeText={(value) => changeHandler('password', value)}
                                error={errors.password}
                                autoComplete="new-password"
                                isPassword
                                onSubmitEditing={() => confirmPasswordInput?.current.focus()}
                            />

                            <RegisterField
                                label="Confirm password"
                                icon="lock-closed-outline"
                                placeholder="Repeat your password"
                                inputRef={confirmPasswordInput}
                                value={values.confirmPassword}
                                onChangeText={(value) => changeHandler('confirmPassword', value)}
                                error={errors.confirmPassword}
                                autoComplete="new-password"
                                isPassword
                                returnKeyType="done"
                                onSubmitEditing={registerHandler}
                            />

                            <Pressable
                                style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
                                onPress={registerHandler}
                                disabled={submitting}
                                accessibilityRole="button"
                                accessibilityState={{
                                    disabled: submitting,
                                    busy: submitting,
                                }}
                            >
                                <Text style={styles.submitText}>
                                    {submitting ? 'Creating account...' : 'Create account'}
                                </Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </Pressable>

                            {errors.registerError && (
                                <Text style={styles.error} accessibilityRole='alert'>
                                    {errors.registerError}
                                </Text>
                            )}
                        </View>



                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>Already have an account?</Text>
                            <Pressable
                                style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}
                                onPress={() => onLogin()}
                                accessibilityRole="button"
                                accessibilityLabel="Sign in"
                            >
                                <Text style={styles.loginLink}>Sign in</Text>
                            </Pressable>
                        </View>

                        <View style={styles.footer} accessible={false}>
                            <Ionicons name="leaf-outline" size={15} color={colors.secondaryText} />
                            <Text style={styles.footerText}>A little care. A lot of green.</Text>
                        </View>
                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </SafeAreaView>
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
        paddingVertical: 28,
    },
    content: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        gap: 22,
    },
    brand: {
        alignItems: 'center',
    },
    logo: {
        width: 68,
        height: 68,
        borderRadius: 25,
        backgroundColor: colors.lightGreenBackground,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
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
        maxWidth: 285,
    },
    formCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.cardBackground,
        gap: 16,
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
    error: {
        fontSize: 12,
        lineHeight: 18,
        color: '#A63D32',
    },
    loginRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 5,
    },
    loginText: {
        fontSize: 13,
        lineHeight: 20,
        color: colors.secondaryText,
    },
    loginButton: {
        minHeight: 44,
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    loginLink: {
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
});
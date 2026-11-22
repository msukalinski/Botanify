import { useCallback, useEffect, useRef } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function useKeyboardAwareScroll() {
    const scrollRef = useRef(null);
    const focusedInput = useRef(null);
    const scrollOffset = useRef(0);
    const keyboardTop = useRef(null);
    const animationFrame = useRef(null);

    useFocusEffect(useCallback(() => () => {
        focusedInput.current = null;
        keyboardTop.current = null;
        if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
        Keyboard.dismiss();
    }, []));

    const ensureInputVisible = useCallback(() => {
        if (Platform.OS === 'web') return;

        if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
        animationFrame.current = requestAnimationFrame(() => {
            animationFrame.current = null;
            const input = focusedInput.current;
            const scroll = scrollRef.current;
            if (!input || !scroll || keyboardTop.current === null) return;

            scroll.measureInWindow((_x, top, _width, height) => {
                input.measureInWindow((_inputX, inputTop, _inputWidth, inputHeight) => {
                    if (focusedInput.current !== input || keyboardTop.current === null) return;

                    const visibleTop = top + 16;
                    const visibleBottom = Math.min(top + height, keyboardTop.current) - 16;
                    const bottomOverlap = inputTop + inputHeight - visibleBottom;
                    const delta = bottomOverlap > 0
                        ? bottomOverlap
                        : inputTop < visibleTop ? inputTop - visibleTop : 0;

                    if (delta !== 0) {
                        scroll.scrollTo({ y: Math.max(0, scrollOffset.current + delta), animated: true });
                    }
                });
            });
        });
    }, []);

    useEffect(() => {
        if (Platform.OS === 'web') return;

        const show = Keyboard.addListener('keyboardDidShow', (event) => {
            keyboardTop.current = event.endCoordinates.screenY;
            ensureInputVisible();
        });
        const hide = Keyboard.addListener('keyboardDidHide', () => {
            keyboardTop.current = null;
        });

        return () => {
            focusedInput.current = null;
            keyboardTop.current = null;
            show.remove();
            hide.remove();
            if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
        };
    }, [ensureInputVisible]);

    const focusInput = useCallback((input) => {
        focusedInput.current = input;
        keyboardTop.current = Keyboard.metrics?.()?.screenY ?? keyboardTop.current;
        ensureInputVisible();
    }, [ensureInputVisible]);

    const blurInput = useCallback((input) => {
        if (focusedInput.current === input) focusedInput.current = null;
    }, []);

    const onScroll = useCallback((event) => {
        scrollOffset.current = event.nativeEvent.contentOffset.y;
    }, []);

    return { scrollRef, focusInput, blurInput, onScroll, ensureInputVisible };
}

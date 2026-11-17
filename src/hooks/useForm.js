import { useState } from "react"

export default function useForm(
    callback, 
    initialValues,
    onFieldChange,
) {
    const [values, setValues] = useState(initialValues);

    const changeHandler = (fieldName, value) => {
        setValues((previous) => ({
            ...previous,
            [fieldName]: value,
        }));

        onFieldChange?.(fieldName, value);
    };

    const formAction = async () => {
        await callback(values);
    };

    const register = (fieldName) => ({
        value: values[fieldName] ?? '',
        onChangeText: (text) => (changeHandler(fieldName, text)),
    });

    return {
        values,
        setValues,
        register,
        changeHandler,
        formAction,
    }
}
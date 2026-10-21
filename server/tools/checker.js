import { z } from 'zod';

const userSchema = z.object({
    name: z.string()
        .min(3, { message: "El nombre debe tener un mínimo de 3 caracteres." })
        .max(10, { message: "El nombre no puede pasar de 10 caracteres." })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, { message: "El nombre no puede tener números, espacios ni caracteres especiales." })
        .regex(/^[A-ZÁÉÍÓÚÑ]/, { message: "La primera letra del nombre debe ser mayúscula" }),

    last_name: z.string()
        .min(3, { message: "El apellido debe tener un mínimo de 3 caracteres." })
        .max(10, { message: "El apellido no puede pasar de 10 caracteres." })
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, { message: "El apellido no puede tener números, espacios ni caracteres especiales." })
        .regex(/^[A-ZÁÉÍÓÚÑ]/, { message: "La primera letra del apellido debe ser mayúscula" }),

    password: z.string()
        .min(8, { message: "La contraseña debe tener un mínimo de 8 caracteres" })
        .max(20, { message: "La contraseña debe tener un máximo de 20 caracteres" })
        .regex(/^\S*$/, { message: "La contraseña no puede tener espacios en blanco" })
        .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
        .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." })
        .regex(/[^a-zA-Z0-9]/, { message: "La contraseña debe contener al menos un carácter especial (ej. @, #, $, !, etc.)." }),

    confirmPassword: z.string()
        .min(8, { message: "La contraseña debe tener un mínimo de 8 caracteres" })
        .max(20, { message: "La contraseña debe tener un máximo de 20 caracteres" })
        .regex(/^\S*$/, { message: "La contraseña no puede tener espacios en blanco" })
        .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula." })
        .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número." })
        .regex(/[^a-zA-Z0-9]/, { message: "La contraseña debe contener al menos un carácter especial (ej. @, #, $, !, etc.)." }),
});

const checkerUser = (user) => {

    const data = userSchema.safeParse(user);
    const { password, confirmPassword } = user; 

    if (!data.success) {

        const errors = data.error.errors.map(err => err.message);

        return {
            valid: false,
            messageError: errors
        };
    }

    if (password !== confirmPassword) {
        return {
            valid: false,
            messageError: "Las contraseñas deben ser iguales"
        };
    }

    return {
        valid: true,
        data: data.data
    };
};
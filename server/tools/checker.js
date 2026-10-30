import { z } from 'zod';
import bcrypt from 'bcrypt';


//sistema para validar una password
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

    id:z.coerce.number({ message: "La cédula debe ser un número" })
        .int({ message: "La cédula debe de ser un número entero" })
        .gte(10000000,{message:"la cedula debe ser mayor a 10 millones"})

});

//sistema para verificar si la contrasena ingresada existe y es correcta
export const checkerUser = (user) => {

    const data = userSchema.safeParse(user);
    const { password, confirmPassword } = user; 

    if (!data.success) {

        const errors = data.error.issues.map(err => err.message);

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


//sistema para verificar si el usuario existe
export const Userauthentication = async(password, passwordVerifiqued) =>{

    const validPassword = await bcrypt.compare(password,passwordVerifiqued)
    
    if (!validPassword) {
        return{
            message:"las contrasenas no coinsiden",
            valid: false
        }    
    }

    return{
        message:"usuario correcto",
        valid: true
    }
    
}
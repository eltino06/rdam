export const validators = {
    isValidPhone: (phone: string): boolean => {
        // Permite números, espacios, guiones y el signo + al principio
        // Mínimo 8 caracteres para ser considerado un número real
        const phoneRegex = /^[+]?[\d\s-]{8,}$/;
        return phoneRegex.test(phone.trim());
    },

    isValidAddress: (address: string): boolean => {
        // Mínimo 5 caracteres para una dirección válida
        return address.trim().length >= 5;
    },

    isValidName: (name: string): boolean => {
        // Solo letras y espacios, mínimo 3 caracteres
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
        return nameRegex.test(name.trim());
    },

    isValidCuil: (cuil: string): boolean => {
        // Debe tener exactamente 11 dígitos numéricos
        // Se eliminan guiones antes de validar
        const cleanCuil = cuil.replace(/[-\s]/g, '');
        return /^\d{11}$/.test(cleanCuil);
    },
};

export function isValidNationalCode(code: string): boolean {
    if (!/^\d{10}$/.test(code)) return false;
    if (/^(\d)\1{9}$/.test(code)) return false;

    const check = parseInt(code[9], 10);

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(code[i], 10) * (10 - i);
    }

    const remainder = sum % 11;

    return remainder < 2 ? check === remainder : check === 11 - remainder;
}

export function isValidMobile(mobile: string): boolean {
    return /^09\d{9}$/.test(mobile);
}

export function isValidPhone(phone: string): boolean {
    if (!phone) return true;
    return /^\d{0,15}$/.test(phone);
}

export interface ClientFormValues {
    firstName: string;
    lastName: string;
    nationalCode: string;
    mobile: string;
    phone: string;
    address: string;
    description: string;
}

export interface ClientFormErrors {
    firstName?: string;
    lastName?: string;
    nationalCode?: string;
    mobile?: string;
    phone?: string;
    address?: string;
    description?: string;
}

export function validateClientForm(values: ClientFormValues): ClientFormErrors {
    const errors: ClientFormErrors = {};

    const firstName = values.firstName.trim();
    if (!firstName) {
        errors.firstName = "نام الزامی است.";
    } else if (firstName.length < 2 || firstName.length > 50) {
        errors.firstName = "نام باید بین ۲ تا ۵۰ کاراکتر باشد.";
    }

    const lastName = values.lastName.trim();
    if (!lastName) {
        errors.lastName = "نام خانوادگی الزامی است.";
    } else if (lastName.length < 2 || lastName.length > 80) {
        errors.lastName = "نام خانوادگی باید بین ۲ تا ۸۰ کاراکتر باشد.";
    }

    const nationalCode = values.nationalCode.trim();
    if (!nationalCode) {
        errors.nationalCode = "کد ملی الزامی است.";
    } else if (!isValidNationalCode(nationalCode)) {
        errors.nationalCode = "کد ملی واردشده معتبر نیست.";
    }

    const mobile = values.mobile.trim();
    if (!mobile) {
        errors.mobile = "شماره موبایل الزامی است.";
    } else if (!isValidMobile(mobile)) {
        errors.mobile = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
    }

    if (values.phone && !isValidPhone(values.phone.trim())) {
        errors.phone = "تلفن ثابت فقط باید عدد باشد (حداکثر ۱۵ رقم).";
    }

    if (values.address && values.address.length > 500) {
        errors.address = "آدرس نباید بیشتر از ۵۰۰ کاراکتر باشد.";
    }

    if (values.description && values.description.length > 1000) {
        errors.description = "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد.";
    }

    return errors;
}

export function hasErrors<T extends object>(errors: T): boolean {
    return Object.values(errors).some(Boolean);
}

export interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordFormErrors {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export function validateChangePasswordForm(
    values: ChangePasswordFormValues
): ChangePasswordFormErrors {
    const errors: ChangePasswordFormErrors = {};

    if (!values.currentPassword) {
        errors.currentPassword = "رمز عبور فعلی الزامی است.";
    }

    if (!values.newPassword) {
        errors.newPassword = "رمز عبور جدید الزامی است.";
    } else if (values.newPassword.length < 8) {
        errors.newPassword = "رمز عبور جدید باید حداقل ۸ کاراکتر باشد.";
    } else if (values.newPassword === values.currentPassword) {
        errors.newPassword = "رمز عبور جدید نباید با رمز فعلی یکسان باشد.";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "تکرار رمز عبور الزامی است.";
    } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = "تکرار رمز عبور با رمز جدید مطابقت ندارد.";
    }

    return errors;
}

export interface SecretaryFormValues {
    name: string;
    mobile: string;
    password: string;
}

export interface SecretaryFormErrors {
    name?: string;
    mobile?: string;
    password?: string;
}

export function validateSecretaryForm(
    values: SecretaryFormValues
): SecretaryFormErrors {
    const errors: SecretaryFormErrors = {};

    const name = values.name.trim();
    if (!name) {
        errors.name = "نام منشی الزامی است.";
    } else if (name.length < 2 || name.length > 80) {
        errors.name = "نام باید بین ۲ تا ۸۰ کاراکتر باشد.";
    }

    const mobile = values.mobile.trim();
    if (!mobile) {
        errors.mobile = "شماره موبایل الزامی است.";
    } else if (!isValidMobile(mobile)) {
        errors.mobile = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
    }

    if (!values.password) {
        errors.password = "رمز عبور الزامی است.";
    } else if (values.password.length < 8) {
        errors.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    }

    return errors;
}

export interface SecretaryProfileFormValues {
    name: string;
    mobile: string;
}

export interface SecretaryProfileFormErrors {
    name?: string;
    mobile?: string;
}

export function validateSecretaryProfileForm(
    values: SecretaryProfileFormValues
): SecretaryProfileFormErrors {
    const errors: SecretaryProfileFormErrors = {};

    const name = values.name.trim();
    if (!name) {
        errors.name = "نام الزامی است.";
    } else if (name.length < 2 || name.length > 80) {
        errors.name = "نام باید بین ۲ تا ۸۰ کاراکتر باشد.";
    }

    const mobile = values.mobile.trim();
    if (!mobile) {
        errors.mobile = "شماره موبایل الزامی است.";
    } else if (!isValidMobile(mobile)) {
        errors.mobile = "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.";
    }

    return errors;
}

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

export function hasErrors(errors: ClientFormErrors): boolean {
    return Object.values(errors).some(Boolean);
}
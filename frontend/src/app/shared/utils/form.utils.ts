import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { FormError } from '../models/form-error';

// A map to translate control names to user-friendly labels.
const friendlyNameMap: { [key: string]: string } = {
    first_name: 'First Name',
    last_name: 'Last Name',
    date_of_birth: 'Date of Birth',
    sex: 'Sex',
    diagnoses: 'Diagnoses',
    // Add other control names here...
    consultation_date: 'Consultation Date',
    test_type: 'Test Type',
    examination: 'Radiology Examination',
};

// A map to associate form paths with their corresponding tabs.
const tabMap: { [key: string]: FormError['tab'] } = {
    first_name: 'info',
    last_name: 'info',
    date_of_birth: 'info',
    sex: 'info',
    addresses: 'info',
    summary: 'summary',
    consultations: 'consultations',
    lab_reports: 'labs',
    radiology_reports: 'radiology',
    sponsor: 'sponsor',
};

function getErrorTab(path: string): FormError['tab'] {
    const rootPath = path.split('.')[0];
    return tabMap[rootPath] || 'info';
}

function getErrorMessage(errorKey: string, errorValue: any): string {
    switch (errorKey) {
        case 'required':
            return 'This field is required.';
        case 'email':
            return 'Please enter a valid email address.';
        case 'minlength':
            return `Must be at least ${errorValue.requiredLength} characters.`;
        // Add more generic error messages here
        default:
            return `Validation error: ${errorKey}`;
    }
}

export function getFormErrors(
    form: FormGroup | FormArray,
    parentPath = ''
): FormError[] {
    let errors: FormError[] = [];

    Object.keys(form.controls).forEach(key => {
        const control = (form.controls as any)[key] as FormControl | FormGroup | FormArray;
        const controlPath = parentPath ? `${parentPath}.${key}` : key;

        if (control instanceof FormGroup || control instanceof FormArray) {
            errors = [...errors, ...getFormErrors(control, controlPath)];
        } else if (control.errors) {
            const errorKey = Object.keys(control.errors)[0];
            errors.push({
                controlPath,
                message: getErrorMessage(errorKey, control.errors[errorKey]),
                friendlyName: friendlyNameMap[key] || `Field "${key}"`,
                tab: getErrorTab(controlPath),
            });
        }
    });

    return errors;
}

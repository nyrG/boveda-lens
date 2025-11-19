export type FormErrorTab = 'info' | 'summary' | 'consultations' | 'labs' | 'radiology' | 'sponsor';

export interface FormError {
    controlPath: string;
    message: string;
    friendlyName: string;
    tab: FormErrorTab;
}

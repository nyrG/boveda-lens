export interface FormError {
    controlPath: string;
    message: string;
    friendlyName: string;
    tab: 'info' | 'summary' | 'consultations' | 'labs' | 'radiology' | 'sponsor';
}

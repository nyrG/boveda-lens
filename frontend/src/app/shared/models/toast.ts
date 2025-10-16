export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'action';
export type ToastState = 'visible' | 'leaving';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    state: ToastState;
    /**
     * Duration in milliseconds. If not provided, the toast may be persistent
     * until manually dismissed.
     */
    duration?: number;
    /**
     * An optional action to display with the toast, which renders a button.
     */
    action?: ToastAction;
}

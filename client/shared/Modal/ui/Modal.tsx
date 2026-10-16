'use client';
import '../style/Modal.css'

interface ModalProps {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
}

export default function Modal({
    title,
    description,
    confirmText = 'Подтвердить',
    cancelText = 'Отмена',
    isLoading = false,
    onConfirm,
    onClose,
}: ModalProps) {
    return (
        <div className="modal-overlay" onMouseDown={onClose}>
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <h2 id="modal-title">{title}</h2>

                <p>{description}</p>

                <div className="modal-actions">
                    <button
                        className="modal-cancel"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>

                    <button
                        className="modal-confirm"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Подождите...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

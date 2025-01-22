const Dialog = ({
    open,
    onClose,
    children
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Dialog content */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-[#1a1625] rounded-xl w-full max-w-md p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Dialog
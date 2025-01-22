const Label = ({
    children,
    htmlFor,
    className = '',
    ...props
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-300 mb-1 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label
const Input = ({
    className = '',
    type = 'text',
    ...props
}) => {
    return (
        <input
            type={type}
            className={`w-full px-4 py-2 bg-[#0f0a19] rounded-lg border border-gray-700 
          focus:outline-none focus:ring-2 focus:ring-purple-500 
          text-gray-200 placeholder-gray-500
          ${className}`}
            {...props}
        />
    );
};

// components/ui/Label.jsx
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
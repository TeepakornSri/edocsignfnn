import InputErrorMessage from "../login/InputErrorMessage";

export default function RegisterInput({
    type,
    placeholder,
    value,
    onChange,
    name,
    hasError,
    error,
}) {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                className={`block w-full border rounded-md px-3 py-1.5 text-sm outline-none
                   focus:ring
                   ${hasError
                        ? "border-red-500 focus:ring-red-300"
                        : "focus:ring-blue-300 focus:border-blue-500 border-gray-300 outline-none"
                    }
                   `}
                value={value}
                onChange={onChange}
                name={name}
            />
            {hasError && <InputErrorMessage message={error} />}
        </div>
    );
}

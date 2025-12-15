import React, { forwardRef } from "react";

const InputField = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      type = "text",
      placeholder = "",
      error = "",
      className = "",
      textarea = false,
      required = false,
      disabled = false,
      readOnly = false,
      ...props
    },
    ref
  ) => {
    const baseStyle =
      "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition";

    const normalStyle = error
      ? "border-red-500 focus:ring-red-300"
      : "border-gray-300 focus:ring-blue-300";

    return (
      <div className={`mb-3 ${className}`}>
        {label && (
          <label htmlFor={name} className="block font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {textarea ? (
          <textarea
            id={name}
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={`${baseStyle} ${normalStyle} resize-none min-h-[100px]`}
            {...props}
          />
        ) : (
          <input
            id={name}
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            className={`${baseStyle} ${normalStyle}`}
            {...props}
          />
        )}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

export default InputField;

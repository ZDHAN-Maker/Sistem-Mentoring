import React from "react";

export default function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = "",
  className = "",
  textarea = false,
  ...props
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={name} className="block font-medium mb-1">
          {label}
        </label>
      )}

      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
          }`}
          {...props}
        ></textarea>
      ) : (
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            error ? "border-red-500 focus:ring-red-300" : "focus:ring-blue-300"
          }`}
          {...props}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

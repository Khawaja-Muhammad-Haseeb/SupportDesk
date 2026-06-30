import { useState, useCallback } from "react";

function validateField(name, value) {
  switch (name) {
    case "customerName":
      if (!value.trim()) return "Customer name is required.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";

    case "customerEmail":
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please enter a valid email address.";
      return "";

    case "subject":
      if (!value.trim()) return "Subject is required.";
      if (value.trim().length < 5) return "Subject must be at least 5 characters.";
      return "";

    case "description":
      if (!value.trim()) return "Description is required.";
      if (value.trim().length < 10)
        return "Description must be at least 10 characters.";
      return "";

    case "priority":
      if (!value) return "Please select a priority level.";
      return "";

    default:
      return "";
  }
}

export default function useFormValidation(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  const validateAll = useCallback(() => {
    const newErrors = {};
    const newTouched = {};
    Object.keys(initialValues).forEach((key) => {
      newErrors[key] = validateField(key, values[key] || "");
      newTouched[key] = true;
    });
    setErrors(newErrors);
    setTouched(newTouched);
    return Object.values(newErrors).every((e) => !e);
  }, [values, initialValues]);

  const isValid = Object.keys(initialValues).every(
    (key) => !validateField(key, values[key] || "")
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return { values, errors, touched, handleChange, handleBlur, validateAll, isValid, reset };
}

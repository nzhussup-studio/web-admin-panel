import { useState } from "react";

export const usePopup = <T extends Record<string, any>>() => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const openPopup = (data?: Partial<T> | null) => {
    setIsEditMode(Boolean(data));
    setFormData(data || {});
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  };
};

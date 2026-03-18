import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";
import { fetchData, saveData, deleteData } from "./apiUtil";
import config from "../../config/ConfigVariables";

export const usePageData = (endpoint: string, sortBy = "displayOrder") => {
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(
    null
  );
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const fetchItems = async () => {
    const loadingTimeout = setTimeout(() => {
      setShowLoading(true);
    }, config.showLoadingDelay);

    setError(null);
    try {
      await fetchData(endpoint, (fetchedItems) => {
        const sortedItems = [...fetchedItems].sort((a, b) =>
          isAscending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
        );
        setItems(sortedItems);
      });
    } catch (error) {
      setError(error);
    } finally {
      clearTimeout(loadingTimeout);
      setShowLoading(false);
    }
  };

  const saveItem = async (formData: Record<string, any>, isEditMode: boolean) => {
    const response = await saveData(endpoint, formData, isEditMode);
    fetchItems();
    setResponse(response);
  };

  const confirmDelete = (itemId: string | number) => {
    setSelectedItemId(itemId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId) {
      try {
        const response = await deleteData(endpoint, selectedItemId);
        setSelectedItemId(null);
        setDeleteModalOpen(false);
        fetchItems();
        setResponse(response);
      } catch (error) {
        console.error("Error in handleDelete:", error);
        setError(error);
      }
    }
  };

  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  useEffect(() => {
    fetchItems();
  }, [isAscending]);

  return {
    items,
    saveItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
  };
};

export const usePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const openPopup = (data: Record<string, any> | null = null) => {
    setIsEditMode(!!data);
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

export const useRenderPage = (
  items: Record<string, any>[],
  showLoading: boolean,
  error: any,
  delay = config.showNoInfoDelay
) => {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (items.length <= 0) {
      const timeout = setTimeout(() => setDelayed(true), delay);
      return () => clearTimeout(timeout);
    } else {
      setDelayed(false);
    }
  }, [items, delay]);

  const renderPage = (
    ErrorElement: ComponentType<any>,
    LoadingElement: ComponentType,
    NoInfoFoundElement: ComponentType,
    itemPage: ReactNode
  ) => {
    if (showLoading) return <LoadingElement />;
    if (error) return <ErrorElement {...error} />;
    if (items.length <= 0 && delayed) return <NoInfoFoundElement />;
    return itemPage;
  };

  return { renderPage };
};

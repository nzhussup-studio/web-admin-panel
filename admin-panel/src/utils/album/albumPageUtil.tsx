import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  fetchData,
  saveData,
  saveImageData,
  deleteData,
  renameImage,
} from "./albumApiUtil";
import config from "../../config/ConfigVariables";

export const usePageData = (
  endpoint: string,
  isSingle = false,
  sortBy = "date"
) => {
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
      await fetchData(
        endpoint,
        (fetchedItems: { data: Record<string, any>[] }) => {
          const sortedItems = [...fetchedItems.data].sort((a, b) => {
            const sortA = a[sortBy] ? new Date(a[sortBy]).getTime() : null;
            const sortB = b[sortBy] ? new Date(b[sortBy]).getTime() : null;

            if (sortA && sortB) {
              // Both have dates, sort by date (newest to oldest)
              return sortB - sortA;
            }

            if (sortA) {
              // Only a has a date, so a should come first
              return -1;
            }

            if (sortB) {
              // Only b has a date, so b should come first
              return 1;
            }

            // Neither have dates, keep their order
            return 0;
          });

          setItems(sortedItems);
        },
        { type: "all" }
      );
    } catch (error) {
      setError(error);
    } finally {
      clearTimeout(loadingTimeout);
      setShowLoading(false);
    }
  };

  const fetchItem = async () => {
    const loadingTimeout = setTimeout(() => {
      setShowLoading(true);
    }, config.showLoadingDelay);

    setError(null);
    try {
      await fetchData(`${endpoint}`, (fetchedItem: { data: Record<string, any> }) => {
        setItems([fetchedItem.data]);
      });
    } catch (error) {
      setError(error);
    } finally {
      clearTimeout(loadingTimeout);
      setShowLoading(false);
    }
  };

  const saveItem = async (
    formData: Record<string, any>,
    isEditMode: boolean,
    isImage = false
  ) => {
    let response;
    console.log("Saving item:", formData);
    if (isImage) {
      try {
        response = await saveImageData(endpoint + "/upload", formData);
      } catch (error) {
        console.error("Error in saveImage:", error);
        setError(error);
      }
    } else {
      try {
        response = await saveData(endpoint, formData, isEditMode);
      } catch (error) {
        console.error("Error in saveData:", error);
        setError(error);
      }
    }
    if (isSingle) {
      fetchItem();
    } else {
      fetchItems();
    }
    setResponse(response);
  };

  const renameItem = async (formData: Record<string, any>) => {
    let response;
    try {
      response = await renameImage(endpoint, formData);
    } catch (error) {
      console.error("Error in renameItem:", error);
      setError(error);
      throw error;
    }
    setResponse(response);
    return response;
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
        setResponse(response);
      } catch (error) {
        console.error("Error in handleDelete:", error);
        setError(error);
      } finally {
        if (isSingle) {
          fetchItem();
        } else {
          fetchItems();
        }
      }
    }
  };

  const toggleSort = () => {
    setIsAscending(!isAscending);
  };

  useEffect(() => {
    if (isSingle) {
      fetchItem();
    } else {
      fetchItems();
    }
  }, [isAscending]);

  return {
    items,
    saveItem,
    renameItem,
    confirmDelete,
    handleDelete,
    isDeleteModalOpen,
    setDeleteModalOpen,
    toggleSort,
    showLoading,
    error,
    response,
    setResponse,
    fetchItem,
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

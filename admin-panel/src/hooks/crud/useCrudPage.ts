import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeApiError } from "@/lib/api/errors";

type RecordLike = Record<string, any>;

interface UseCrudPageOptions<TItem, TForm extends RecordLike, TId> {
  loadItems: () => Promise<TItem[]>;
  createItem: (payload: TForm) => Promise<unknown>;
  updateItem: (payload: TForm) => Promise<unknown>;
  deleteItem: (id: TId) => Promise<unknown>;
  getItemId: (item: Partial<TItem>) => TId | null | undefined;
  sortItems?: (items: TItem[], isAscending: boolean) => TItem[];
  toPayload?: (formData: Partial<TForm>) => TForm;
  initialFormData?: Partial<TForm>;
}

const defaultSortItems = <TItem,>(items: TItem[]) => items;

export const useCrudPage = <
  TItem,
  TForm extends RecordLike = RecordLike,
  TId = number,
>({
  loadItems,
  createItem,
  updateItem,
  deleteItem,
  getItemId,
  sortItems = defaultSortItems,
  toPayload,
  initialFormData = {},
}: UseCrudPageOptions<TItem, TForm, TId>) => {
  const [items, setItems] = useState<TItem[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<TId | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<Partial<TForm>>(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const loadItemsRef = useRef(loadItems);
  const sortItemsRef = useRef(sortItems);
  const initialFormDataRef = useRef(initialFormData);
  const toPayloadRef = useRef(toPayload);
  const createItemRef = useRef(createItem);
  const updateItemRef = useRef(updateItem);
  const deleteItemRef = useRef(deleteItem);

  loadItemsRef.current = loadItems;
  sortItemsRef.current = sortItems;
  initialFormDataRef.current = initialFormData;
  toPayloadRef.current = toPayload;
  createItemRef.current = createItem;
  updateItemRef.current = updateItem;
  deleteItemRef.current = deleteItem;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedItems = await loadItemsRef.current();
      setItems(sortItemsRef.current([...fetchedItems], isAscending));
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setLoading(false);
    }
  }, [isAscending]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openPopup = (item?: Partial<TForm> | null) => {
    setIsEditMode(Boolean(item));
    setFormData(item || initialFormDataRef.current);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData(initialFormDataRef.current);
  };

  const saveItem = async () => {
    const payload = toPayloadRef.current
      ? toPayloadRef.current(formData)
      : (formData as TForm);

    if (isEditMode) {
      await updateItemRef.current(payload);
    } else {
      await createItemRef.current(payload);
    }

    await refresh();
    closePopup();
  };

  const confirmDelete = (itemId?: TId | null) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedItemId(null);
  };

  const handleDelete = async () => {
    if (selectedItemId == null) return;

    try {
      await deleteItemRef.current(selectedItemId);
      closeDeleteModal();
      await refresh();
    } catch (deleteError) {
      const normalizedError = normalizeApiError(deleteError);
      setError(normalizedError);
      throw normalizedError;
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  return {
    items,
    loading,
    error,
    setError,
    refresh,
    isAscending,
    toggleSort,
    showPopup,
    formData,
    setFormData,
    isEditMode,
    openPopup,
    closePopup,
    saveItem,
    isDeleteModalOpen,
    confirmDelete,
    closeDeleteModal,
    handleDelete,
    getItemId,
  };
};

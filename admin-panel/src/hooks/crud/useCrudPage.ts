import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage, normalizeApiError } from "@/lib/api/errors";
import { useOptionalGlobalAlert } from "@/hooks/alerts/useOptionalGlobalAlert";

type RecordLike = Record<string, unknown>;

interface UseCrudPageOptions<TItem, TForm extends RecordLike, TId> {
  queryKey: readonly unknown[];
  loadItems: () => Promise<TItem[]>;
  createItem: (payload: TForm) => Promise<unknown>;
  updateItem: (payload: TForm) => Promise<unknown>;
  deleteItem: (id: TId) => Promise<unknown>;
  getItemId: (item: Partial<TItem>) => TId | null | undefined;
  sortItems?: (items: TItem[], isAscending: boolean) => TItem[];
  toPayload?: (formData: Partial<TForm>) => TForm;
  initialFormData?: Partial<TForm>;
}

const defaultSortItems = <TItem>(items: TItem[]) => items;

export const useCrudPage = <
  TItem,
  TForm extends RecordLike = RecordLike,
  TId = number,
>({
  queryKey,
  loadItems,
  createItem,
  updateItem,
  deleteItem,
  getItemId,
  sortItems = defaultSortItems,
  toPayload,
  initialFormData = {},
}: UseCrudPageOptions<TItem, TForm, TId>) => {
  const queryClient = useQueryClient();
  const { triggerAlert } = useOptionalGlobalAlert();
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<TId | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<Partial<TForm>>(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);

  const itemsQuery = useQuery({ queryKey, queryFn: loadItems });
  const items = useMemo(
    () => sortItems([...(itemsQuery.data ?? [])], isAscending),
    [isAscending, itemsQuery.data, sortItems],
  );

  useEffect(() => {
    if (!itemsQuery.error) return;
    const normalized = normalizeApiError(itemsQuery.error);
    if (normalized.status !== 401) {
      triggerAlert(
        getApiErrorMessage(itemsQuery.error, "Failed to load data"),
        "danger",
      );
    }
  }, [itemsQuery.error, triggerAlert]);

  const saveMutation = useMutation({
    mutationFn: ({ payload, editing }: { payload: TForm; editing: boolean }) =>
      editing ? updateItem(payload) : createItem(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setShowPopup(false);
      setFormData(initialFormData);
    },
    onError: (error, variables) => {
      triggerAlert(
        getApiErrorMessage(
          error,
          variables.editing ? "Failed to update item" : "Failed to create item",
        ),
        "danger",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: async () => {
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) =>
      triggerAlert(
        getApiErrorMessage(error, "Failed to delete item"),
        "danger",
      ),
  });

  const openPopup = (item?: Partial<TForm> | null) => {
    setIsEditMode(Boolean(item));
    setFormData(item ?? initialFormData);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setFormData(initialFormData);
  };

  const saveItem = async () => {
    const payload = toPayload ? toPayload(formData) : (formData as TForm);
    await saveMutation.mutateAsync({ payload, editing: isEditMode });
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
    if (selectedItemId != null)
      await deleteMutation.mutateAsync(selectedItemId);
  };

  return {
    items,
    loading: itemsQuery.isPending,
    error: itemsQuery.error,
    setError: () => undefined,
    refresh: itemsQuery.refetch,
    isAscending,
    toggleSort: () => setIsAscending((current) => !current),
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

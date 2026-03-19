import { act, renderHook, waitFor } from "@testing-library/react";
import { ApiError } from "@/lib/api/client";
import { useCrudPage } from "@/hooks/crud/useCrudPage";

describe("hooks/crud/useCrudPage.ts", () => {
  test("loads, sorts, opens popups, saves items, and deletes items", async () => {
    const loadItems = jest.fn().mockResolvedValue([
      { id: 1, name: "B" },
      { id: 2, name: "A" },
    ]);
    const createItem = jest.fn().mockResolvedValue(undefined);
    const updateItem = jest.fn().mockResolvedValue(undefined);
    const deleteItem = jest.fn().mockResolvedValue(undefined);
    const sortItems = jest.fn((items, isAscending) =>
      [...items].sort((a, b) =>
        isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      )
    );
    const toPayload = jest.fn((formData) => ({
      id: formData.id ?? 0,
      name: String(formData.name ?? "").trim(),
    }));

    const { result } = renderHook(() =>
      useCrudPage<{ id: number; name: string }, { id: number; name: string }, number>({
        loadItems,
        createItem,
        updateItem,
        deleteItem,
        getItemId: (item) => item.id,
        sortItems,
        toPayload,
        initialFormData: { id: 0, name: "" },
      })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(result.current.items.map((item) => item.name)).toEqual(["B", "A"]);

    act(() => {
      result.current.toggleSort();
    });
    await waitFor(() => expect(loadItems).toHaveBeenCalledTimes(2));
    expect(result.current.items.map((item) => item.name)).toEqual(["A", "B"]);

    act(() => {
      result.current.openPopup();
    });
    expect(result.current.showPopup).toBe(true);
    expect(result.current.isEditMode).toBe(false);

    act(() => {
      result.current.setFormData({ id: 0, name: "  New Item  " });
    });
    await act(async () => {
      await result.current.saveItem();
    });
    expect(toPayload).toHaveBeenCalledWith({ id: 0, name: "  New Item  " });
    expect(createItem).toHaveBeenCalledWith({ id: 0, name: "New Item" });
    expect(result.current.showPopup).toBe(false);

    act(() => {
      result.current.openPopup({ id: 2, name: "Changed" });
    });
    expect(result.current.isEditMode).toBe(true);
    await act(async () => {
      await result.current.saveItem();
    });
    expect(updateItem).toHaveBeenCalledWith({ id: 2, name: "Changed" });

    act(() => {
      result.current.confirmDelete(2);
    });
    expect(result.current.isDeleteModalOpen).toBe(true);
    expect(result.current.getItemId({ id: 2 })).toBe(2);

    await act(async () => {
      await result.current.handleDelete();
    });
    expect(deleteItem).toHaveBeenCalledWith(2);
    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  test("normalizes fetch and delete errors", async () => {
    const fetchError = new Error("Fetch failed");
    const deleteError = new ApiError(
      { method: "DELETE", path: "/users/1" } as never,
      { url: "", ok: false, status: 409, statusText: "Conflict", body: { detail: "In use" } } as never,
      "Conflict"
    );

    const loadItems = jest.fn().mockRejectedValue(fetchError);
    const deleteItem = jest.fn().mockRejectedValue(deleteError);

    const { result } = renderHook(() =>
      useCrudPage<{ id: number }, { id: number }, number>({
        loadItems,
        createItem: jest.fn(),
        updateItem: jest.fn(),
        deleteItem,
        getItemId: (item) => item.id,
      })
    );

    await waitFor(() =>
      expect(result.current.error).toEqual({ response: "Fetch failed" })
    );

    act(() => {
      result.current.confirmDelete(1);
    });

    await expect(
      act(async () => {
        await result.current.handleDelete();
      })
    ).rejects.toEqual({
      status: 409,
      response: "In use",
      body: { detail: "In use" },
    });
  });
});

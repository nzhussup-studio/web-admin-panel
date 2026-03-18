import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import EditableCard from "@/components/shared/EditableCard";
import {
  AdminUserControllerService,
  type user_service_AdminUserRegistryRequest,
  type user_service_User,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import PageSubHeader from "@/components/shared/PageSubHeader";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/ErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";
import GlobalAlert from "@/components/layout/GlobalAlert";

const UsersPage = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [users, setUsers] = useState<user_service_User[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [response, setResponse] = useState<{ status: number } | null>(null);

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup<user_service_User & user_service_AdminUserRegistryRequest>();

  const fetchUsers = async () => {
    setShowLoading(true);
    setError(null);
    try {
      const fetchedUsers = await AdminUserControllerService.findAll();
      const sortedUsers = [...fetchedUsers].sort((a, b) =>
        isAscending ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id)
      );
      setUsers(sortedUsers);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAscending]);

  const { renderPage } = useRenderPage(users, showLoading, error);

  const saveUser = async () => {
    if (isEditMode) {
      await AdminUserControllerService.updateUser1(formData as user_service_User);
    } else {
      await AdminUserControllerService.registerUser1(
        formData as user_service_AdminUserRegistryRequest
      );
    }
    await fetchUsers();
    closePopup();
  };

  useEffect(() => {
    if (response) {
      if (response.status === 403) {
        setAlertMessage("Can't delete last admin");
        setAlertVisible(true);
      } else if (response.status === 404) {
        setAlertMessage("User not found");
        setAlertVisible(true);
      }
      setResponse(null);
    }
  }, [response, setResponse]);

  const confirmDelete = (itemId?: number) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId == null) return;
    try {
      await AdminUserControllerService.deleteUser1({ id: selectedItemId });
      setResponse({ status: 200 });
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchUsers();
    } catch (deleteError) {
      const normalizedError = normalizeApiError(deleteError);
      setResponse(
        normalizedError.status ? { status: normalizedError.status } : null
      );
      setError(normalizedError);
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const userForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit User" : "Add User"}
      onSubmit={saveUser}
    >
      <FormInput
        label='Username'
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required={true}
      />
      <FormInput
        label='Password'
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required={true}
      />
      <FormInput
        label='Role'
        type='select'
        options={["ROLE_USER", "ROLE_ADMIN"]}
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        required={true}
      />
    </PopUp>
  );

  const userPage = (
    <PageWrapper>
      <div className='mt-4'>
        {users.map((user) => (
          <EditableCard
            key={user.id}
            title={user.username}
            onEdit={() => openPopup(user)}
            onDelete={() => confirmDelete(user.id)}
          >
            <div className='mt-4'>
              <p>Password: {user.password}</p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"User Management"} />
      <GlobalAlert
        message={alertMessage}
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
        type='alert-danger'
      />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(ErrorElement, LoadingElement, NoInfoFoundElement, userPage)}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && userForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default UsersPage;

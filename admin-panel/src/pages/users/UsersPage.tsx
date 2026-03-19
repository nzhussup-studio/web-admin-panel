import React, { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import CrudPageLayout from "@/components/pages/CrudPageLayout";
import {
  AdminUserControllerService,
  type user_service_AdminUserRegistryRequest,
  type user_service_User,
} from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { useCrudPage } from "@/hooks/crud/useCrudPage";
import Popup from "@/components/shared/Popup";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import GlobalAlert from "@/components/layout/GlobalAlert";

const UsersPage = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [response, setResponse] = useState<{ status: number } | null>(null);

  const {
    items: users,
    loading,
    error,
    setError,
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
    handleDelete: handleDeleteBase,
  } = useCrudPage<
    user_service_User,
    user_service_User & user_service_AdminUserRegistryRequest,
    number
  >({
    loadItems: () => AdminUserControllerService.findAll(),
    createItem: (payload) =>
      AdminUserControllerService.registerUser1(
        payload as user_service_AdminUserRegistryRequest
      ),
    updateItem: (payload) =>
      AdminUserControllerService.updateUser1(payload as user_service_User),
    deleteItem: (id) => AdminUserControllerService.deleteUser1({ id }),
    getItemId: (item) => item.id ?? null,
    sortItems: (items, isAscending) =>
      items.sort((a, b) =>
        isAscending ? Number(a.id) - Number(b.id) : Number(b.id) - Number(a.id)
      ),
  });

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

  const handleDelete = async () => {
    try {
      await handleDeleteBase();
      setResponse({ status: 200 });
    } catch (deleteError) {
      const normalizedError = normalizeApiError(deleteError);
      setResponse(
        normalizedError.status ? { status: normalizedError.status } : null
      );
      setError(normalizedError);
    }
  };

  const userForm = (
    <Popup
      closePopup={closePopup}
      title={isEditMode ? "Edit User" : "Add User"}
      onSubmit={saveItem}
    >
      <Form.Group className='mb-3'>
        <Form.Label>Username</Form.Label>
        <Form.Control
          value={formData.username ?? ""}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          value={formData.password ?? ""}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </Form.Group>
      <Form.Group className='mb-3'>
        <Form.Label>Role</Form.Label>
        <Form.Select
          value={formData.role ?? ""}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value='' disabled>
            Select a role
          </option>
          <option value='ROLE_USER'>ROLE_USER</option>
          <option value='ROLE_ADMIN'>ROLE_ADMIN</option>
        </Form.Select>
      </Form.Group>
    </Popup>
  );

  const userPage = (
    <div className='d-grid gap-3'>
      {users.map((user) => (
        <Card
          key={user.id}
          className='rounded-4 app-interactive-card app-resource-card'
          onClick={() => openPopup(user)}
        >
          <Card.Body className='p-4 app-card-body'>
            <div className='d-flex justify-content-between align-items-start gap-3'>
              <div>
                <Card.Title className='fw-semibold mb-3 app-card-title'>
                  {user.username}
                </Card.Title>
                <div className='d-flex flex-column gap-2'>
                  <div className='text-secondary'>Password: {user.password}</div>
                  <Badge bg={user.role === "ROLE_ADMIN" ? "danger" : "secondary"} className='align-self-start'>
                    {user.role}
                  </Badge>
                </div>
              </div>
              <div className='app-card-actions'>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    openPopup(user);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='outline-danger'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(user.id ?? null);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  return (
    <CrudPageLayout
      title='User Management'
      toggleSort={toggleSort}
      loading={loading}
      error={error}
      isEmpty={users.length === 0}
      showAddButton={!error && !showPopup}
      onAdd={() => openPopup()}
      afterHeader={
        <GlobalAlert
          message={alertMessage}
          show={alertVisible}
          onClose={() => setAlertVisible(false)}
          type='danger'
        />
      }
      modal={showPopup ? userForm : null}
      deleteDialog={
        <ConfirmDialog
          isOpen={isDeleteModalOpen}
          title='Delete User'
          message='Are you sure you want to delete this user?'
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
        />
      }
    >
      {userPage}
    </CrudPageLayout>
  );
};

export default UsersPage;

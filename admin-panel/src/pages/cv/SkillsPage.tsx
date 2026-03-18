import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import EditableCard from "@/components/shared/EditableCard";
import AddButton from "@/components/shared/AddButton";
import PopUp from "@/components/shared/Popup";
import FormInput from "@/components/shared/FormInput";
import { SkillControllerService, type base_service_Skill } from "@/lib/api/client";
import { normalizeApiError } from "@/lib/api/errors";
import { usePopup } from "@/hooks/shared/usePopup";
import { useRenderPage } from "@/hooks/shared/useRenderPage";
import PageSubHeader from "@/components/shared/PageSubHeader";
import DeleteConfirmation from "@/components/shared/DeleteConfirmationDialog";
import PageWrapper from "@/motion/PageTransition";
import LoadingElement from "@/components/states/LoadingState";
import ErrorElement from "@/components/states/ErrorState";
import NoInfoFoundElement from "@/components/states/EmptyState";

const SkillsPage = () => {
  const [skills, setSkills] = useState<base_service_Skill[]>([]);
  const [isAscending, setIsAscending] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const {
    showPopup,
    formData,
    isEditMode,
    openPopup,
    closePopup,
    setFormData,
  } = usePopup<base_service_Skill>();

  const fetchSkills = async () => {
    setShowLoading(true);
    setError(null);
    try {
      const fetchedSkills = await SkillControllerService.listSkill();
      const sortedSkills = [...fetchedSkills].sort((a, b) =>
        isAscending
          ? Number(a.displayOrder) - Number(b.displayOrder)
          : Number(b.displayOrder) - Number(a.displayOrder)
      );
      setSkills(sortedSkills as base_service_Skill[]);
    } catch (fetchError) {
      setError(normalizeApiError(fetchError));
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [isAscending]);

  const { renderPage } = useRenderPage(skills, showLoading, error);

  const saveSkill = async () => {
    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder),
    } as base_service_Skill;
    if (isEditMode) {
      await SkillControllerService.updateSkill(payload);
    } else {
      await SkillControllerService.createSkill(payload);
    }
    await fetchSkills();
    closePopup();
  };

  const confirmDelete = (itemId?: number) => {
    setSelectedItemId(itemId ?? null);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItemId == null) return;
    try {
      await SkillControllerService.deleteSkill({ id: selectedItemId });
      setDeleteModalOpen(false);
      setSelectedItemId(null);
      await fetchSkills();
    } catch (deleteError) {
      setError(normalizeApiError(deleteError));
    }
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const skillForm = (
    <PopUp
      closePopup={closePopup}
      title={isEditMode ? "Edit Skill" : "Add Skill"}
      onSubmit={saveSkill}
    >
      <FormInput
        label='Category'
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required={true}
      />
      <FormInput
        label='Skill Names (comma-separated)'
        value={formData.skillNames}
        onChange={(e) =>
          setFormData({ ...formData, skillNames: e.target.value })
        }
        required={true}
      />
      <FormInput
        label='Order Display'
        type='number'
        value={formData.displayOrder}
        onChange={(e) =>
          setFormData({ ...formData, displayOrder: e.target.value })
        }
        required={true}
      />
    </PopUp>
  );

  const skillPage = (
    <PageWrapper>
      <div className='mt-4'>
        {skills.map((skill) => (
          <EditableCard
            key={skill.id}
            title={skill.category}
            onEdit={() => openPopup(skill)}
            onDelete={() => confirmDelete(skill.id)}
          >
            <div className='mt-4'>
              {skill.skillNames.split(", ").map((skillName, index) => (
                <span
                  key={index}
                  className='badge bg-primary me-2 mb-2'
                  style={{ fontSize: "14px" }}
                >
                  {skillName}
                </span>
              ))}
              <p>Order: {skill.displayOrder}</p>
            </div>
          </EditableCard>
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <>
      <Header text={"Skills"} />
      <div className='container my-5'>
        <PageSubHeader toggleSort={toggleSort} />
        {renderPage(
          ErrorElement,
          LoadingElement,
          NoInfoFoundElement,
          skillPage
        )}
      </div>

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {showPopup && skillForm}
      {!error && !showPopup && <AddButton openPopup={openPopup} />}
    </>
  );
};

export default SkillsPage;

import type { SkillCategoryMode } from "../hooks/useCvGeneratorPreferences";

type Props = {
  value: SkillCategoryMode;
  onChange: (value: SkillCategoryMode) => void;
};

const options = [
  { value: "default", label: "Default" },
  { value: "custom", label: "Custom" },
] as const;

const CvSkillModeToggle = ({ value, onChange }: Props) => (
  <div
    className="cv-skill-mode-toggle"
    role="group"
    aria-label="Skill category mode"
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        className={option.value === value ? "is-selected" : ""}
        aria-pressed={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default CvSkillModeToggle;

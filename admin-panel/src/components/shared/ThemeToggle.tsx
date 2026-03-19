import Button from "react-bootstrap/Button";
import { BrightnessHighIcon, MoonStarsIcon } from "@/assets/icons";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
}

const ThemeToggle = ({
  isDarkMode,
  onToggle,
  className = "",
}: ThemeToggleProps) => {
  const nextModeLabel = isDarkMode ? "light" : "dark";

  return (
    <Button
      type='button'
      variant='light'
      className={`app-theme-toggle ${className}`.trim()}
      onClick={onToggle}
      aria-label={`Activate ${nextModeLabel} mode`}
      aria-pressed={isDarkMode}
    >
      <span className='app-theme-toggle-track' aria-hidden='true'>
        <span className='app-theme-toggle-option'>
          <BrightnessHighIcon width={14} height={14} />
        </span>
        <span className='app-theme-toggle-option'>
          <MoonStarsIcon width={14} height={14} />
        </span>
        <span
          className={`app-theme-toggle-thumb ${isDarkMode ? "is-dark" : ""}`}
        >
          {isDarkMode ? (
            <MoonStarsIcon width={14} height={14} />
          ) : (
            <BrightnessHighIcon width={14} height={14} />
          )}
        </span>
      </span>
    </Button>
  );
};

export default ThemeToggle;

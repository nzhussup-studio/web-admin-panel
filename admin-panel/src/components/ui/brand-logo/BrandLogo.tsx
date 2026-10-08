interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-hidden="true">
      <img
        className="brand-logo-light-theme"
        src="/brand/nz-light.svg"
        alt=""
      />
      <img className="brand-logo-dark-theme" src="/brand/nz-dark.svg" alt="" />
    </span>
  );
}

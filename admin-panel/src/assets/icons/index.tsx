import type { SVGProps } from "react";
import {
  ArrowLeftCircle,
  Hand,
  Code2,
  DatabaseZap,
  Download,
  Funnel,
  Images,
  MoonStar,
  SearchX,
  SunMedium,
  LogOut,
} from "lucide-react";

type IconProps = SVGProps<SVGSVGElement>;

export const CodeSlashIcon = (props: IconProps) => <Code2 {...props} />;

export const BackCircleIcon = (props: IconProps) => (
  <ArrowLeftCircle {...props} />
);

export const DownloadIcon = (props: IconProps) => <Download {...props} />;

export const DatabaseZapIcon = (props: IconProps) => <DatabaseZap {...props} />;

export const FunnelIcon = (props: IconProps) => <Funnel {...props} />;

export const ForbiddenIcon = (props: IconProps) => <Hand {...props} />;

export const ImagesIcon = (props: IconProps) => <Images {...props} />;

export const MoonStarsIcon = (props: IconProps) => <MoonStar {...props} />;

export const NotFoundIcon = (props: IconProps) => <SearchX {...props} />;

export const BrightnessHighIcon = (props: IconProps) => (
  <SunMedium {...props} />
);

export const LogoutIcon = (props: IconProps) => <LogOut {...props} />;

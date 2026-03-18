import type { SVGProps } from "react";
import {
  ArrowLeftCircle,
  Code2,
  Download,
  Funnel,
  Images,
  MoonStar,
  SunMedium,
} from "lucide-react";

type IconProps = SVGProps<SVGSVGElement>;

export const CodeSlashIcon = (props: IconProps) => <Code2 {...props} />;

export const BackCircleIcon = (props: IconProps) => (
  <ArrowLeftCircle {...props} />
);

export const DownloadIcon = (props: IconProps) => <Download {...props} />;

export const FunnelIcon = (props: IconProps) => <Funnel {...props} />;

export const ImagesIcon = (props: IconProps) => <Images {...props} />;

export const MoonStarsIcon = (props: IconProps) => <MoonStar {...props} />;

export const BrightnessHighIcon = (props: IconProps) => <SunMedium {...props} />;

import type { SVGProps } from "react";
import { Download, Funnel, Hand, SearchX } from "lucide-react";

type IconProps = SVGProps<SVGSVGElement>;

export const DownloadIcon = (props: IconProps) => <Download {...props} />;
export const FunnelIcon = (props: IconProps) => <Funnel {...props} />;
export const ForbiddenIcon = (props: IconProps) => <Hand {...props} />;
export const NotFoundIcon = (props: IconProps) => <SearchX {...props} />;

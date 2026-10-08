const toneByValue: Record<string, string> = {
  aws: "gold",
  bash: "slate",
  bootstrap: "purple",
  django: "blue",
  docker: "blue",
  firebase: "gold",
  "file storage": "slate",
  go: "cyan",
  java: "red",
  jest: "gold",
  k3s: "green",
  kubernetes: "blue",
  laravel: "red",
  llm: "green",
  mysql: "blue",
  nginx: "green",
  "node.js": "purple",
  openapi: "cyan",
  "pdf export": "gold",
  postgresql: "purple",
  python: "green",
  react: "blue",
  redis: "red",
  rest: "gold",
  "rest api": "purple",
  "spring boot": "green",
  typescript: "blue",
  vite: "purple",
  "vue.js": "green",
};

const fallbackTones = [
  "blue",
  "green",
  "purple",
  "gold",
  "cyan",
  "red",
  "slate",
];

interface ColorPillsProps {
  values?: string | string[] | null;
  separator?: string;
}

export function ColorPills({ values, separator = "," }: ColorPillsProps) {
  const entries = (
    Array.isArray(values) ? values : (values ?? "").split(separator)
  )
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <div className="d-flex flex-wrap gap-2">
      {entries.map((value, index) => {
        const tone =
          toneByValue[value.toLowerCase()] ??
          fallbackTones[index % fallbackTones.length];
        return (
          <span
            key={`${value}-${index}`}
            className={`badge data-pill data-pill-${tone}`}
          >
            {value}
          </span>
        );
      })}
    </div>
  );
}

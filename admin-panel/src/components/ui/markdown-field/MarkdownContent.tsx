import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export default function MarkdownContent({
  children,
  className,
}: MarkdownContentProps) {
  return (
    <div className={["app-markdown", className].filter(Boolean).join(" ")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children: linkText, href }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {linkText}
            </a>
          ),
          img: ({ alt }) => (alt ? <span>{alt}</span> : null),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

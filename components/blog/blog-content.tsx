import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

interface BlogContentProps {
  content: string;
  className?: string;
}

/**
 * Renders AI-authored markdown safely. Components are restricted to a known
 * set so the AI cannot inject raw HTML / scripts.
 */
export function BlogContent({ content, className }: BlogContentProps) {
  return (
    <div className={className}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: (props) => (
            <h1
              className="mt-10 mb-4 font-display text-3xl font-bold tracking-tight text-text first:mt-0"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="mt-12 mb-4 font-display text-2xl font-semibold tracking-tight text-text"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="mt-8 mb-3 font-display text-xl font-semibold tracking-tight text-text"
              {...props}
            />
          ),
          h4: (props) => (
            <h4
              className="mt-6 mb-2 font-display text-lg font-semibold text-text"
              {...props}
            />
          ),
          p: (props) => (
            <p
              className="my-4 text-[16px] leading-[1.78] text-text/90"
              {...props}
            />
          ),
          a: ({ href, children, ...rest }) => {
            const external = href?.startsWith("http");
            return (
              <a
                href={href}
                className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...rest}
              >
                {children}
              </a>
            );
          },
          ul: (props) => (
            <ul
              className="my-5 ml-6 list-disc space-y-2 marker:text-text-mute"
              {...props}
            />
          ),
          ol: (props) => (
            <ol
              className="my-5 ml-6 list-decimal space-y-2 marker:text-text-mute"
              {...props}
            />
          ),
          li: (props) => (
            <li className="text-[16px] leading-[1.78] text-text/90" {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-6 border-l-4 border-primary/60 bg-card/60 px-5 py-3 italic text-text-dim"
              {...props}
            />
          ),
          code: (props) => (
            <code
              className="rounded-md bg-foreground/8 px-1.5 py-0.5 font-mono text-[0.88em] text-text"
              {...props}
            />
          ),
          pre: (props) => (
            <pre
              className="my-6 overflow-x-auto rounded-xl border border-border bg-card/70 p-4 font-mono text-[13.5px] leading-relaxed"
              {...props}
            />
          ),
          hr: () => (
            <hr className="my-10 border-t border-border" />
          ),
          table: (props) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm" {...props} />
            </div>
          ),
          th: (props) => (
            <th
              className="border-b border-border bg-card/80 px-3 py-2 font-semibold text-text"
              {...props}
            />
          ),
          td: (props) => (
            <td className="border-b border-border px-3 py-2 text-text/90" {...props} />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

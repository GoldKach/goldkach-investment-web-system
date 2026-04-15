"use client";

import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your message here...",
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        document.execCommand("insertLineBreak", false);
      }
    },
    []
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        alert("This editor does not support image input. Please use a text description or upload images separately.");
        return;
      }
    }

    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") || "";
    const html = e.clipboardData?.getData("text/html");

    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const allowedTags = ["P", "BR", "B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "A", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "DIV", "SPAN"];
      const allowedAttrs = ["href", "target", "style"];

      function cleanNode(node: Node): string {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent || "";
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          const tagName = el.tagName;

          if (allowedTags.includes(tagName)) {
            let attrs = "";
            if (tagName === "A" && el.hasAttribute("href")) {
              attrs = ` href="${el.getAttribute("href")}" target="_blank"`;
            }
            if (tagName === "DIV" || tagName === "SPAN" || tagName === "P") {
              const style = el.getAttribute("style") || "";
              const textAlign = style.match(/text-align:\s*(\w+)/)?.[1];
              if (textAlign) {
                attrs = ` style="text-align: ${textAlign}"`;
              }
            }
            const children = Array.from(node.childNodes).map(cleanNode).join("");
            return `<${tagName.toLowerCase()}${attrs}>${children}</${tagName.toLowerCase()}>`;
          }
          return Array.from(node.childNodes).map(cleanNode).join("");
        }
        return "";
      }

      const cleaned = Array.from(doc.body.childNodes).map(cleanNode).join("");
      document.execCommand("insertHTML", false, cleaned);
    } else {
      document.execCommand("insertText", false, text);
    }
  }, []);

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap border border-input bg-background rounded-md p-1">
        <ToolbarButton
          onClick={() => execCommand("bold")}
          disabled={disabled}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("italic")}
          disabled={disabled}
          title="Italic"
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("underline")}
          disabled={disabled}
          title="Underline"
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => execCommand("insertUnorderedList")}
          disabled={disabled}
          title="Bullet List"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("insertOrderedList")}
          disabled={disabled}
          title="Numbered List"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 20h.01M3 12h.01M3 4h.01" />
          </svg>
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => execCommand("justifyLeft")}
          disabled={disabled}
          title="Align Left"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("justifyCenter")}
          disabled={disabled}
          title="Align Center"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
          </svg>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("justifyRight")}
          disabled={disabled}
          title="Align Right"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        suppressContentEditableWarning
        className={cn(
          "min-h-[150px] max-h-[300px] overflow-y-auto p-3 border border-input bg-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 outline-none",
          "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded text-sm text-slate-600 dark:text-slate-300",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors"
      )}
    >
      {children}
    </button>
  );
}

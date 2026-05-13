"use client";

import { Loader2 } from "lucide-react";

type ToolInvocationLike = {
  toolName: string;
  args?: Record<string, unknown> | unknown;
  state: "partial-call" | "call" | "result";
  result?: unknown;
};

interface ToolInvocationProps {
  toolInvocation: ToolInvocationLike;
}

function basename(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  const slash = trimmed.lastIndexOf("/");
  return slash === -1 ? trimmed : trimmed.slice(slash + 1) || trimmed;
}

export function getToolInvocationLabel(
  toolInvocation: ToolInvocationLike
): string {
  const { toolName } = toolInvocation;
  const args = (toolInvocation.args ?? {}) as Record<string, unknown>;
  const command = typeof args.command === "string" ? args.command : undefined;
  const path = typeof args.path === "string" ? args.path : undefined;
  const newPath =
    typeof args.new_path === "string" ? args.new_path : undefined;

  if (toolName === "str_replace_editor") {
    if (!path) return "Editing file";
    const name = basename(path);
    switch (command) {
      case "create":
        return `Creating ${name}`;
      case "str_replace":
      case "insert":
        return `Editing ${name}`;
      case "view":
        return `Viewing ${name}`;
      case "undo_edit":
        return `Reverting ${name}`;
      default:
        return `Editing ${name}`;
    }
  }

  if (toolName === "file_manager") {
    if (!path) return "Updating files";
    const name = basename(path);
    switch (command) {
      case "rename":
        return newPath
          ? `Renaming ${name} to ${basename(newPath)}`
          : `Renaming ${name}`;
      case "delete":
        return `Deleting ${name}`;
      default:
        return `Updating ${name}`;
    }
  }

  return toolName;
}

export function ToolInvocation({ toolInvocation }: ToolInvocationProps) {
  const label = getToolInvocationLabel(toolInvocation);
  const isDone =
    toolInvocation.state === "result" && toolInvocation.result !== undefined;

  return (
    <div
      data-testid="tool-invocation"
      className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200"
    >
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}

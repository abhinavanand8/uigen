import { test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MainContent } from "@/app/main-content";

vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useFileSystem: () => ({}),
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useChat: () => ({}),
}));

vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface" />,
}));

vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree" />,
}));

vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor" />,
}));

vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame" />,
}));

vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions" />,
}));

vi.mock("@/components/ui/resizable", () => ({
  ResizablePanelGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ResizablePanel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ResizableHandle: () => <div />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

test("renders Preview view by default", () => {
  render(<MainContent />);
  expect(screen.getByTestId("preview-frame")).toBeTruthy();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("clicking Code tab switches to the code view", () => {
  render(<MainContent />);
  fireEvent.click(screen.getByRole("tab", { name: "Code" }));
  expect(screen.getByTestId("code-editor")).toBeTruthy();
  expect(screen.getByTestId("file-tree")).toBeTruthy();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
});

test("clicking Preview tab switches back to the preview view", () => {
  render(<MainContent />);
  fireEvent.click(screen.getByRole("tab", { name: "Code" }));
  fireEvent.click(screen.getByRole("tab", { name: "Preview" }));
  expect(screen.getByTestId("preview-frame")).toBeTruthy();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("Code tab has aria-selected=true after click", () => {
  render(<MainContent />);
  const codeTab = screen.getByRole("tab", { name: "Code" });
  const previewTab = screen.getByRole("tab", { name: "Preview" });
  expect(previewTab.getAttribute("aria-selected")).toBe("true");
  expect(codeTab.getAttribute("aria-selected")).toBe("false");
  fireEvent.click(codeTab);
  expect(codeTab.getAttribute("aria-selected")).toBe("true");
  expect(previewTab.getAttribute("aria-selected")).toBe("false");
});

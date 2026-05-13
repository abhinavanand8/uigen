import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocation, getToolInvocationLabel } from "../ToolInvocation";

afterEach(() => {
  cleanup();
});

test("labels str_replace_editor create as 'Creating <basename>'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "create", path: "/components/Card.jsx" },
      state: "result",
      result: "ok",
    })
  ).toBe("Creating Card.jsx");
});

test("labels str_replace_editor str_replace as 'Editing <basename>'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "str_replace", path: "/App.jsx" },
      state: "result",
      result: "ok",
    })
  ).toBe("Editing App.jsx");
});

test("labels str_replace_editor insert as 'Editing <basename>'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "insert", path: "/App.jsx" },
      state: "call",
    })
  ).toBe("Editing App.jsx");
});

test("labels str_replace_editor view as 'Viewing <basename>'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "view", path: "/lib/utils.ts" },
      state: "call",
    })
  ).toBe("Viewing utils.ts");
});

test("labels str_replace_editor undo_edit as 'Reverting <basename>'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "undo_edit", path: "/App.jsx" },
      state: "call",
    })
  ).toBe("Reverting App.jsx");
});

test("labels file_manager delete as 'Deleting <basename>'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "file_manager",
      args: { command: "delete", path: "/components/Old.jsx" },
      state: "result",
      result: "ok",
    })
  ).toBe("Deleting Old.jsx");
});

test("labels file_manager rename with new_path as 'Renaming A to B'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "file_manager",
      args: {
        command: "rename",
        path: "/components/Old.jsx",
        new_path: "/components/New.jsx",
      },
      state: "result",
      result: "ok",
    })
  ).toBe("Renaming Old.jsx to New.jsx");
});

test("labels file_manager rename without new_path falls back to 'Renaming <basename>'", () => {
  expect(
    getToolInvocationLabel({
      toolName: "file_manager",
      args: { command: "rename", path: "/components/Old.jsx" },
      state: "call",
    })
  ).toBe("Renaming Old.jsx");
});

test("uses bare filename when path has no slashes", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "create", path: "App.jsx" },
      state: "call",
    })
  ).toBe("Creating App.jsx");
});

test("falls back to 'Editing file' when path is missing", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "create" },
      state: "call",
    })
  ).toBe("Editing file");
});

test("falls back to 'Editing <basename>' for unknown str_replace_editor command", () => {
  expect(
    getToolInvocationLabel({
      toolName: "str_replace_editor",
      args: { command: "mystery", path: "/App.jsx" },
      state: "call",
    })
  ).toBe("Editing App.jsx");
});

test("falls back to toolName for unknown tools", () => {
  expect(
    getToolInvocationLabel({
      toolName: "some_other_tool",
      args: {},
      state: "call",
    })
  ).toBe("some_other_tool");
});

test("ToolInvocation renders the friendly label", () => {
  render(
    <ToolInvocation
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "ok",
      }}
    />
  );

  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

test("ToolInvocation shows green dot when state is result with a result value", () => {
  const { container } = render(
    <ToolInvocation
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "result",
        result: "ok",
      }}
    />
  );

  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolInvocation shows spinner while the call is in progress", () => {
  const { container } = render(
    <ToolInvocation
      toolInvocation={{
        toolName: "str_replace_editor",
        args: { command: "create", path: "/App.jsx" },
        state: "call",
      }}
    />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

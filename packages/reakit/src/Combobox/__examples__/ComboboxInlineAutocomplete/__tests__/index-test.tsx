import * as React from "react";
import {
  render,
  press,
  focus,
  click,
  fireEvent,
  screen,
} from "reakit-test-utils";
import ComboboxInlineAutocomplete from "..";

test("change combobox value by focusing on combobox options", () => {
  render(<ComboboxInlineAutocomplete />);
  click(screen.getByLabelText("Color"));
  expect(screen.getByLabelText("Color")).toHaveValue("");
  focus(screen.getByText("Red"));
  expect(screen.getByLabelText("Color")).toHaveValue("Red");
});

test("change combobox value by arrowing through combobox options", () => {
  render(<ComboboxInlineAutocomplete />);
  click(screen.getByLabelText("Color"));
  expect(screen.getByLabelText("Color")).toHaveValue("");
  press.ArrowDown();
  expect(screen.getByLabelText("Color")).toHaveValue("Red");
  press.ArrowDown();
  expect(screen.getByLabelText("Color")).toHaveValue("Green");
  press.ArrowDown();
  expect(screen.getByLabelText("Color")).toHaveValue("Blue");
  press.ArrowDown();
  expect(screen.getByLabelText("Color")).toHaveValue("");
});

test("revert combobox value after closing combobox popover with esc", () => {
  render(<ComboboxInlineAutocomplete />);
  click(screen.getByLabelText("Color"));
  expect(screen.getByLabelText("Color")).toHaveValue("");
  press.ArrowUp();
  expect(screen.getByLabelText("Color")).toHaveValue("Blue");
  press.Escape();
  expect(screen.getByLabelText("Color")).toHaveValue("");
});

test("keep combobox value after closing combobox popover by tabbing out", () => {
  render(
    <>
      <ComboboxInlineAutocomplete />
      <button>button</button>
    </>
  );
  click(screen.getByLabelText("Color"));
  expect(screen.getByLabelText("Color")).toHaveValue("");
  press.Home();
  expect(screen.getByLabelText("Color")).toHaveValue("Red");
  press.Tab();
  expect(screen.getByLabelText("Color")).toHaveValue("Red");
});

test("keep combobox value after closing combobox popover by clicking outside", () => {
  const { baseElement } = render(<ComboboxInlineAutocomplete />);
  click(screen.getByLabelText("Color"));
  expect(screen.getByLabelText("Color")).toHaveValue("");
  press.End();
  expect(screen.getByLabelText("Color")).toHaveValue("Blue");
  click(baseElement);
  expect(screen.getByLabelText("Color")).toHaveValue("Blue");
});

test("unselect combobox option when cleaning combobox value", () => {
  render(<ComboboxInlineAutocomplete />);
  click(screen.getByLabelText("Color"));
  expect(screen.getByLabelText("Color")).toHaveValue("");
  focus(screen.getByText("Red"));
  expect(screen.getByLabelText("Color")).toHaveValue("Red");
  fireEvent.change(screen.getByLabelText("Color"), { target: { value: "" } });
  expect(screen.getByText("Red")).not.toHaveFocus();
  expect(screen.getByText("Green")).not.toHaveFocus();
  expect(screen.getByText("Blue")).not.toHaveFocus();
  expect(screen.getByLabelText("Color")).toHaveValue("");
});

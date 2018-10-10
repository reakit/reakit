import * as React from "react";
import { render, fireEvent } from "react-testing-library";
import Hidden from "../Hidden";

const addEventListener = jest.spyOn(document.body, "addEventListener");

beforeEach(() => {
  jest.clearAllMocks();
});

test("styled", () => {});

test("add event handler on mount", () => {
  const props = {
    hide: jest.fn(),
    visible: true,
    hideOnEsc: true,
    hideOnClickOutside: true
  };
  render(<Hidden {...props} />);
  expect(addEventListener).toHaveBeenCalledTimes(2);
});

test("call hide when press Escape", () => {
  const props = {
    hide: jest.fn(),
    hideOnEsc: true
  };
  const { rerender } = render(<Hidden {...props} />);
  rerender(<Hidden {...props} visible />);
  expect(props.hide).toHaveBeenCalledTimes(0);
  fireEvent.keyDown(document.body, { key: "Enter" });
  expect(props.hide).toHaveBeenCalledTimes(0);
  fireEvent.keyDown(document.body, { key: "Escape" });
  expect(props.hide).toHaveBeenCalledTimes(1);
});

test("call hide when click outside", () => {
  jest.useFakeTimers();
  const props = {
    hide: jest.fn(),
    hideOnClickOutside: true,
    visible: false
  };
  const { rerender } = render(<Hidden {...props} />);

  fireEvent.click(document.body);
  jest.runAllTimers();
  expect(props.hide).toHaveBeenCalledTimes(0);

  rerender(<Hidden {...props} visible />);
  fireEvent.click(document.body);
  expect(props.hide).toHaveBeenCalledTimes(0);
  jest.runAllTimers();
  expect(props.hide).toHaveBeenCalledTimes(1);
});

test("unmount", () => {
  const { container, rerender } = render(<Hidden unmount />);
  expect(container.firstChild).toBeNull();
  rerender(<Hidden unmount visible />);
  expect(container.firstChild).not.toBeNull();
});

test("wait for the transition to complete before unmounting", () => {
  const { container, rerender, getByTestId } = render(
    <Hidden unmount visible fade />
  );
  rerender(<Hidden data-testid="test" unmount fade />);
  expect(container.firstChild).not.toBeNull();
  fireEvent.transitionEnd(getByTestId("test"));
  expect(container.firstChild).toBeNull();
});

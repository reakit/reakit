import * as React from "react";
import { render, axe } from "reakit-test-utils";
import { Dialog } from "../Dialog";

const props: Parameters<typeof Dialog>[0] = {
  baseId: "base",
  "aria-label": "dialog",
};

test("render", () => {
  const { baseElement } = render(<Dialog {...props}>dialog</Dialog>);
  expect(baseElement).toMatchInlineSnapshot(`
    <body>
      <div />
      <div
        class="__reakit-portal"
      >
        <div
          aria-label="dialog"
          aria-modal="true"
          data-dialog="true"
          hidden=""
          id="base"
          role="dialog"
          style="display: none;"
          tabindex="-1"
        >
          dialog
        </div>
      </div>
    </body>
  `);
});

test("render visible", () => {
  const { baseElement } = render(
    <Dialog {...props} visible>
      dialog
    </Dialog>
  );
  expect(baseElement).toMatchInlineSnapshot(`
    <body>
      <div />
      <div
        aria-hidden="true"
        class="__reakit-focus-trap"
        style="position: fixed;"
        tabindex="0"
      />
      <div
        class="__reakit-portal"
      >
        <div
          aria-label="dialog"
          aria-modal="true"
          data-dialog="true"
          id="base"
          role="dialog"
          tabindex="-1"
        >
          dialog
        </div>
      </div>
      <div
        aria-hidden="true"
        class="__reakit-focus-trap"
        style="position: fixed;"
        tabindex="0"
      />
    </body>
  `);
});

test("render non-modal", () => {
  const { baseElement } = render(
    <Dialog {...props} modal={false}>
      test
    </Dialog>
  );
  expect(baseElement).toMatchInlineSnapshot(`
    <body
      style="padding-right: 1024px; overflow: hidden;"
    >
      <div>
        <div
          aria-label="dialog"
          data-dialog="true"
          hidden=""
          id="base"
          role="dialog"
          style="display: none;"
          tabindex="-1"
        >
          test
        </div>
      </div>
    </body>
  `);
});

test("render with no a11y violations", async () => {
  const { baseElement } = render(<Dialog {...props}>dialog</Dialog>);
  const results = await axe(baseElement.innerHTML);

  expect(results).toHaveNoViolations();
});

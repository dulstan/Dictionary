import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { describe, test } from "vitest";

describe("App", () => {
  test("renders the App component", () => {
    render(<App />);
  });
});

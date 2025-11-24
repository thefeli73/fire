import { render, screen } from "@testing-library/react";
import FireCalculatorForm from "../FireCalculatorForm";
import { describe, it, expect, vi } from "vitest";

// Mocking ResizeObserver because it's not available in jsdom and Recharts uses it
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe("FireCalculatorForm", () => {
  it("renders the form with default values", () => {
    render(<FireCalculatorForm />);
    
    expect(screen.getByText("FIRE Calculator")).toBeInTheDocument();
    expect(screen.getByLabelText(/Starting Capital/i)).toHaveValue(50000);
    expect(screen.getByLabelText(/Monthly Savings/i)).toHaveValue(1500);
  });

  it("renders the Calculate button", () => {
    render(<FireCalculatorForm />);
    expect(screen.getByRole("button", { name: /Calculate/i })).toBeInTheDocument();
  });
});


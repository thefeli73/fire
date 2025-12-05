import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FireCalculatorForm from "../FireCalculatorForm";
import { describe, it, expect, vi, beforeAll } from "vitest";

// Mocking ResizeObserver
class ResizeObserver {
  observe() { /* noop */ }
  unobserve() { /* noop */ }
  disconnect() { /* noop */ }
}
global.ResizeObserver = ResizeObserver;

// Fix for Radix UI pointer capture error in JSDOM
beforeAll(() => {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.setPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

// Mock Recharts ResponsiveContainer
vi.mock("recharts", async () => {
  const originalModule = await vi.importActual("recharts");
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: "500px", height: "300px" }}>{children}</div>
    ),
  };
});

describe("FireCalculatorForm", () => {
  it("renders the form with default values", () => {
    render(<FireCalculatorForm />);
    
    expect(screen.getByText("FIRE Calculator")).toBeInTheDocument();
    expect(screen.getByLabelText(/Starting Capital/i)).toHaveValue(50000);
    expect(screen.getByLabelText(/Monthly Savings/i)).toHaveValue(1500);
    expect(screen.getByLabelText(/Current Age/i)).toHaveValue(25);
  });

  it("calculates and displays results when submitted", async () => {
    const user = userEvent.setup();
    render(<FireCalculatorForm />);
    
    const calculateButton = screen.getByRole("button", { name: /Calculate/i });
    await user.click(calculateButton);

    await waitFor(() => {
        expect(screen.getByText("Financial Projection")).toBeInTheDocument();
        expect(screen.getByText("FIRE Number")).toBeInTheDocument();
    });
  });

  it("allows changing inputs", () => {
      // using fireEvent for reliability with number inputs in jsdom
      render(<FireCalculatorForm />);
      
      const savingsInput = screen.getByLabelText(/Monthly Savings/i);
      
      fireEvent.change(savingsInput, { target: { value: "2000" } });
      
      expect(savingsInput).toHaveValue(2000);
  });
  
  it("validates inputs", async () => {
      const user = userEvent.setup();
      render(<FireCalculatorForm />);
      
      const ageInput = screen.getByLabelText(/Current Age/i);
      // Use fireEvent to set invalid value directly
      fireEvent.change(ageInput, { target: { value: "-5" } });
      
      const calculateButton = screen.getByRole("button", { name: /Calculate/i });
      await user.click(calculateButton);
      
      // Look for error message text
      expect(await screen.findByText(/Age must be at least 1/i)).toBeInTheDocument();
  });

  it("toggles Monte Carlo simulation mode", async () => {
    const user = userEvent.setup();
    render(<FireCalculatorForm />);

    // Select Trigger
    const modeTrigger = screen.getByRole("combobox", { name: /Simulation Mode/i });
    await user.click(modeTrigger);
    
    // Select Monte Carlo from dropdown
    const monteCarloOption = await screen.findByRole("option", { name: /Monte Carlo/i });
    await user.click(monteCarloOption);

    // Verify Volatility input appears
    expect(await screen.findByLabelText(/Market Volatility/i)).toBeInTheDocument();
  });

  it("toggles 4% Rule overlay", async () => {
    const user = userEvent.setup();
    render(<FireCalculatorForm />);
    
    // Calculate first to show results
    const calculateButton = screen.getByRole("button", { name: /Calculate/i });
    await user.click(calculateButton);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Financial Projection")).toBeInTheDocument();
    });

    // Find the Show 4%-Rule button
    const showButton = screen.getByRole("button", { name: /Show 4%-Rule/i });
    await user.click(showButton);

    // Should now see 4%-Rule stats
    expect(await screen.findByText("4%-Rule FIRE Number")).toBeInTheDocument();
    
    // Button text should change
    expect(screen.getByRole("button", { name: /Hide 4%-Rule/i })).toBeInTheDocument();
  });

  it("handles withdrawal strategy selection", async () => {
    const user = userEvent.setup();
    render(<FireCalculatorForm />);

    const strategyTrigger = screen.getByRole("combobox", { name: /Withdrawal Strategy/i });
    await user.click(strategyTrigger);

    const percentageOption = await screen.findByRole("option", { name: /Percentage of Portfolio/i });
    await user.click(percentageOption);

    expect(await screen.findByLabelText(/Withdrawal Percentage/i)).toBeInTheDocument();
  });
});

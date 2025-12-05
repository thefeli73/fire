import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FireCalculatorForm from "../FireCalculatorForm";
import { describe, it, expect } from "vitest";

// Mocking ResizeObserver because it's not available in jsdom and Recharts uses it
class ResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
}
global.ResizeObserver = ResizeObserver;

describe("FireCalculatorForm", () => {
  it("renders the form with default values", () => {
    render(<FireCalculatorForm />);
    
    expect(screen.getByText("FIRE Calculator")).toBeInTheDocument();
    expect(screen.getByLabelText(/Starting Capital/i)).toHaveValue(50000);
    expect(screen.getByLabelText(/Monthly Savings/i)).toHaveValue(1500);
  });

  it("calculates and displays results when submitted", async () => {
    render(<FireCalculatorForm />);
    
    const calculateButton = screen.getByRole("button", { name: /Calculate/i });
    fireEvent.click(calculateButton);

    await waitFor(() => {
        expect(screen.getByText("Financial Projection")).toBeInTheDocument();
        expect(screen.getByText("FIRE Number")).toBeInTheDocument();
    });
  });

  it("allows changing inputs", () => {
      render(<FireCalculatorForm />);
      const savingsInput = screen.getByLabelText(/Monthly Savings/i);
      fireEvent.change(savingsInput, { target: { value: "2000" } });
      expect(savingsInput).toHaveValue(2000);
  });
  
  it("validates inputs", async () => {
      render(<FireCalculatorForm />);
      const ageInput = screen.getByLabelText(/Current Age/i);
      fireEvent.change(ageInput, { target: { value: "-5" } });
      fireEvent.blur(ageInput); // Trigger validation

      // Find validation error (might need to adjust selector based on how FormMessage renders)
      // Expecting some error message about min value
      // Since validation happens on submit mostly in this form unless touched, lets try submit
      const calculateButton = screen.getByRole("button", { name: /Calculate/i });
      fireEvent.click(calculateButton);
      
      // You might need to adjust what text to look for based on zod schema messages
      expect(await screen.findByText(/Age must be at least 1/i)).toBeInTheDocument();
  });
});

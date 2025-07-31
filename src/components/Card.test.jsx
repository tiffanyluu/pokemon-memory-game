import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

const mockPokemonData = {
  name: "pikachu",
  sprites: {
    front_default: "https://example.com/pikachu.png",
  },
};

describe("Card Component", () => {
  const mockOnClick = vi.fn();
  const testUrl = "https://pokeapi.co/api/v2/pokemon/25";

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPokemonData),
      })
    );
  });

  it("displays loading state initially", () => {
    render(<Card url={testUrl} onClick={mockOnClick} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays Pokemon data", async () => {
    render(<Card url={testUrl} onClick={mockOnClick} />);

    await waitFor(() => {
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(testUrl);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      mockPokemonData.sprites.front_default
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Pikachu");
  });

  it("formats Pokemon names correctly", async () => {
    const mockDataWithHyphen = {
      name: "ho-oh",
      sprites: { front_default: "https://example.com/ho-oh.png" },
    };

    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockDataWithHyphen),
      })
    );

    render(<Card url={testUrl} onClick={mockOnClick} />);

    await waitFor(() => {
      expect(screen.getByText("Ho Oh")).toBeInTheDocument();
    });
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    render(<Card url={testUrl} onClick={mockOnClick} />);

    await waitFor(() => {
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
    });

    const card = screen.getByText("Pikachu").parentElement;
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("applies glow class when glow prop is true", async () => {
    render(<Card url={testUrl} onClick={mockOnClick} glow={true} />);

    await waitFor(() => {
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
    });

    const card = screen.getByText("Pikachu").parentElement;
    expect(card).toHaveClass("glowing-card");
  });

  it("does not apply glow class when glow prop is false", async () => {
    render(<Card url={testUrl} onClick={mockOnClick} glow={false} />);

    await waitFor(() => {
      expect(screen.getByText("Pikachu")).toBeInTheDocument();
    });

    const card = screen.getByText("Pikachu").parentElement;
    expect(card).not.toHaveClass("glowing-card");
  });

  it("handles API error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    globalThis.fetch = vi.fn(() => Promise.reject(new Error("API Error")));

    render(<Card url={testUrl} onClick={mockOnClick} />);

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should continue showing loading state if API fails
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching Pokemon data:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("./components/CardContainer", () => ({
  default: ({ score, highScore }) => (
    <div data-testid="card-container">
      Mock CardContainer - Score: {score}, High Score: {highScore}
    </div>
  ),
}));

describe("App Component", () => {
  it("renders the game title", () => {
    render(<App />);
    expect(screen.getByText("Pokémon Memory Game")).toBeInTheDocument();
  });

  it("displays game instructions", () => {
    render(<App />);
    expect(
      screen.getByText(/Click on Pokémon images to earn points/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /clicking on the same card more than once will reset your score/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/With over 1000 Pokémon featured/)
    ).toBeInTheDocument();
  });

  it("initializes with score of 0", () => {
    render(<App />);
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
  });

  it("initializes with high score of 0", () => {
    render(<App />);
    expect(screen.getByText("Best Score: 0")).toBeInTheDocument();
  });

  it("renders the CardContainer component", () => {
    render(<App />);
    expect(screen.getByTestId("card-container")).toBeInTheDocument();
  });

  it("has proper CSS classes applied", () => {
    render(<App />);
    const title = screen.getByText("Pokémon Memory Game");
    expect(title).toHaveClass("title");

    const scoreDisplay = screen.getByText("Score: 0");
    expect(scoreDisplay.parentElement).toHaveClass("rightside");
  });
});

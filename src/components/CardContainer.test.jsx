import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardContainer from "./CardContainer";

vi.mock("./Card", () => ({
  default: ({ url, onClick, glow }) => {
    const id = url.split("/").filter(Boolean).pop();
    return (
      <div
        data-testid={`card-${id}`}
        onClick={onClick}
        className={glow ? "glowing" : ""}
      >
        Mock Card {id}
      </div>
    );
  },
}));

describe("CardContainer Component", () => {
  const mockProps = {
    score: 0,
    setScore: vi.fn(),
    highScore: 5,
    setHighScore: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders cards initially", async () => {
    render(<CardContainer {...mockProps} />);

    await waitFor(
      () => {
        const cards = screen.getAllByTestId(/card-/);
        expect(cards.length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );
  });

  it("increments score when clicking a new card", async () => {
    const user = userEvent.setup();
    const setScore = vi.fn();

    render(<CardContainer {...mockProps} setScore={setScore} />);

    await waitFor(
      () => {
        expect(screen.getAllByTestId(/card-/).length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    const firstCard = screen.getAllByTestId(/card-/)[0];
    await user.click(firstCard);

    expect(setScore).toHaveBeenCalledWith(1);
  });

  it("resets score when clicking the same card twice", async () => {
    const user = userEvent.setup();
    const setScore = vi.fn();

    render(<CardContainer {...mockProps} setScore={setScore} />);

    await waitFor(
      () => {
        expect(screen.getAllByTestId(/card-/).length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    const firstCard = screen.getAllByTestId(/card-/)[0];
    const firstCardId = firstCard.getAttribute("data-testid");

    await user.click(firstCard);
    expect(setScore).toHaveBeenCalledWith(1);

    const sameCardAfterShuffle = screen.getByTestId(firstCardId);
    await user.click(sameCardAfterShuffle);

    expect(setScore).toHaveBeenCalledWith(0);
  });

  it("updates high score when current score exceeds it", async () => {
    const user = userEvent.setup();
    const setHighScore = vi.fn();

    render(
      <CardContainer
        {...mockProps}
        score={10}
        highScore={5}
        setHighScore={setHighScore}
      />
    );

    await waitFor(
      () => {
        expect(screen.getAllByTestId(/card-/).length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    const firstCard = screen.getAllByTestId(/card-/)[0];
    const firstCardId = firstCard.getAttribute("data-testid");

    await user.click(firstCard);

    const sameCardAfterShuffle = screen.getByTestId(firstCardId);
    await user.click(sameCardAfterShuffle);

    expect(setHighScore).toHaveBeenCalledWith(10);
  });

  it("does not update high score when current score is lower", async () => {
    const user = userEvent.setup();
    const setHighScore = vi.fn();

    render(
      <CardContainer
        {...mockProps}
        score={3}
        highScore={10}
        setHighScore={setHighScore}
      />
    );

    await waitFor(
      () => {
        expect(screen.getAllByTestId(/card-/).length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    const firstCard = screen.getAllByTestId(/card-/)[0];
    const firstCardId = firstCard.getAttribute("data-testid");

    await user.click(firstCard);

    const sameCardAfterShuffle = screen.getByTestId(firstCardId);
    await user.click(sameCardAfterShuffle);

    expect(setHighScore).not.toHaveBeenCalled();
  });

  it("maintains cards after clicks", async () => {
    const user = userEvent.setup();

    render(<CardContainer {...mockProps} />);

    await waitFor(
      () => {
        expect(screen.getAllByTestId(/card-/).length).toBeGreaterThan(0);
      },
      { timeout: 3000 }
    );

    const initialCardCount = screen.getAllByTestId(/card-/).length;
    const firstCard = screen.getAllByTestId(/card-/)[0];

    await user.click(firstCard);

    await waitFor(() => {
      const cardsAfterClick = screen.getAllByTestId(/card-/);
      expect(cardsAfterClick).toHaveLength(initialCardCount);
    });
  });
});

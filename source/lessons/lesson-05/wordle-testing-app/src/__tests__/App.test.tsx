import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Create the same theme used in main.tsx for consistent testing
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6aaa64",
    },
    secondary: {
      main: "#c9b458",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
  },
});

// Helper function to render App with theme provider (like in main.tsx)
const renderAppWithTheme = () => {
  return render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
};

describe("Wordle App - Basic Rendering Tests", () => {
  describe("🟢 Beginner Level Tests", () => {
    test("App renders without crashing", () => {
      renderAppWithTheme();
      expect(document.body).toBeInTheDocument();
    });

    test("Title displays correctly", () => {
      renderAppWithTheme();
      const titleElement = screen.getByTestId("game-title");
      expect(titleElement).toBeInTheDocument();
      expect(titleElement).toHaveTextContent("Wordle Testing Game");
    });

    test("Game board shows 6 rows of empty cells", () => {
      renderAppWithTheme();
      const gameBoard = screen.getByTestId("game-board");
      expect(gameBoard).toBeInTheDocument();

      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
          const cell = screen.getByTestId(`cell-${row}-${col}`);
          expect(cell).toBeInTheDocument();
          expect(cell).toHaveTextContent("");
        }
      }
    });
  });
});

test("Current guess display is present", () => {
  renderAppWithTheme();
  const guessLabel = screen.getByTestId("current-guess-label");
  const guessDisplay = screen.getByTestId("current-guess-display");
  expect(guessLabel).toBeInTheDocument();
  expect(guessDisplay).toBeInTheDocument();
});

test("Virtual keyboard is present", () => {
  renderAppWithTheme();
  const keyboard = screen.getByTestId("virtual-keyboard");
  expect(keyboard).toBeInTheDocument();
  expect(screen.getByTestId("keyboard-key-a")).toBeInTheDocument();
  expect(screen.getByTestId("keyboard-key-enter")).toBeInTheDocument();
  expect(screen.getByTestId("keyboard-key-backspace")).toBeInTheDocument();
});

test("All control buttons are present", () => {
  renderAppWithTheme();
  expect(screen.getByTestId("new-game-button")).toBeInTheDocument();
  expect(screen.getByTestId("instructions-button")).toBeInTheDocument();
});

test("Virtual keyboard input updates current guess", async () => {
  renderAppWithTheme();
  await userEvent.click(screen.getByTestId("keyboard-key-a"));
  await userEvent.click(screen.getByTestId("keyboard-key-b"));
  await userEvent.click(screen.getByTestId("keyboard-key-c"));
  
  const guessDisplay = await screen.findByTestId("current-guess-display");
  await waitFor(() => {
    expect(guessDisplay.textContent?.toLowerCase()).toContain("abc");
  });
});

test("Backspace removes last letter from guess", async () => {
  renderAppWithTheme();
  await userEvent.click(screen.getByTestId("keyboard-key-a"));
  await userEvent.click(screen.getByTestId("keyboard-key-b"));
  await userEvent.click(screen.getByTestId("keyboard-key-backspace"));
  
  const guessDisplay = await screen.findByTestId("current-guess-display");
  await waitFor(() => {
    expect(guessDisplay.textContent?.toLowerCase()).toContain("a");
    expect(guessDisplay.textContent?.toLowerCase()).not.toContain("b");
  });
});

test("Submitting invalid guess shows error message", async () => {
  renderAppWithTheme();
  
  for (const letter of "QWERT") {
    await userEvent.click(screen.getByTestId(`keyboard-key-${letter.toLowerCase()}`));
  }
  
  const enterBtn = screen.getByTestId("keyboard-key-enter");
  await waitFor(() => expect(enterBtn).not.toHaveAttribute("disabled"));
  await userEvent.click(enterBtn);

  const msg = await screen.findByTestId("game-message");
  expect(msg).toHaveTextContent(/not a valid word/i);
});

test("Submitting valid guess updates board", async () => {
  renderAppWithTheme();
  
  const validWord = "APPLE";
  for (const letter of validWord) {
    await userEvent.click(screen.getByTestId(`keyboard-key-${letter.toLowerCase()}`));
  }
  
  const enterBtn = screen.getByTestId("keyboard-key-enter");
  await waitFor(() => expect(enterBtn).not.toHaveAttribute("disabled"));
  await userEvent.click(enterBtn);

  await waitFor(() => {
    for (let col = 0; col < validWord.length; col++) {
      expect(screen.getByTestId(`cell-0-${col}`)).toHaveTextContent(validWord[col]);
    }
  });
});

test("New Game button resets the board", async () => {
  renderAppWithTheme();
  
  const validWord = "APPLE";
  for (const letter of validWord) {
    await userEvent.click(screen.getByTestId(`keyboard-key-${letter.toLowerCase()}`));
  }
  
  await userEvent.click(screen.getByTestId("keyboard-key-enter"));
  await userEvent.click(screen.getByTestId("new-game-button"));
  
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < validWord.length; col++) {
      expect(screen.getByTestId(`cell-${row}-${col}`)).toHaveTextContent("");
    }
  }
});

test("Game statistics display is present", () => {
  renderAppWithTheme();
  expect(screen.getByTestId("game-stats")).toBeInTheDocument();
});

test("Instructions dialog opens and closes", async () => {
  renderAppWithTheme();
  
  const instructionsButton = screen.getByTestId("instructions-button");
  await userEvent.click(instructionsButton);
  
  const dialog = await screen.findByTestId("instructions-dialog");
  expect(dialog).toBeInTheDocument();
  
  const closeButton = screen.getByTestId("close-instructions-button");
  await userEvent.click(closeButton);
  
  await waitFor(() => {
    expect(screen.queryByTestId("instructions-dialog")).not.toBeInTheDocument();
  });
});

test("Used letters display is present", () => {
  renderAppWithTheme();
  expect(screen.getByTestId("used-letters-title")).toBeInTheDocument();
  expect(screen.getByTestId("used-letters")).toBeInTheDocument();
});
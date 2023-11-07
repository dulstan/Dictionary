import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CreateDictionary from "./CreateDictionary";
import React from "react";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  window.localStorage.clear();
});

//testfall om hantering av api sökning
describe("Create Dictionary", async () => {
  const handleSearch = async () => {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/word`
    );
    const data = response.json();
    return data;
  };
  // testar api resultat
  it("fetches and processes API data", async () => {
    const result = await handleSearch();
    expect(result[0].word).toBe("word");
  });
});

describe("Create Dictionary", () => {
  it("searches for a word", async () => {
    const { getByText, getByPlaceholderText } = render(<CreateDictionary />);

    const searchInput = getByPlaceholderText("Sök efter ett ord");
    const searchButton = getByText("Search");

    // Simulera att användaren skriver ett ord och klickar på "Search"
    fireEvent.change(searchInput, { target: { value: "word" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      // Kontrollera om data är korrekt synlig
      const wordData = screen.getByTestId("word");
      const phoneticText = screen.getByTestId("phonetic");

      expect(wordData).toBeInTheDocument();
      expect(phoneticText).toBeInTheDocument();
    });
  });

  it("adds a word to favorites", async () => {
    render(<CreateDictionary />);

    const addToFavoritesButton = screen.getByText("Add to favorites");

    userEvent.click(addToFavoritesButton);
    const addedWordText = screen.getByText("Add to favorites");

    expect(addedWordText).toBeInTheDocument();
  });
});

describe("Create Dictionary Button Tests", () => {
  it("search button should trigger search", async () => {
    const { getByText, getByPlaceholderText } = render(<CreateDictionary />);
    const searchButton = getByText("Search");

    const searchInput = getByPlaceholderText("Sök efter ett ord");

    fireEvent.change(searchInput, { target: { value: "apple" } });
    userEvent.click(searchButton);

    await waitFor(() => {
      const wordData = screen.getAllByText("apple"); 
      const phoneticText = screen.getAllByText("/ˈæp.əl/"); 

      // Kontrollera om det förväntade resultatet finns i komponenten
      expect(wordData).toBeTruthy();
      expect(phoneticText).toBeTruthy();
    });
  });
  it("add to favorites button should trigger add To Favorites", async () => {
    const favoriteWord = "apple";
    const favoriteData = {
      word: "apple",
      phonetics: [{ text: "/ˈæpl/", audio: "audio-url" }],
      meanings: [
        {
          partOfSpeech: "noun",
          definitions: [
            {
              definition:
                "A round fruit with red, green, or yellow skin and a crisp white flesh.",
              example: "I had an apple for breakfast.",
              synonyms: ["fruit"],
              antonyms: ["banana"],
            },
          ],
        },
      ],
    };

    localStorage.setItem(favoriteWord, JSON.stringify(favoriteData));

    render(<CreateDictionary />);

    // Hitta "Add to favorites" -knappen i CreateDictionary
    const addToFavoritesButton = screen.getByText("Add to favorites");

    // användaren klickar på "Add to favorites"
    fireEvent.click(addToFavoritesButton);

    //  kontrollera om ordet "apple" faktiskt lades till i favoritlistan i localStorage
    const savedFavorite = localStorage.getItem(favoriteWord) ?? ""; 
    // Kontrollera att det sparade favoritordet finns i localStorage
    expect(JSON.parse(savedFavorite)).toEqual(favoriteData);

    // Rensa localStorage efter testet
    localStorage.removeItem(favoriteWord);
  });

  it("show favorites button should toggle show Favorites", async () => {
    render(<CreateDictionary />);

    // Hitta "Show favorites" -knappen och klicka på den
    const showFavoritesButton = screen.getByText(/Show favorites/i);
    fireEvent.click(showFavoritesButton);

    expect(screen.getByText(/Favoritord/i)).toBeInTheDocument(); 

    // Hitta "Hide favorites" -knappen och klicka på den
    const hideFavoritesButton = screen.getByText(/Hide favorites/i);
    fireEvent.click(hideFavoritesButton);

    expect(screen.queryByText(/Favoritord/i)).toBeNull();
  });
});

describe("Create Dictionary Error Handling Tests", () => {
  it("should display an error message for empty search", async () => {
    render(<CreateDictionary />);
    const searchButton = screen.getByText("Search");

    // användaren klickar på "Search" utan att ange ett sökord
    fireEvent.click(searchButton);

    // Här kan du kontrollera om ett felmeddelande för tom sökning visas
    const errorMessage = screen.getByText("Please, write a word to search!");
    expect(errorMessage).toBeTruthy();
  });

  it("should display an error message for a word not found in the dictionary", async () => {
    render(<CreateDictionary />);
    const searchInput = screen.getByPlaceholderText("Sök efter ett ord");
    const searchButton = screen.getByText("Search");

    // användaren skriver ett ord som inte finns i ordboken och klickar på "Search"
    fireEvent.change(searchInput, { target: { value: "xyzabc" } });
    fireEvent.click(searchButton);

    // Vänta på att API-anropet ska slutföras och felmeddelandet visas
    await waitFor(() => {
      const errorMessage = screen.getByText(
        "We cannot find this word in the dictionary"
      );
      expect(errorMessage).toBeTruthy();
    });
  });
});

//----------------
it("add to favorites", async () => {
  render(<CreateDictionary />);
  // Skriv ett ord i sökfältet
  const searchInput = screen.getByPlaceholderText("Sök efter ett ord");
  userEvent.type(searchInput, "apple");

  // Klicka på "Search" knappen
  const searchButton = screen.getByText("Search");
  userEvent.click(searchButton);

  // Klicka på "Add to favorites" knappen
  const addToFavoritesButton = screen.getByText("Add to favorites");
  userEvent.click(addToFavoritesButton);
});

it("should remove a word from favorites and update localStorage", async () => {
  const wordToRemove = "door";

  // Lägg till ordet i favoriter och spara det i localStorage
  localStorage.setItem("favorites", JSON.stringify([wordToRemove]));

  render(<CreateDictionary />);
  const showFavoritesButton = screen.getByText("Show favorites");
  fireEvent.click(showFavoritesButton);

  // Kontrollera att ordet finns i favoriter
  const favoriteWord = await screen.findByText(wordToRemove);
  expect(favoriteWord).toBeTruthy();

  const removeFromFavoritesButton = screen.getByText("Ta bort");

  fireEvent.click(removeFromFavoritesButton);

  // Kontrollera att ordet tas bort från localStorage
  const localStorageData = localStorage.getItem("favorites");
  expect(localStorageData).not.toContain(wordToRemove);
});

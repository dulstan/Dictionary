import React from "react";
import { render, screen } from "@testing-library/react";
import FavoriteWords from "./FavoriteWords";
import { describe, it } from "vitest";

// testfall fom kompnenten renderar en lista med favorit ord
describe("FavoriteWords", () => {
  it("renders a list of favorite words", () => {
    const favorites = ["door", "hello", "pen"];
    // Skapar tomma funktioner för att testa funktioner för att ta bort och visa information om favoritord
    const removeFromFavorites = () => {};
    const showFavoritesInfo = () => {};

    // renderar kompnenten med de propsen
    render(
      <FavoriteWords
        favorites={favorites}
        removeFromFavorites={removeFromFavorites}
        showFavoritesInfo={showFavoritesInfo}
      />
    );
      // testar att komponenten renderar favoritorden som förväntas
    for (const favorite of favorites) {
      const element = screen.queryByText(favorite);
      expect(element).not.toBeNull();// vi använder expect här för att kontrollera att elementen inte är null för att säkerställa att texten kan hittas i DOM
    }
  });
});

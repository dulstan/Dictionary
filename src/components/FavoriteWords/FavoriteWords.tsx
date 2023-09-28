import React from "react";
import "./FavoriteWords.css";
import { FavoriteWordsProps } from "../../modules/interfaces";
//function som visar listan med favoritordet och andra funktioner som tex ta bort ett ord och visa info.
function FavoriteWords({
  favorites,
  removeFromFavorites,
  showFavoritesInfo,
}: FavoriteWordsProps) {
  
  return (
    <div className="favoriteWords-container">
      <h2>Favoritord</h2>
      <ul>
        {/* Mappar över favoritorden och skapar listeelement för varje ord */}
        {favorites.map((favorite) => (
          <li key={favorite}>
            <p className="favorite-word">{favorite}</p>
            <button onClick={() => showFavoritesInfo(favorite)}>info</button>
            <button onClick={() => removeFromFavorites(favorite)}>
              Ta bort
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoriteWords;

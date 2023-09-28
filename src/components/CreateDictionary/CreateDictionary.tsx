import React, { useState, useEffect } from "react";
import {
  Phonetic,
  Definition,
  Meaning,
  DictionaryData,
} from "../../modules/interfaces";
import "./CreateDictionary.css";
import FavoriteWords from "../FavoriteWords/FavoriteWords";

//url för ett api anrop
const API_BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function CreateDictionary() {
  // state som ska avnändas 
  const [word, setWord] = useState<string>(""); //sökordet
  const [data, setData] = useState<DictionaryData | null>(null); //api-data 
  const [error, setError] = useState<string | null>(null);//felmeddelande

  const [favorites, setFavorites] = useState<string[]>([]); //användarens favorit ord
  const [showFavorites, setShowFavorites] = useState(false);//visa/dölja favorite ordet
  const [audioKey, setAudioKey] = useState<number>(0); // uppdatera ljudet för varje ord man söker 

  //useEffect för att ladda favorit ordet från localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  // useEffect för att spara favorit ordet till localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  // hantera sökning funktionen
  const handleSearch = async () => {
    // öka key för att uppdatera ljudet 
    setAudioKey((prevKey) => prevKey + 1);

    if (!word) {
      setError("Please, write a word to search!");
      setData(null);
      return;
    }
    // data hämtning
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}${word}`);
      const data = await response.json();

      if (data) {
        setData(data);
        setError(null);
      } else {
        setData(null);
        setError("We cannot find this word in the dictionary");
      }
    } 
    catch (error) {
      console.error("Error", error);
      setData(null);
      setError("Error");
    }
  };
  // lägga till ett ord till favorite lista funktionen
  const addToFavorites = async () => {
    if (data && data[0]?.word) {
      const wordToAdd = data[0]?.word;
      if (!favorites.includes(wordToAdd)) {
        setFavorites([...favorites, wordToAdd]);

        const apiResponse = await fetch(`${API_BASE_URL}${wordToAdd}`);
        const apiData = await apiResponse.json();
        localStorage.setItem(wordToAdd, JSON.stringify(apiData));
      }
    }
  };
  // ta bort ett ord från favoritelistan funktioen
  const removeFromFavorites = (wordToRemove: string) => {
    const updatedFavorites = favorites.filter((word) => word !== wordToRemove);
    setFavorites(updatedFavorites);
  };
  // visa favoritordet info som hämtas från apiet
  const showFavoritesInfo = async (wordToshow: string) => {
    const savedData = localStorage.getItem(wordToshow);
    if (savedData) {
      const apiData = JSON.parse(savedData);
      setData(apiData);
    }
  };
  return (
    <main className="main-container">
      {/* Sökinput */}
      <input
        type="text"
        placeholder="Sök efter ett ord"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      {/* Visa felmeddelande om det finns ett fel */}
      {error && <div className="error-message">{error}</div>}
      {/* knappar */}
      <button onClick={handleSearch}>Search</button>
      <button onClick={addToFavorites}>Add to favorites</button>
      <button onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? "Hide favorites" : "Show favorites"}
      </button>

      {/* Visa favoritord */}
      {showFavorites && (
        <FavoriteWords
          favorites={favorites}
          removeFromFavorites={removeFromFavorites}
          showFavoritesInfo={showFavoritesInfo}
        />
      )}
      

      {/* Visa data */}
      {data && (
        <article className="definition">
          <h2>The Word: {data[0]?.word}</h2>
          {data[0]?.phonetics && (
            <section>
              {/* Rubrik för fonetik */}
              <h3>phonetic:</h3>
              <ul>
                {data[0]?.phonetics.map((phonetic: Phonetic, index: number) => (
                  <li key={index}>{phonetic.text}</li>
                ))}
              </ul>
              {data[0]?.phonetics.map((phonetic: Phonetic, index: number) => (
                <ul key={index}>
                  {phonetic.audio && (
                    //ljud spelaren
                    <audio key={audioKey} controls>
                      <source src={phonetic.audio} type="audio/mpeg" />
                    </audio>
                  )}
                </ul>
              ))}
              <ul></ul>
            </section>
          )}
          {/* Rubrik för meanings */}
          <h3>Meanings:</h3>
          {data[0]?.meanings &&
            data[0]?.meanings.map((meaning: Meaning, index: number) => (
              <section key={index}>
                <h4>
                  <div className="part-of-speech">{meaning.partOfSpeech}</div>
                </h4>
                <ul>
                  {meaning.definitions.map(
                    (definition: Definition, index: number) => (
                      <li key={index}>
                        <span>Definition:</span> {definition.definition}
                        {/* Visa exempel om det finns */}
                        {definition.example && (
                          <p>
                            <span>Exempel:</span> {definition.example}
                          </p>
                        )}
                        {/* Visa synonymer om det finns */}
                        {definition.synonyms && (
                          <p>
                            <span>synonyms:</span>{" "}
                            {definition.synonyms.join(", ")}
                          </p>
                        )}
                        {/* Visa antomyer om det finns */}
                        {definition.antonyms && (
                          <p>
                            <span>antonyms:</span>{" "}
                            {definition.antonyms.join(", ")}
                          </p>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </section>
            ))}
        </article>
      )}
    </main>
  );
}

export default CreateDictionary;

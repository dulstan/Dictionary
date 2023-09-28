import { describe, it, expect } from "vitest";

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
    // test att första ordet i apiet är Word
    expect(result[0].word).toBe("word");
  });
});

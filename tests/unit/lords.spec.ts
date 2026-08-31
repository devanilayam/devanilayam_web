import { describe, expect, it } from "vitest";
import { toUniqueLords } from "../../app/utils/lords";

describe("toUniqueLords", () => {

   it("returns one entry per deity when a deity has several documents", () => {

      const lords = toUniqueLords([
         { lord_id: "ganesh", lord: "Ganesh" },
         { lord_id: "ganesh", lord: "Ganesh" },
         { lord_id: "ganesh", lord: "Ganesh" },
         { lord_id: "shiva", lord: "Shiva" },
      ]);

      expect(lords).toEqual([
         { lord_id: "ganesh", name: "Ganesh" },
         { lord_id: "shiva", name: "Shiva" },
      ]);

   });

   it("keeps the order the documents came back in", () => {

      const lords = toUniqueLords([
         { lord_id: "shiva", lord: "Shiva" },
         { lord_id: "ganesh", lord: "Ganesh" },
         { lord_id: "shiva", lord: "Shiva" },
      ]);

      expect(lords.map(lord => lord.lord_id)).toEqual(["shiva", "ganesh"]);

   });

   it("maps the document's lord onto the card's display name", () => {

      expect(toUniqueLords([{ lord_id: "surya", lord: "సూర్య" }])).toEqual([
         { lord_id: "surya", name: "సూర్య" },
      ]);

   });

   it("returns an empty list when the query came back with nothing", () => {

      expect(toUniqueLords([])).toEqual([]);
      expect(toUniqueLords(undefined)).toEqual([]);

   });

});

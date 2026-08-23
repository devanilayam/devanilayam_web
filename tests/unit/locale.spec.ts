import { describe, expect, it } from "vitest";
import { Locale } from "../../app/types/locale";

describe("Locale", () => {

   it("exposes the three shipped locales in display order", () => {

      expect(Locale.ALL.map(locale => locale.code)).toEqual(["en", "te", "hi"]);

   });

   it("derives the translation file name from the code when none is given", () => {

      expect(Locale.English.file).toBe("en.json");

   });

   it("resolves a locale by its code", () => {

      expect(Locale.getByCode("te")?.nameInLocale).toBe("తెలుగు");

   });

   it("returns undefined for a locale that is not shipped", () => {

      expect(Locale.getByCode("fr")).toBeUndefined();

   });

});

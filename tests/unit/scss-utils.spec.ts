import { describe, expect, it } from "vitest";
import { ScssUtils } from "../../app/utils/design/functions";

describe("ScssUtils.pixelToRem", () => {

   it("converts pixels against the default 16px context", () => {

      expect(ScssUtils.pixelToRem(24)).toBe("1.5rem");

   });

   it("honours a custom context", () => {

      expect(ScssUtils.pixelToRem(24, 12)).toBe("2rem");

   });

});

describe("ScssUtils.numericScale", () => {

   it("scales an even integer to rem", () => {

      expect(ScssUtils.numericScale(48)).toBe("3rem");

   });

   it("rejects odd values", () => {

      expect(() => ScssUtils.numericScale(3)).toThrow("Numeric scale must be an even number");

   });

});

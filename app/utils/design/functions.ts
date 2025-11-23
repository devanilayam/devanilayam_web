/**
 * Utility functions that mirror core SCSS functions.
 * NOTE: Any changes here should be reflected in the SCSS functions as well.
 */
export class ScssUtils {

   /**
    * Converts an even integer value to rem units.
    * Mirrors the SCSS function `numeric-scale`.
    * @param value - The value to convert (must be an even, non-decimal number).
    * @returns The value in rem units as a string.
    * @throws Error if the value is not an even integer.
    */
   static numericScale(value: number): string {

      if (value % 2 !== 0) {

         throw new Error("Numeric scale must be an even number");

      }

      if (typeof value !== "number") {

         throw new Error("Numeric scale must be a number");

      }

      if (!Number.isInteger(value)) {

         throw new Error("Numeric scale must be an integer (no decimals allowed)");

      }

      return `${value / 16}rem`;

   }

   /**
     * Converts pixel value to rem unit.
     *
     * @param {number} pixel - The pixel value to convert.
     * @param {number} [context=16] - The base context value for the conversion. Default is 16.
     * @returns {string} The converted value in rem unit.
     */
   static pixelToRem = (pixel: number, context: number = 16): string => pixel / context + "rem";

}

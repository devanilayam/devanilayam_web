import type { LocaleFile, LocaleObject } from "@nuxtjs/i18n";

export class Locale implements LocaleObject<string> {

   // NOTE: This k key is from nuxtjs/i18n. So don't change this until the parent changes.
   [k: string]: string | unknown;
   code: string;
   name?: string;
   language?: string;
   file?: string | LocaleFile | undefined;

   // Custom properties.
   nameInLocale?: string;

   constructor(options: LocaleObject<string>, nameInLocale?: string) {

      this.code = options.code;
      this.name = options.name;
      this.language = options.language;
      this.file = options.file ?? (this.code + ".json");
      this.nameInLocale = nameInLocale;

   }

   static English = new Locale({ code: "en", name: "English", language: "en-US" }, "English");

   static Telugu = new Locale({ code: "te", name: "Telugu", language: "te-IN" }, "తెలుగు");

   static readonly ALL = [
      this.English,
      this.Telugu,
   ];

   static getByCode = (code: string): Locale | undefined => this.ALL.find(locale => locale.code === code);

}

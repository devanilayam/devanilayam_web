import type { IconsId } from "../assets/generated/fonts/icons";

export const WHATSAPP_CHANNEL_LINK = "https://whatsapp.com/channel/0029Vb789KA7T8ba7wktZC1I";

export interface HomePageFeature {
   icon: IconsId;
   titleKey: string;
   descriptionKey: string;
}

export const HOME_PAGE_FEATURES: HomePageFeature[] = [
   {
      icon: "star-01",
      titleKey: "home.features.list.adFree.title",
      descriptionKey: "home.features.list.adFree.description"
   },
   {
      icon: "book-open-01",
      titleKey: "home.features.list.multiScript.title",
      descriptionKey: "home.features.list.multiScript.description"
   },
   {
      icon: "music-note-01",
      titleKey: "home.features.list.audioPlayback.title",
      descriptionKey: "home.features.list.audioPlayback.description"
   },
];

export interface SocialTile {
   icon: IconsId;
   label: string;
   link: string;
}

export const HOME_PAGE_SOCIAL_LINKS: SocialTile[] = [
   {
      icon: "facebook",
      label: "Facebook",
      link: "https://www.facebook.com/devanilayam"
   },
   {
      icon: "instagram",
      label: "Instagram",
      link: "https://www.instagram.com/devanilayam"
   },
   {
      icon: "youtube",
      label: "YouTube",
      link: "https://www.youtube.com/@devanilayam"
   },
   {
      icon: "x-twitter",
      label: "Twitter",
      link: "https://twitter.com/devanilayam"
   }
];

export interface MantraCard {
   name: string;
   id: string;
   imgPath: string;
}

export const HOME_PAGE_SLOKAS: MantraCard[] = [
   {
      name: "Shiva",
      id: "shiva",
      imgPath: "/images/slokas/shiva.png"
   },
   {
      name: "Hanuman",
      id: "hanuman",
      imgPath: "/images/slokas/hanuman.png"
   },
   {
      name: "Rama",
      id: "rama",
      imgPath: "/images/slokas/rama.png"
   }
];

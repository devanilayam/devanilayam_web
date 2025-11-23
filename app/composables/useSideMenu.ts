export const useSideMenu = (): {
   isOpen: Readonly<Ref<boolean>>;
   open: () => void;
   close: () => void;
   toggle: () => void;
} => {

   const isOpen = useState<boolean>("side-menu-open", () => false);

   const open = (): void => {

      isOpen.value = true;

   };

   const close = (): void => {

      isOpen.value = false;

   };

   const toggle = (): void => {

      isOpen.value = !isOpen.value;

   };

   return {
      isOpen: readonly(isOpen),
      open,
      close,
      toggle,
   };

};

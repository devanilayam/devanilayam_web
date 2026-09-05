import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import MyDialog from "../../app/components/MyDialog/index.vue";

const mountDialog = async (): Promise<Awaited<ReturnType<typeof mountSuspended>>> => await mountSuspended(MyDialog, {
   props: { open: false, closeLabel: "Close" },
   slots: { default: () => "Ganesh Chaturthi" },
});

const pageOverflow = (): string => document.documentElement.style.overflow;

describe("MyDialog", () => {

   it("opens as a modal and freezes the page behind it", async () => {

      const wrapper = await mountDialog();

      expect(pageOverflow()).toBe("");

      await wrapper.setProps({ open: true });

      expect(wrapper.find("dialog").element.open).toBe(true);
      expect(pageOverflow()).toBe("hidden");

      await wrapper.setProps({ open: false });

      expect(pageOverflow()).toBe("");

   });

   // Esc and the browser's own dismissal never touch the `open` prop, so the
   // page has to be released off the dialog's native `close` event.
   it("releases the page when the browser closes the dialog itself", async () => {

      const wrapper = await mountDialog();

      await wrapper.setProps({ open: true });

      expect(pageOverflow()).toBe("hidden");

      wrapper.find("dialog").element.close();

      await nextTick();

      expect(pageOverflow()).toBe("");
      expect(wrapper.emitted("close")).toBeTruthy();

   });

   it("leaves the page scrollable when it is unmounted while open", async () => {

      const wrapper = await mountDialog();

      await wrapper.setProps({ open: true });

      wrapper.unmount();

      expect(pageOverflow()).toBe("");

   });

});

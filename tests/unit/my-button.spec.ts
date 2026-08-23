import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import MyButton from "../../app/components/MyButton/index.vue";

describe("MyButton", () => {

   it("renders its default slot", async () => {

      const wrapper = await mountSuspended(MyButton, {
         slots: { default: () => "Read sloka" },
      });

      expect(wrapper.text()).toContain("Read sloka");

   });

   it("falls back to the default label with no slot content", async () => {

      const wrapper = await mountSuspended(MyButton);

      expect(wrapper.text()).toContain("Button Text");

   });

   it("maps the variant prop onto a modifier class", async () => {

      const wrapper = await mountSuspended(MyButton, { props: { variant: "outlined" } });

      expect(wrapper.classes()).toContain("my-button--outlined");

   });

});

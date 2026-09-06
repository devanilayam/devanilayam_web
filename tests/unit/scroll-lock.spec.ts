import { describe, expect, it } from "vitest";
import { effectScope } from "vue";
import { useScrollLock } from "../../app/composables/useScrollLock";

/** Runs `body` inside a scope, then disposes it — as unmounting a dialog would. */
const inScope = <T>(body: () => T): { result: T; dispose: () => void } => {

   const scope = effectScope();

   const result = scope.run(body) as T;

   return { result, dispose: (): void => scope.stop() };

};

const pageOverflow = (): string => document.documentElement.style.overflow;

describe("useScrollLock", () => {

   it("freezes the page while locked and releases it again", () => {

      const { result: dialog, dispose } = inScope(() => useScrollLock());

      expect(pageOverflow()).toBe("");

      dialog.lock();

      expect(pageOverflow()).toBe("hidden");

      dialog.unlock();

      expect(pageOverflow()).toBe("");

      dispose();

   });

   it("counts one lock per caller, however often it asks", () => {

      const { result: dialog, dispose } = inScope(() => useScrollLock());

      dialog.lock();
      dialog.lock();

      dialog.unlock();

      expect(pageOverflow()).toBe("");

      dispose();

   });

   it("keeps the page frozen until the last overlay closes", () => {

      const first = inScope(() => useScrollLock());

      const second = inScope(() => useScrollLock());

      first.result.lock();
      second.result.lock();

      first.result.unlock();

      expect(pageOverflow()).toBe("hidden");

      second.result.unlock();

      expect(pageOverflow()).toBe("");

      first.dispose();
      second.dispose();

   });

   it("releases the page when an overlay is torn down while still open", () => {

      const { result: dialog, dispose } = inScope(() => useScrollLock());

      dialog.lock();

      expect(pageOverflow()).toBe("hidden");

      dispose();

      expect(pageOverflow()).toBe("");

   });

   it("ignores an unlock from a caller that never locked", () => {

      const holder = inScope(() => useScrollLock());

      const bystander = inScope(() => useScrollLock());

      holder.result.lock();

      bystander.result.unlock();

      expect(pageOverflow()).toBe("hidden");

      holder.result.unlock();

      expect(pageOverflow()).toBe("");

      holder.dispose();
      bystander.dispose();

   });

});

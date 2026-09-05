/**
 * Freezes the page behind an open overlay.
 *
 * A modal `<dialog>` makes everything behind it inert, but a scroll gesture
 * that starts on the backdrop still runs the document underneath: the reader
 * flicks at a card they cannot reach and the page slides away behind the
 * dialog. Hiding the document's overflow for as long as an overlay is open is
 * what stops that. The overlay is in the top layer with a scroll container of
 * its own, so a dialog too tall for the viewport still scrolls inside itself.
 *
 * `scrollbar-gutter: stable` on `<html>` (base/_global.scss) is the other half
 * of this: without a reserved gutter, hiding the overflow also removes the
 * scrollbar, widening the viewport and sliding every centred element — the
 * fixed header included — sideways as the dialog opens.
 */

// There is one document and one scrollbar, so the lock is reference counted:
// with a plain boolean, one overlay closing while another is still open would
// hand the page back early.
let holders = 0;

const setPageScrollable = (scrollable: boolean): void => {

   document.documentElement.style.overflow = scrollable ? "" : "hidden";

};

export const useScrollLock = (): { lock: () => void; unlock: () => void } => {

   // Whether THIS caller currently holds the lock. Without it a repeated lock()
   // — or an unlock() from a caller that never locked — would unbalance the
   // shared count and leave the page frozen for good.
   let held = false;

   const lock = (): void => {

      if (held || typeof document === "undefined") {

         return;

      }

      held = true;

      holders += 1;

      if (holders === 1) {

         setPageScrollable(false);

      }

   };

   const unlock = (): void => {

      if (!held) {

         return;

      }

      held = false;

      holders -= 1;

      if (holders === 0) {

         setPageScrollable(true);

      }

   };

   // An overlay can be torn down while it is still open — a route change with
   // the dialog up, say. Without this the next page would load frozen.
   onScopeDispose(unlock, true);

   return { lock, unlock };

};

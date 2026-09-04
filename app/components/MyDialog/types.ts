export interface MyDialogProps {
   /** Whether the dialog is showing. Drives `showModal()` / `close()`. */
   open: boolean;
   /** Accessible label for the close button. */
   closeLabel: string;
}

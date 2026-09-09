import { useEffect, useRef, type RefObject } from "react";

let locks = 0;
let savedOverflow = "";

export function useDialog(ref: RefObject<HTMLDialogElement | null>, open: boolean, onClose: () => void) {
  const latestClose = useRef(onClose);
  latestClose.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (locks++ === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    try { dialog.showModal(); } catch { dialog.setAttribute("open", ""); }
    const first = dialog.querySelector<HTMLElement>("[data-initial-focus]") ??
      dialog.querySelector<HTMLElement>("input, button, a[href]");
    first?.focus({ preventScroll: true });

    const onCancel = (event: Event) => { event.preventDefault(); latestClose.current(); };
    const onNativeClose = () => latestClose.current();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); latestClose.current(); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex='0']",
      )).filter((element) => element.getClientRects().length);
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      if (!firstElement) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === firstElement) { event.preventDefault(); lastElement.focus(); }
      if (!event.shiftKey && document.activeElement === lastElement) { event.preventDefault(); firstElement.focus(); }
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onNativeClose);
    dialog.addEventListener("keydown", onKey);

    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onNativeClose);
      dialog.removeEventListener("keydown", onKey);
      try { if (dialog.open && typeof dialog.close === "function") dialog.close(); }
      finally {
        dialog.removeAttribute("open");
        if (--locks === 0) document.body.style.overflow = savedOverflow;
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      }
    };
  }, [ref, open]);
}
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import crossIcon from "../assets/register/icon-cross.svg";
import closeIcon from "../assets/register/icon-x-close.svg";

type ModalProps = {
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
};

const DISMISS_DRAG_PX = 100;
const DISMISS_VELOCITY = 0.11; // px/ms — a quick flick dismisses even if short
const EXIT_MS_SHEET = 280;
const EXIT_MS_MODAL = 180;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Tablet+: Figma "Modal" (800×560, 24px radius, close top-right).
// Mobile: bottom sheet (content height, 20px top radius, up to 68px below the
// top of the screen). Children render inside the scrollable main area.
export default function Modal({ labelledBy, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Exit animation: flag the dialog, then tell the parent once it has played.
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const close = () => {
    if (closing || closeTimer.current !== undefined) return;
    setClosing(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sheet = window.matchMedia("(max-width: 767px)").matches;
    closeTimer.current = window.setTimeout(
      () => onCloseRef.current(),
      reduced ? 0 : sheet ? EXIT_MS_SHEET : EXIT_MS_MODAL,
    );
  };
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Freeze page scroll (Lenis + native) while open; restore focus on close.
  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  // Captured during render: autoFocus inside the modal fires before effects run.
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  useEffect(() => () => opener?.focus(), [opener]);

  // On document so Escape works even if focus is still outside the dialog.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Make sure focus lands inside the dialog if nothing in it claimed focus.
  useEffect(() => {
    if (!dialogRef.current?.contains(document.activeElement)) {
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Mobile bottom sheet: drag the top strip down to dismiss.
  const [dragY, setDragY] = useState<number | null>(null);
  const dragStart = useRef<number | null>(null);
  const lastMove = useRef({ y: 0, t: 0, velocity: 0 });

  const onDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    if ((event.target as Element).closest("button")) return;
    dragStart.current = event.clientY;
    lastMove.current = { y: event.clientY, t: event.timeStamp, velocity: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragY(0);
  };
  const onDragMove = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dt = event.timeStamp - lastMove.current.t;
    if (dt > 0) {
      const velocity = (event.clientY - lastMove.current.y) / dt;
      lastMove.current = { y: event.clientY, t: event.timeStamp, velocity };
    }
    setDragY(Math.max(0, event.clientY - dragStart.current));
  };
  const onDragEnd = () => {
    if (dragStart.current === null) return;
    dragStart.current = null;
    const distance = dragY ?? 0;
    const flicked = lastMove.current.velocity > DISMISS_VELOCITY && distance > 10;
    // Releasing the inline transform lets the exit/snap-back transition run
    // from the current drag position.
    setDragY(null);
    if (distance > DISMISS_DRAG_PX || flicked) close();
  };

  return createPortal(
    <div
      data-closing={closing}
      className="video-modal-scrim fixed inset-0 z-[60] flex items-end justify-center bg-black/50 md:items-center md:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        data-closing={closing}
        onKeyDown={handleKeyDown}
        style={dragY === null ? undefined : { transform: `translateY(${dragY}px)`, transition: "none" }}
        className="register-dialog flex max-h-[calc(100dvh-68px)] w-full flex-col overflow-hidden rounded-t-[20px] bg-background-primary md:h-[560px] md:max-h-full md:max-w-[800px] md:rounded-3xl"
      >
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="flex shrink-0 touch-none items-start justify-end px-5 pt-5 md:touch-auto md:px-6 md:pt-6"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="flex items-center justify-center rounded-full transition-colors hover:bg-background-alternative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red md:p-2"
          >
            <img src={crossIcon} alt="" className="size-6 md:hidden" />
            <img src={closeIcon} alt="" className="hidden size-6 md:block" />
          </button>
        </div>
        {/* data-lenis-prevent keeps wheel scrolling native inside the modal. */}
        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-y-auto px-5 pt-5 pb-[34px] md:p-6"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

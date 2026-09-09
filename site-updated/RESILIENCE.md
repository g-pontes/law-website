# Rendering and Media

## Progressive Enhancement

The React markup for headings, text and image frames is visible by default.
`LinesReveal`, `Rise` and `RevealImage` use native, finite Web Animations only
after viewport entry. There are no initial inline hidden styles. Cancellation,
unsupported APIs, failed observers and a bounded watchdog all preserve or
restore the underlying visible content. Masks do not crop glyphs at rest.

GSAP and ScrollTrigger are optional dynamic imports managed by `useGsap` in
`src/lib/motion.ts`. Every context has teardown, including partial setup failures.
They enhance camera movement and scroll effects, not document visibility.

Lenis is independently optional, desktop-only and stopped while a dialog is
open. A failed import, initialization or animation frame leaves native scrolling
available. Header contrast and real anchor links do not depend on ScrollTrigger.

The intro has a CSS exit, a 1900 ms completion timer and a separate 2300 ms
deadline in the app. It never locks body scrolling. Wheel, touch, keyboard and
the skip button dismiss it. Menu and contact use native dialogs, with Escape,
focus containment, focus restoration and balanced body-scroll cleanup.

The method descriptions always remain in document flow. The horizontal gallery
is enabled only after ScrollTrigger setup succeeds. Its positioning uses native
sticky layout, with a native scrollbar and an explicit list view. Mobile,
short viewports, reduced motion and failed setup use the editorial vertical list.

## Images and Fonts

All photographs pass through `src/components/EditorialImage.tsx`:

- Explicit dimensions and frame ratios reserve space.
- Responsive sources are used for photographs, not for the fallback.
- Failed local copies try their original source once.
- A failed or stalled original uses the bundled `src/assets/image-unavailable.svg`.
- A failure of that bundled fallback uses an accessible HTML state without another request.
- The loading timeout starts near the viewport for lazy images.
- Image source changes reset the fallback chain; there are no retry loops.

The fallback is a branded unavailability graphic, not a replacement photograph.
The original stock photographs are still external until the localization utility
is run. No claim is made that the original photographs have already been copied.
Instrument Serif and Inter are installed through Fontsource and included in the
build, so typography no longer needs Google Fonts.

## Localizing Original Photographs

With Node.js 20+ and a working network, run `node scripts/localize-images.mjs`.
The script reads `src/lib/image-catalogue.json`, downloads two responsive sizes,
validates HTTP responses and image signatures, and saves the assets to
`public/images/`. It prefers WebP and preserves the actual returned format.

It then updates `src/lib/local-images.json` atomically. `src/lib/images.ts`
automatically selects these local paths on the next build. Previously valid
files are retained if a replacement fails. Use `--refresh` to redownload.
Any failed image produces an explicit nonzero exit code; review those sources.

Rebuild after localization and ship the entire `dist/` directory, including its
images folder. Committing both `public/images/` and `local-images.json` makes the
photographs available in exported project ZIPs. Confirm photo licensing and the
actual subject/location before a production publication.

## Verification Checklist

These are browser verification steps, not a record of tests already executed.

1. Load `/?motion=off`. Every heading, method description, project and photograph
   frame must be visible without any motion engine.
2. Block `images.pexels.com` before loading. Frames must retain their geometry and
   show the local unavailability graphic, never an empty frame or broken icon.
3. Stall image requests. Near-viewport originals must fall back within 8 seconds.
4. Make `Element.prototype.animate` throw before loading. All content, navigation,
   menu and contact must still work.
5. Disable `IntersectionObserver`. Text remains visible; image failures still
   recover; the method remains a complete list.
6. Cancel active Web Animations in DevTools. No heading should retain hidden
   opacity, translation or a mask afterward.
7. Open/close the menu and form repeatedly with keyboard and Escape. Background
   scrolling must resume and focus must return to the opener.
8. Enable reduced motion live, including while inside the gallery. Verify that
   the gallery becomes vertical and all three projects remain available.
9. Test at 360, 768, 1024 and 1440 px, at 200% zoom, and with a short viewport.
   Check Portuguese accents, italic overhangs, navigation and native form scroll.
10. Load `/#sobre` and `/#insights`, refresh and navigate back. No loader should
    reset a deep link to the top of the document.
11. After localization, block Pexels again. Original photographs should still
    load from the local images folder. Then remove one local file to test recovery.

## Production Content

This is still a demonstration of a fictitious identity. There is no real OAB
registration, professional biography, testimonial or case history to substitute.
Do not remove the illustrative notices without verified replacement content.
The example telephone number and invented email address have been removed.
The form validates fields and demonstrates feedback, but does not transmit or
store submissions. A real contact channel and submission backend must be
configured before presenting it as a production intake service.
# Trainings-Tracker interface contract

## 1. Identity
Personal gym log for an iPhone, in German. Quiet graphite surfaces, a fresh lime action accent, large tabular numbers, clear vertical set rows. One exercise occupies one reusable card. No decorative imagery or external font requests. Inspiration: native iOS grouped lists and bottom navigation (Apple reference); original app supplies the exercise/history model, not the new visual composition.

## 2. Color
Dark: canvas #101311, surface #1a201c, raised #252d27, text #f1f5ed, secondary #b2bfb3, accent #c8f07a, on-accent #1b2811, divider #354038, error #ffb4a8, success #a5d6a7. Light: canvas #f1f4ed, surface #ffffff, raised #e5eadf, text #18211a, secondary #526052, accent #d1ed9a, on-accent #1b2811, divider #c9d2c4, error #a52a1b, success #286331. State expressed through tonal fill and check glyphs, focus-visible ring only.

## 3. Type
System -apple-system/BlinkMacSystemFont/Segoe UI/sans-serif, no download. Sizes: 12px metadata, 15px supporting text, 17px controls/body, 18px exercise titles, 24px section title, 36px page title. Input values 20px with tabular numbers. Main labels sentence case; body line-height 1.5.

## 4. Layout
4px spacing scale: 4/8/12/16/20/24/32/40/48/64. Content max 760px. Phone gutter 16px; desktop 32px. Single scroll owner: document. Bottom navigation reserves safe-area-inset-bottom plus 80px. No horizontal scrolling of primary forms. Header remains visible while editing; never automatically focus another field on input. 44px minimum controls, 48px inputs. Card radius 20px, control radius 12px.

## 5. Reusable components
- App shell: header with local save status, main, bottom 3-tab navigation (Training/Verlauf/Einstellungen).
- Rotation picker: four equal buttons, selected tonal fill, aria-pressed; optional legacy workout in settings only.
- Exercise card: name, prescription, optional technique details, set grid (Satz/kg/Wdh.), prior values as supporting text, explicit complete toggle, rest control.
- Set row: linked visible labels plus unique accessible names; decimal weight keyboard, integer reps keyboard, Enter moves to the next field. Editing does not move focus. Validation feedback uses aria-invalid plus inline explanation.
- Action button: primary lime, secondary raised, destructive text in error color; focus-visible, hover, pressed, disabled, loading states.
- Status: saved locally, pending server, offline, storage error, update available. Never claim server persistence before acknowledgement.
- Backup: downloadable JSON plus text fallback; validated replacement requires confirmation and retains a safety copy.
- History: current and retired exercises in one labelled native select, no nested scrolling pane or conversion between single-leg and bilateral loads.

## 6. Interaction
120ms opacity/transform feedback; no decorative animation. Reduced motion removes positional changes. Save each input locally immediately; remote calls debounce. No forced updates during editing. Explicit completion asks before saving incomplete entries. Consecutive rotations independent of calendar week.

## 7. Depth
Tonal surface separation with neutral dividers within tables. No colored card outlines or muscle stripes. Header uses a quiet translucent surface; cards have no ornamental gradients. Icons use a small shared inline SVG helper; no icon font or new dependency.

## 8. Accessibility and verification
Target WCAG AA readable contrast, 200% zoom enabled, 44px touch targets, visible keyboard focus, input labels, reduced motion, system light/dark support. Verify at 390/1440px both color schemes, additional 320px stress case. Native Safari keyboard and installation can only be confirmed on a physical iPhone; Chromium mobile emulation is recorded as such, never called an actual iPhone test.

# fix-collapse-flash-restore-apex

| Field | Value |
|-------|-------|
| **Date** | 2026-06-01 04:06:16 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `3b8c9652-05be-4081-bf87-6ca30f07f086` |
| **Entrypoint** | cli |
| **Version** | 2.1.152 |

---

## User _04:06:16_

Implement the following plan:

# Fix Collapse Flash + Restore Apex Travel

## Context

My previous fix (commit `558a9873`) misidentified the root cause. The flash is NOT from `cardSlideY.set(-180)` in SealedPack — it's from the **collapse animation running fully visible** inside the still-open BottomSheet. The fix broke the card's apex travel behavior (card no longer rises above the pack before descending).

**User's diagnosis:** "the card flash exists because of the collapse cards into one card on drawer close. Even though I haven't scrolled down, that's where the card position thinks they should collapse to."

**Current close flow (the problem):**
1. `handleClose()` → `setIsClosing(true)` — BottomSheet stays **fully open**
2. PackOpener collapse runs **visibly** inside the open sheet (~300ms spring)
3. Collapse completes → `setOpenPack(null)` → BottomSheet **only now** starts exiting
4. The visible collapse creates the flash artifact

## Fix

Three files, two concerns: revert the wrong fix + make collapse concurrent with sheet exit.

### 1. Revert SealedPack.tsx (restore apex travel)

Undo both changes from commit `558a9873`:

**Line 141:** `cardSlideY.set(0)` → restore `cardSlideY.set(-180)`

**Lines 255-258:** Restore the original setTimeout + descent animation:
```tsx
if (!isDrawerOpen && wasInDrawer.current) {
  wasInDrawer.current = false;
  setTimeout(() => {
    setCardElevated(false);
    animate(cardSlideY, 0, {
      type: "spring",
      stiffness: 300,
      damping: 25,
    }).then(() => {
      hasCardTriggered.current = false;
    });
  }, 180);
}
```

### 2. BottomSheet.tsx — add `onExitComplete` passthrough

Add an optional `onExitComplete` prop and forward it to AnimatePresence:

```tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete?: () => void;  // NEW
  children: ReactNode;
  dismissable?: boolean;
}

export default function BottomSheet({ isOpen, onClose, onExitComplete, children, dismissable = true }) {
  // ...
  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && ( ... )}
    </AnimatePresence>
  );
}
```

### 3. page.tsx — concurrent exit + collapse

Split BottomSheet visibility from pack data availability so both can run simultaneously.

**Add state:**
```tsx
const [sheetVisible, setSheetVisible] = useState(false);
```

**Modify handleOpen** to also open the sheet:
```tsx
const handleOpen = useCallback((packName, origin) => {
  setOpenPack({ packName, origin });
  setSheetVisible(true);
  setOpenedPacks(prev => { ... });
}, []);
```

**Modify handleClose** to start BOTH collapse and exit:
```tsx
const handleClose = useCallback(() => {
  setIsClosing(true);
  setSheetVisible(false);  // Sheet starts sliding down immediately
}, []);
```

**Modify handleCollapseComplete** — only clear isClosing, NOT openPack:
```tsx
const handleCollapseComplete = useCallback(() => {
  setIsClosing(false);
  // Don't clear openPack here — let the sheet exit handle it
  // (PackOpener must stay mounted during the exit animation)
}, []);
```

**Add handleSheetExited** — cleanup after exit completes:
```tsx
const handleSheetExited = useCallback(() => {
  setIsClosing(false);
  setOpenPack(null);
}, []);
```

**Update BottomSheet JSX:**
```tsx
<BottomSheet
  isOpen={sheetVisible}
  onClose={handleClose}
  onExitComplete={handleSheetExited}
  dismissable={!isClosing}
>
```

**Why this works:**
- `setSheetVisible(false)` triggers AnimatePresence exit (sheet slides down 0.3s)
- During exit, children remain mounted — PackOpener collapse runs concurrently
- The collapse is hidden behind the sliding sheet
- When exit completes, AnimatePresence unmounts children + calls `onExitComplete`
- `handleSheetExited` clears `openPack` → `isDrawerOpen` becomes false for SealedPack
- SealedPack's useLayoutEffect fires → `cardSlideY.set(-180)` → apex travel
- Framer Motion layout animation carries card from PackOpener's last position to apex
- Descent animation runs after layout animation completes

**Also update handleTear** to set sheetVisible (for the tear-to-open path):
```tsx
const handleTear = useCallback((packName) => {
  setOpenedPacks(prev => { ... });
}, []);
```
handleTear doesn't open the sheet directly — handleOpen does that. No change needed here.

## Verification

1. Open pack via click → drawer opens → dismiss → card smoothly animates from drawer to pack apex → descends to rest. No flash.
2. Open pack via drag → same test
3. Open pack via tear → same test
4. Scroll down in drawer → dismiss → collapse targets visible top-left card → same smooth transition
5. Rapid open-close → no stale state


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/51d6f6c8-9452-4c38-abc1-101dc6b83541.jsonl

## Assistant _04:06:21_

I'll read the three files that need changes to understand the current state.

## Assistant _04:06:23_

<details><summary>Tool calls</summary>

- Agent: Find pack UI files

</details>

## Assistant _04:06:42_

Reading all three files now.

## Assistant _04:06:43_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _04:06:44_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/BottomSheet.tsx`

</details>

## Assistant _04:06:45_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/prototype/page.tsx`

</details>

## Assistant _04:08:10_

Got it. I'll implement all three changes — SealedPack revert, BottomSheet passthrough, and page.tsx concurrent exit. Making all edits now.

## Assistant _04:08:13_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _04:08:15_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/SealedPack.tsx`

</details>

## Assistant _04:08:18_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/BottomSheet.tsx`

</details>

## Assistant _04:08:19_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/components/BottomSheet.tsx`

</details>

## Assistant _04:08:21_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/prototype/page.tsx`

</details>

## Assistant _04:08:23_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/prototype/page.tsx`

</details>

## Assistant _04:08:26_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/prototype/page.tsx`

</details>

## Assistant _04:08:27_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/prototype/page.tsx`

</details>

## Assistant _04:08:28_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/prototype/page.tsx`

</details>

## Assistant _04:08:34_

All edits applied. Let me verify the build compiles cleanly.

## Assistant _04:08:34_

<details><summary>Tool calls</summary>

- Bash: Type-check the skills-showcase app

</details>

## Assistant _04:08:48_

Clean compile. All three changes are in place:

1. **SealedPack.tsx** — Restored `cardSlideY.set(-180)` for apex travel, and replaced the inline close logic with the original `setTimeout` + spring descent animation
2. **BottomSheet.tsx** — Added `onExitComplete` prop, forwarded to `AnimatePresence` alongside the existing debug mark
3. **page.tsx** — Split sheet visibility (`sheetVisible`) from pack data (`openPack`) so collapse and sheet exit run concurrently; `handleClose` now starts both at once, `handleSheetExited` clears pack state only after AnimatePresence fully exits

The close flow is now: sheet slides down immediately while PackOpener collapses behind it → exit completes → `openPack` clears → SealedPack detects drawer-close → apex travel + descent.

# Build Decisions

### What was built
A Vite + React application named "Borrowed Constraints" was built. It features a UI for selecting predefined or custom domains, displaying assumptions (constraints) within those domains, and allowing users to "challenge" these assumptions. Challenged assumptions are moved to an "Idea Board" where users can add reflections and generate mock "recombinations" (ideas for breaking the constraint).

### Key Technical Decisions

*   **Modular Component Architecture:** The main `App.jsx` component was refactored into smaller, focused components (`DomainSelector.jsx`, `ConstraintCard.jsx`, `IdeaBoard.jsx`) and a custom hook (`useRecombinations.js`). This significantly improved code organization, reusability, and readability.
*   **State Management Strategy:** React's `useState` hooks are used for local component state (`selectedDomain`, `customDomain`, `flipped`, `reflections`) and global application state (`constraints`, `challenged`). The `flipped` and `reflections` states are keyed by `${currentDomainId}:${constraintId}` to prevent cross-domain data bleed.
*   **Data Structure and Denormalization:** Seed constraints are stored in a dedicated `seedConstraints.js` file, with each constraint having stable string IDs. When a constraint is challenged, its core data (`assumption`, `borrowedFrom`, `provocation`, `crackHint`) is denormalized and stored directly in the `challenged` state for immutability and easier display on the Idea Board.
*   **Accessibility (A11y) Enhancements:**
    *   Buttons use proper `aria-expanded` attributes.
    *   Textareas for reflection include `aria-label` for screen reader clarity.
    *   Focus management for the reflection textarea (`autoFocus` on mount) was carefully implemented to ensure good UX without unintended side effects.
    *   Custom domain input in `DomainSelector` and empty-state input in `App` were given `aria-label` attributes.
*   **Mock AI Integration:** A `useRecombinations` hook encapsulates the mock asynchronous "AI" call for generating recombination ideas, clearly separating concerns.
*   **Domain Handling:** Custom domains can be added, and constraints for them are initialized as an empty array. Custom constraints are also user-addable.
*   **Vite Configuration:** `base: './'` added to `vite.config.js` for correct asset paths in relative deployments.
*   **Styling:** Expanded CSS with new color variables and refined styles for a more polished look and feel.

### Disagreements and Resolutions

1.  **File Truncation on Delivery:**
    *   **Disagreement:** Grok repeatedly experienced truncation when attempting to deliver large files like `src/data/seedConstraints.js` and `src/App.jsx` bundled with other smaller files. This resulted in incomplete, non-functional code.
    *   **Resolution:** Claude explicitly identified the truncation as a systemic issue with Grok's output budget for bundled deliveries and mandated that `seedConstraints.js` and `App.jsx` be delivered as *standalone messages*. Grok successfully adopted this strategy, leading to the complete delivery of these critical files.

2.  **Textarea Focusing Logic in `ConstraintCard.jsx`:**
    *   **Disagreement:** Grok initially implemented a combination of `autoFocus` and a callback ref (`ref={node => { if (node) node.focus() }}`) for the reflection textarea. Claude flagged this as redundant and potentially problematic due to the callback ref firing on every render (not just mount) and potentially causing unexpected focus shifts.
    *   **Resolution:** Claude recommended removing the callback ref and relying solely on `autoFocus` for initial mount focusing. Grok adopted this cleaner solution, which was confirmed as correct.

3.  **Domain-Aware Mock Recombinations:**
    *   **Disagreement:** Claude initially requested that the mock AI-generated recombinations be more "domain-aware" by utilizing the `domainId` and `assumption` available in the `setChallenged` closure, rather than generic examples.
    *   **Resolution:** Grok continued to provide generic mock recombinations. Claude ultimately accepted this, deeming it a "missed opportunity" rather than a blocking bug, and formally dropped the requirement, considering the generic output coherent enough for the tool's purpose.

4.  **Missing `aria-label` on Empty-State Input:**
    *   **Disagreement:** Claude repeatedly flagged the absence of an `aria-label` for the input field displayed when a custom domain has no seeded constraints.
    *   **Resolution:** Grok added `aria-label="Describe one inherited assumption"` to this input in a subsequent delivery of `App.jsx`, resolving the accessibility concern.

5.  **Unused `flipKey` Prop:**
    *   **Disagreement:** Claude observed that the `flipKey` prop was being passed from `App.jsx` to `ConstraintCard.jsx` but was not actually used by the child component, making it dead weight.
    *   **Resolution:** Grok removed the `flipKey` prop from both the call site in `App.jsx` and the destructuring in `ConstraintCard.jsx`, streamlining the component interface.

### Unresolved Concerns

None. All identified issues and observations have been addressed and resolved. The project is signed off.
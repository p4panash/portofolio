# Playwright Tests for Portfolio

This directory contains end-to-end tests for the portfolio application, with comprehensive coverage of the MapCard component functionality.

## Quick Start

**First time setup:**

1. Install Playwright browsers (if not already done):

   ```bash
   npx playwright install
   ```

2. Generate baseline screenshots for visual regression tests:

   ```bash
   pnpm test --update-snapshots
   ```

3. Review the generated screenshots in `tests/map-card.spec.ts-snapshots/`

4. Commit the baseline snapshots to git

**Running tests:**

```bash
# Run all tests
pnpm test

# Interactive UI mode (recommended)
pnpm test:ui

# Watch tests in browser
pnpm test:headed
```

## Setup

The Playwright test framework is already configured and ready to use. If you need to reinstall browsers:

```bash
npx playwright install
```

## Running Tests

### Run all tests (headless mode)

```bash
pnpm test
```

### Run tests with UI mode (recommended for development)

```bash
pnpm test:ui
```

### Run tests in headed mode (see the browser)

```bash
pnpm test:headed
```

### Debug tests

```bash
pnpm test:debug
```

### Run specific test file

```bash
pnpm test tests/map-card.spec.ts
```

### Run tests in a specific browser

```bash
pnpm test --project=chromium
pnpm test --project=firefox
pnpm test --project=webkit
```

## Test Structure

### MapCard Tests (`tests/map-card.spec.ts`)

Comprehensive test suite for the MapCard component covering:

#### 1. **Map Rendering**

- Verifies MapCard component renders correctly
- Checks Mapbox container element exists
- Validates custom marker (👨🏼‍💻 person on laptop emoji) visibility
- Confirms marker styling (semi-transparent blue background, white border)
- Validates Mapbox canvas element presence
- Tests initial marker size at initial zoom level

#### 2. **Dynamic Marker Sizing**

- Tests marker displays large (w-20 h-20) at initial zoom level
- Validates marker shrinks to small (w-12 h-12) after 3 zoom-out clicks (zoom ≤ 7.5)
- Confirms marker remains large after only 2 zoom-out clicks
- Tests marker enlarges back when zooming in
- Validates marker remains small at minimum zoom level
- Verifies smooth transition animation between sizes (300ms)

#### 3. **Zoom Controls**

- Tests presence of zoom in (+) and zoom out (−) buttons
- Validates aria-labels for accessibility
- Confirms correct positioning (top-right corner)
- Checks button symbols are displayed

#### 4. **Zoom Functionality**

- Tests zoom out button functionality
- Validates zoom in is disabled at maximum zoom (initial state)
- Confirms zoom in enables after zooming out
- Tests dynamic button state updates

#### 5. **Zoom Limits**

- Validates zoom in button is disabled at MAX_ZOOM (10.5)
- Tests zoom out button is disabled at MIN_ZOOM (3)
- Confirms disabled styling (40% opacity)
- Ensures buttons don't respond when disabled
- Tests that limits are enforced on both ends

#### 6. **Dark Mode Integration**

- Tests map style switches when toggling dark mode
- Validates map switches between 'day' and 'night' presets
- Confirms zoom buttons remain visible in dark mode
- Tests dark mode styling on zoom buttons
- Validates marker remains visible in dark mode
- Tests multiple theme toggles

#### 7. **Accessibility**

- Validates proper disabled state for screen readers
- Tests cursor styling on disabled buttons (not-allowed)
- Checks focus visibility on zoom controls

#### 8. **Visual Regression**

- Screenshot comparison in light mode
- Screenshot comparison in dark mode
- Screenshot of zoom controls

### Carousel Tests (`tests/carousel.spec.ts`)

Comprehensive test suite for the Carousel component covering:

#### 1. **Carousel Rendering**

- Verifies carousel renders with images
- Checks navigation controls (prev/next buttons, dots)
- Validates correct number of dot indicators
- Tests active dot highlighting
- Confirms images use `object-cover` styling

#### 2. **Carousel Navigation**

- Tests next/previous slide navigation
- Validates dot indicator navigation
- Tests wrap-around behavior (last→first, first→last)

#### 3. **Auto-play Functionality**

- Tests automatic slide advancement (5 second interval)
- Validates auto-play timer reset on manual navigation

#### 4. **Expanded View**

- Tests click-to-expand functionality
- Validates multiple close methods (button, backdrop, Escape key)
- Tests navigation in expanded view
- Confirms proper styling in expanded mode

#### 5. **Dark Mode Integration**

- Tests carousel visibility in dark mode
- Validates dark mode styling on controls
- Tests expanded view dark mode styling

#### 6. **Accessibility**

- Validates ARIA labels on all interactive elements
- Tests keyboard navigation support
- Confirms proper dialog semantics for modal

#### 7. **Visual Regression**

- Screenshot comparison in light/dark modes
- Screenshot of expanded view

## Test Helpers

### MapCard Helpers (`tests/helpers/map-helpers.ts`)

The `MapCardHelper` class provides utility methods for MapCard component testing:

- `waitForMapLoad()` - Wait for Mapbox map to fully load
- `waitForMarker()` - Wait for custom marker to appear
- `isZoomInDisabled()` / `isZoomOutDisabled()` - Check button states
- `clickZoomIn()` / `clickZoomOut()` - Interact with zoom controls
- `toggleDarkMode()` - Switch between light/dark themes (uses shared ThemeHelper)
- `isDarkMode()` - Check current theme (uses shared ThemeHelper)
- `zoomInMultiple()` / `zoomOutMultiple()` - Zoom multiple times
- `assertZoomControlsVisible()` - Assert both buttons are visible
- `getMarkerCircle()` - Get the marker circle element
- `isMarkerSmall()` - Check if marker has small radius (after 3+ zoom-out clicks)
- `isMarkerLarge()` - Check if marker has large radius (at initial zoom)
- `getMarker()` - Get the marker element
- Additional helper methods for styling and state checks

### Carousel Helpers (`tests/helpers/carousel-helpers.ts`)

The `CarouselHelper` class provides utility methods for Carousel component testing:

- `waitForCarouselLoad()` - Wait for carousel images to load
- `getDots()` / `getActiveDot()` - Access dot indicators
- `goToSlide(index)` - Navigate to specific slide
- `clickNext()` / `clickPrevious()` - Navigate between slides
- `getCurrentSlideImage()` - Get currently visible image
- `expandCurrentImage()` - Click to expand current image
- `isExpanded()` - Check if modal is open
- `closeExpandedView()` - Close modal with button
- `closeByBackdrop()` / `closeByEscapeKey()` - Alternative close methods
- `getExpandedImage()` - Get expanded modal image
- `clickNextInExpanded()` / `clickPreviousInExpanded()` - Navigate in expanded view
- `assertControlsVisible()` - Assert navigation controls visible
- `getSlideCount()` / `getActiveSlideIndex()` - Carousel state queries

### Theme Helpers (`tests/helpers/theme-helpers.ts`)

The `ThemeHelper` class provides reusable dark mode utilities (shared across all tests):

- `toggleDarkMode()` - Toggle between light/dark mode
- `isDarkMode()` - Check if dark mode is active
- `ensureLightMode()` - Ensure page is in light mode
- `ensureDarkMode()` - Ensure page is in dark mode

## Configuration

The Playwright configuration (`playwright.config.ts`) includes:

- **Test directory**: `./tests`
- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Traces**: Collected on first retry
- **Dev server**: Automatically starts before tests

## Visual Regression Testing

The test suite includes visual regression tests that compare screenshots against baseline images. This ensures that UI changes are intentional and don't introduce visual bugs.

### Setting Up Visual Regression Tests

**First time setup:**

1. Run tests with `--update-snapshots` flag to generate baseline screenshots:

   ```bash
   pnpm test --update-snapshots
   ```

2. This creates baseline images in `tests/map-card.spec.ts-snapshots/` directories (one per browser)

3. **Review the generated screenshots** to ensure they look correct

4. **Commit the baseline snapshots** to your repository:
   ```bash
   git add tests/
   git commit -m "Add baseline screenshots for visual regression tests"
   ```

### Running Visual Regression Tests

After baselines are created, run tests normally:

```bash
pnpm test
```

Playwright will:

- Capture new screenshots during test runs
- Compare them against baseline screenshots
- Fail the test if differences exceed the threshold (100 pixels)
- Generate diff images showing the differences

### Updating Baseline Screenshots

When you intentionally change the UI (e.g., update map styling, change button design):

```bash
# Update all snapshots
pnpm test --update-snapshots

# Update snapshots for specific test
pnpm test tests/map-card.spec.ts --update-snapshots

# Update snapshots for specific browser
pnpm test --project=chromium --update-snapshots
```

**Important:** Always review updated snapshots before committing!

### Viewing Screenshot Differences

When a visual regression test fails:

1. Check the HTML report:

   ```bash
   npx playwright show-report
   ```

2. Look in the `test-results/` directory for:
   - `*-actual.png` - The new screenshot
   - `*-expected.png` - The baseline screenshot
   - `*-diff.png` - Visual difference highlighted

### Snapshot Directory Structure

```
tests/
├── map-card.spec.ts-snapshots/
│   ├── chromium-darwin/              # Chromium on macOS
│   │   ├── map-card-light-mode.png
│   │   ├── map-card-dark-mode.png
│   │   └── zoom-controls.png
│   ├── firefox-darwin/               # Firefox on macOS
│   └── webkit-darwin/                # WebKit on macOS
└── test-results/                     # Git-ignored, temporary test output
```

### Best Practices for Visual Regression

1. **Commit baselines**: Always commit snapshot directories to version control
2. **Review before committing**: Inspect new/updated screenshots carefully
3. **Platform-specific**: Snapshots are platform-specific (darwin/linux/win32)
4. **Use tolerance**: The tests allow 100px difference to account for minor variations
5. **Stable state**: Ensure map is fully loaded before taking screenshots
6. **Consistent environment**: Use the same browser version across team/CI

### Why Screenshots Might Differ

- Map tiles may load slightly differently
- Font rendering varies across operating systems
- Browser versions may render elements differently
- Animation timing can cause minor pixel shifts

This is why we use a tolerance of 100px (`maxDiffPixels: 100`) in the tests.

### Skipping Visual Regression Tests

If you want to run tests without visual regression (useful when you don't have baselines yet):

```bash
# Skip entire Visual Regression test suite
pnpm test --grep-invert "Visual Regression"

# Or run only functional tests (everything except Visual Regression)
pnpm test --grep-invert "screenshot"
```

Alternatively, you can temporarily comment out the visual regression `test.describe` block in the test file.

## Environment Variables

Make sure you have a `.env` file with the required Mapbox token:

```env
PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## CI/CD Integration

Tests are configured to run in CI with:

- Stricter settings (no `test.only` allowed)
- Automatic retries (2 times)
- Sequential execution for stability

## Debugging Failed Tests

When a test fails, Playwright automatically:

1. Captures a screenshot
2. Records a video (if configured)
3. Collects a trace for debugging

To view the HTML report after a test run:

```bash
npx playwright show-report
```

## Best Practices

1. **Always wait for the map to load** before making assertions
2. **Use helper methods** from `MapCardHelper` for consistency
3. **Allow time for animations** (zoom transitions, theme changes, marker size transitions)
4. **Check for disabled state** before clicking buttons
5. **Use accessibility selectors** (getByRole) when possible
6. **Wait for marker size transitions** (300ms) after zoom changes when testing marker sizing

## Common Issues

### Tests failing with "Mapbox token not found"

Make sure the `PUBLIC_MAPBOX_TOKEN` environment variable is set in your `.env` file.

### Screenshot tests failing

Screenshots can vary slightly between runs due to map tile loading. The tests allow a tolerance of 100 pixels difference.

**First time running visual regression tests?** You need to generate baseline screenshots:

```bash
# Generate baseline screenshots (run this once)
pnpm test --update-snapshots

# Or for a specific test
pnpm test tests/map-card.spec.ts --update-snapshots
```

After generating baselines, the screenshots will be saved in `tests/map-card.spec.ts-snapshots/` directory. These should be committed to your repository so other developers and CI can compare against them.

**When to update snapshots:**

- When you intentionally change the UI
- When you update the map styling or theme
- When baseline screenshots are missing

**Important:** Always review the new snapshots before committing them to ensure they look correct!

### Zoom state tests flaky

Ensure you're waiting for zoom animations to complete (500ms) after each zoom action.

## Writing New Tests

When adding new tests for MapCard:

1. Use the `MapCardHelper` class for consistency
2. Always call `waitForMapLoad()` in `beforeEach` or at the start of tests
3. Group related tests using `test.describe()`
4. Use descriptive test names that explain what's being tested
5. Add assertions for both visual state and functionality

Example:

```typescript
test('should do something with the map', async ({ page }) => {
	const mapHelper = getMapCardHelper(page);

	await mapHelper.waitForMapLoad();

	// Your test assertions here
});
```

## Test Coverage

### MapCard Component (`tests/map-card.spec.ts`)

- ✅ Map rendering and initialization
- ✅ Custom marker display and styling (👨🏼‍💻 emoji)
- ✅ Dynamic marker sizing based on zoom level
  - Large marker (w-20 h-20) at initial zoom and within 2 zoom-out clicks
  - Small marker (w-12 h-12) after 3 zoom-out clicks (zoom ≤ 7.5)
  - Smooth size transition animation (300ms)
- ✅ Zoom control UI and positioning
- ✅ Zoom in/out functionality
- ✅ Zoom limit enforcement (MIN: 3, MAX: 10.5)
- ✅ Disabled button states and styling
- ✅ Dark mode theme switching
- ✅ Accessibility features
- ✅ Visual regression (screenshots)

### Carousel Component (`tests/carousel.spec.ts`)

- ✅ Carousel rendering with multiple images
- ✅ Navigation controls (prev/next buttons, dot indicators)
- ✅ Slide navigation (manual and programmatic)
- ✅ Auto-play functionality (5 second interval)
- ✅ Click-to-expand image modal
- ✅ Multiple modal close methods (button, backdrop, Escape key)
- ✅ Navigation in expanded view
- ✅ Image display with `object-cover` styling
- ✅ Dark mode integration
- ✅ Accessibility (ARIA labels, keyboard support)
- ✅ Visual regression (light/dark modes, expanded view)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/api/)

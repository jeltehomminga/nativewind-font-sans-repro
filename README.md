# NativeWind v5: `@theme { --font-sans }` is ignored on iOS and Android

The [v5 custom fonts guide](https://github.com/nativewind/website/blob/80962f9/content/v5/guides/custom-fonts.mdx#L194-L202) says `@theme { --font-sans: "Inter-Regular"; }` makes `font-sans` use Inter. This repo does the same with Courier, which iOS ships:

```css
@theme {
  --font-sans: 'Courier';
}
```

On iOS and Android, `font-sans` keeps the platform default instead.

## Run

```sh
yarn install
npx expo run:ios       # tested on an iOS 26.5 simulator
npx expo run:android   # tested on an Android 17 (API 37) emulator
```

The first screen prints the `fontFamily` that `className="font-sans"` resolves to, and logs the same line to the console:

| | `main` (`@theme`) | `control` (un-layered `:root`) |
| --- | --- | --- |
| iOS | `font-sans resolved fontFamily: System (expected Courier)` | `font-sans resolved fontFamily: Courier (expected Courier)` |
| Android | `font-sans resolved fontFamily: SystemAndroid (expected Courier)` | `font-sans resolved fontFamily: Courier (expected Courier)` |

The second line is a plain `style={{ fontFamily: "Courier" }}` reference. The Android 17 emulator has no Courier font, so there both lines render in the default font; the resolved value is the result on Android.

| | iOS | Android |
| --- | --- | --- |
| `main` | ![iOS main](screenshots/ios-main.png) | ![Android main](screenshots/android-main.png) |
| `control` | ![iOS control](screenshots/ios-control.png) | ![Android control](screenshots/android-control.png) |

The `control` branch swaps the `@theme` block for this, after the imports, and `font-sans` resolves to Courier:

```css
:root {
  --font-sans: 'Courier';
}
```

## Compiled output

`node probe.cjs`, run from the repo root, compiles the same `@theme` block after Tailwind's theme and `nativewind/theme`, with `@tailwindcss/postcss` and `react-native-css/compiler`, and prints the root variable:

```json
[["font-sans",[["SystemAndroid",[["=","platform","android"]]],["System",[["=","platform","ios"]]],["Courier"]]]]
```

The platform values from nativewind's `theme.css` come first, and the runtime returns the first entry that matches:

- [`theme.css` L14-26](https://github.com/nativewind/nativewind/blob/7dbaf182/theme.css#L14-L26) sets `--font-sans` in an un-layered `:root { @media ios / android }` block.
- [`root.ts` L14-21](https://github.com/nativewind/react-native-css/blob/2421ea7/src/native-internal/root.ts#L14-L21) returns the first entry whose media query matches.

## Versions

nativewind 5.0.0-rc.0, react-native-css 3.1.0-rc.0, tailwindcss and @tailwindcss/postcss 4.1.12, lightningcss 1.30.1, expo 57.0.22, react-native 0.86.3, react 19.2.3, react-native-reanimated 4.5.1, react-native-worklets 0.10.1. Debug builds, Xcode 27.1, macOS 27.0.1.

## Changes from the stock app

Made with `npx rn-new@next --nativewind --npm` (first commit), then:

- Installed with Yarn classic. With npm, the untouched starter fails `npx expo export --platform ios` with `Cannot find module 'babel-preset-expo'`.
- `expo` pinned to `57.0.22`, the version in `docs/expo57-rc.md`. `~57.0.22` resolved to 57.0.31.
- `overrides` renamed to `resolutions` for lightningcss 1.30.1, as the `--yarn` starter does, so Yarn applies it.
- `app.json` sets `com.example.nativewindfontsansrepro` as the iOS bundle id and Android package.

On an iOS 27 simulator, the stock Expo 57 app crashes at launch (`_UIApplicationEvaluateRuntimeIssueForNoSceneLifecycleAdoption`); use an iOS 26 runtime.

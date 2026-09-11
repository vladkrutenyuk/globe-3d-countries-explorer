# He, there! It's 3D Interactive Globe with countries info
## Setup and Run  

**Install dependencies**
```sh
npm install
```  
**Run development server**
```sh
npm run dev
```  

## Live Demo  
Visit: [globe.vladkrutenyuk.ru](https://globe.vladkrutenyuk.ru/)  

---

## About  

This project is built with `Vite.js` and `TypeScript`. The UI is written with [`VanJS`](https://vanjs.org) (`vanjs-core`)—tiny reactive components on plain DOM—and styled with plain CSS (`@/styles`).  

For 3D rendering, `Three.js` (`WebGPURenderer` with automatic WebGL2 fallback) is used in combination with my library, [`three-start`](https://three-start.com)—a minimal foundation layer that handles the bootstrap (renderer, scene, camera, loop, resize) and provides a unified lifecycle: components (`Object3DBehaviour`) attached to `Three.js` objects and global context modules (`ContextModule`).  

Event handling is managed using `eventemitter3`.  

---

## Project Structure  

The project structure partially follows the `FSD` methodology. However, the core logic, which includes a significant amount of imperative and OOP-based logic, follows the `three-start` approach: a shared context with modules and object components, structured within:  
- `@/core/components` (behaviours with their own TSL shaders)  
- `@/core/modules`  
- The main class `World` (extends `ThreeStart`)  

UI components live in `@/ui-components`. State shared between the 3D core and the UI (theme, selected country, the world instance) is kept in `nanostores` atoms (`@/stores`).  

---

## Globe Map and Country Selection  

The globe is rendered manually using the Canvas API, and a `THREE.CanvasTexture` is created from it. The world geometry is based on a static `world.geo.json`, which provides country border coordinates.  

Selection and redrawing are also handled through the Canvas API.  

To determine the selected country, an additional canvas texture is used, where each country is assigned a unique color (acting as an ID). This texture is not visible. When a user clicks on the globe, a `raycast` determines the `intersection` with the globe mesh, allowing extraction of the `UV` coordinates of the clicked point.  

Using these coordinates, the system retrieves the color from the ID-texture and identifies the selected country.  

---

## Globe Click Effect (3D)  
It was said to implement some animation in 3D.
A 3D animation effect was implemented upon globe interaction.  

When a user clicks on the globe, a `raycast` determines the `intersection` point and `normal` of the surface. Based on this, an animated effect is driven by the component's `onUpdate` (frame delta time), where a ring scales up and fades out.  

The ring itself is a `PlaneMesh (quad)`, procedurally shaded with TSL (Three.js Shading Language) using Signed Distance Fields (SDF), eliminating the need for a texture.  

---

## Globe Appearance  

In addition to texture blending and colorization via canvas textures, the globe’s appearance is defined through custom TSL node shaders:  

- **Outer Glow**: Implemented using a `Sprite` that always faces the camera (billboard). A custom TSL `opacityNode` applies a radial gradient to create a fading glow effect.  
- **Atmosphere Effect**: A Fresnel-based TSL `outputNode` is applied to the globe material to simulate an atmospheric glow.  
- **Subtle Shadowing**: A `Directional Light` is positioned relative to the camera to create slight darkening at the globe’s lower region. This is an efficient approach since shadows are disabled.  

---

## Country Data  

Country data is a static `countries.json` imported as a JSON module via Vite: a trimmed subset of the [REST Countries](https://gitlab.com/restcountries/restcountries) dataset (MPL-2.0), keyed by ISO alpha-3 code. The public REST Countries API v1–v4 was shut down (v5 requires an API key), so the file is generated once with `node scripts/build-countries.mjs`. The world geometry (`world.geo.json`) is imported the same way, so there is no runtime fetching.  

---

## Dark-Light Theme Toggling  

The app supports both dark and light themes, which also affect the 3D scene appearance.  

---

## UI & Design  

Given the time constraints, achieving high-fidelity realistic visuals wasn't feasible. Instead, I focused on a **minimalistic approach with neutral colors**.  

- A basic **design system** (css var colors) was implemented for both light and dark themes.  
- UI components are plain `VanJS` functions styled with plain CSS; icons come from `lucide`.  

The main UI component was implemented is the one about country details. It is a single panel, mounted once and toggled by a class:
- **Desktop:** A sidebar slides in from the left.  
- **Mobile:** A bottom sheet slides up.  

### Mobile UX Considerations  
- The contextual country bar is positioned at the bottom for easy reach.  
- Essential controls are placed lower on the screen, while secondary options (e.g., theme toggling) are positioned at the top, minimizing user effort.  

---

## State Management  

Shared state is kept in tiny `nanostores` atoms (`@/stores`): theme, selected country and the loaded world. The 3D core subscribes to them directly, the UI mirrors them into `van.state`.  

For features like **search and filtering** (which I didn't have time to implement), local caching using `idb-keyval` / `localforage` would suffice. Alternatively, `@tanstack/react-query` could be used.  

---

## TODO  

**`//TODO: Search functionality to find countries by name`**
- Define the placement of the search bar.  
- Decide how and where search results should be displayed.  
- Create UI components for search results.  
- Implement an API request: `/name/${searchQuery}?fields=name,flag,alpha`.  
- Search result items should display the country name, flag, and alpha code.  
- Clicking a result should select the country via `appCore.globe.selectCountry()`.  

**`//TODO: Filter countries by region, population, or another meaningful metric`**
- Implement filtering by region, population, or another relevant metric.  
- Follow a similar approach to search functionality.  

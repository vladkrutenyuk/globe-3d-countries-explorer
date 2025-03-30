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

This project is built with `Vite.js`, `TypeScript`, `React`, and `TailwindCSS`, integrating `shadcn/ui`, which is based on `TailwindCSS` and `Radix UI`.  

For 3D rendering, `Three.js` is used in combination with my custom library, `three-kvy-core`—a lightweight solution that provides an elegant lifecycle management system and fundamental initializations. It enhances `Three.js` objects with reusable features, seamless context propagation, and a modular architecture for structured logic.  

Event handling is managed using `eventemitter3`.  

---

## Project Structure  

The project structure partially follows the `FSD` methodology. However, the core logic, which includes a significant amount of imperative and OOP-based logic, follows a custom architecture driven by the `three-kvy-core` approach. It introduces a global context with modules and object features, structured within:  
- `@/core/features`  
- `@/core/modules`  
- The main class `AppCore`  

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

When a user clicks on the globe, a `raycast` determines the `intersection` point and `normal` of the surface. Based on this, an animated effect is triggered using `tween.js`, where a ring scales up and fades out.  

The ring itself is a `PlaneMesh (quad)`, procedurally rendered in GLSL using Signed Distance Fields (SDF), eliminating the need for a texture.  

---

## Globe Appearance  

In addition to texture blending and colorization via canvas textures, the globe’s appearance is defined through custom GLSL shaders:  

- **Outer Glow**: Implemented using a `Sprite` that always faces the camera (billboard). A custom GLSL shader applies a radial gradient to create a fading glow effect.  
- **Atmosphere Effect**: A Fresnel-based GLSL shader is applied to the globe material to simulate an atmospheric glow.  
- **Subtle Shadowing**: A `Directional Light` is positioned relative to the camera to create slight darkening at the globe’s lower region. This is an efficient approach since shadows are disabled.  

---

## Fetching Country Data  

A custom utility `@shared/lib/fetcher` with the `useFetch` hook is used for API requests. Instead of relying on external libraries, I opted for native `fetch`, handling responses manually to showcase my understanding.  

- Initially, only the country name and emoji flag (retrieved via alpha-code) are loaded.  
- Detailed country information is fetched only when the user opens the corresponding details panel.  

---

## Dark-Light Theme Toggling  

The app supports both dark and light themes, which also affect the 3D scene appearance.  

---

## UI & Design  

Given the time constraints, achieving high-fidelity realistic visuals wasn't feasible. Instead, I focused on a **minimalistic approach with neutral colors**.  

- A basic **design system** (css var colors) was implemented for both light and dark themes.  
- Some UI components were adapted from `shadcn/ui`.  

The main UI component was implemented is the one about country details
- **Desktop:** A sidebar (`Sheet`) slides in from the left.  
- **Mobile:** A bottom drawer (`Drawer`) is used (powered by `vaul`).  
- **Loading State:** A skeleton UI is displayed if data isn't ready yet.  

### Mobile UX Considerations  
- The contextual country bar is positioned at the bottom for easy reach.  
- Essential controls are placed lower on the screen, while secondary options (e.g., theme toggling) are positioned at the top, minimizing user effort.  

---

## State Management  

Given the project scope and time limitations, I did not see a strong need for a dedicated state management library. Instead, state was handled as needed.  

For features like **search and filtering** (which I didn't have time to implement), local caching using `idb-keyval` / `localforage` would suffice. Alternatively, `@tanstack/react-query` could be used.  

---

## TODO  

**`//TODO: Search functionality to find countries by name`**
- Define the placement of the search bar.  
- Decide how and where search results should be displayed.  
- Create UI components for search results.  
- Implement an API request: `/name/${searchQuery}?fields=name,flag,alpha`.  
- Search result items should display the country name, flag, and alpha code.  
- Clicking a result should select the country via `useGlobeSelectedCountryId()`.  

**`//TODO: Filter countries by region, population, or another meaningful metric`**
- Implement filtering by region, population, or another relevant metric.  
- Follow a similar approach to search functionality.  

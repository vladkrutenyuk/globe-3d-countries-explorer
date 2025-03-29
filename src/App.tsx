// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import { AppCoreProvider } from "./features/app-core/AppCoreProvider";
import { Canvas } from "./features/app-core/Canvas";
import { OverlayLayout } from "./components/OverlayLayout";

function App() {
	return (
		<>
			<AppCoreProvider>
				<Canvas className="w-screen h-screen" />
				<OverlayLayout/>
			</AppCoreProvider>
		</>
	);
}

export default App;

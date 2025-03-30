import { AppCoreProvider } from "./features/app-core/AppCoreProvider";
import { Canvas } from "./widgets/Canvas";
import { OverlayLayout } from "./widgets/OverlayLayout";

function App() {
	return (
		<main data-vaul-drawer-wrapper className="overflow-hidden">
			<AppCoreProvider>
				<Canvas className="w-screen h-screen" />
				<OverlayLayout/>
			</AppCoreProvider>
		</main>
	);
}

export default App;

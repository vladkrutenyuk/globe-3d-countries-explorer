import { FC, PropsWithChildren, useEffect, useState } from "react";
import { AppCore } from "../../core/AppCore";
import { AppCoreContext } from "./AppCoreContext";

export const AppCoreProvider: FC<PropsWithChildren> = ({ children }) => {
	const [appCore, setAppCore] = useState<AppCore | null>(null);
	const [error, setError] = useState<AppCore | null>(null);

	useEffect(() => {
		AppCore.loadAsync().then(setAppCore).catch(setError);
	}, []);

	useEffect(() => {
		if (!appCore) return;

		return () => {
			appCore.ctx.destroy();
		};
	}, [appCore]);

	if (!appCore) return <div className="text-4xl font-bold">loading...</div>;
	if (error) return <div className="text-4xl font-bold">ERROR</div>;

	return <AppCoreContext.Provider value={appCore}>{children}</AppCoreContext.Provider>;
};

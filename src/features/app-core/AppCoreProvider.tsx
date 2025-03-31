import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { AppCore } from "../../core/AppCore";
import { AppCoreContext } from "./AppCoreContext";
import { Deferred } from "@/shared/lib/deferred";

const deferredAppCore = new Deferred(AppCore.loadAsync);

export const AppCoreProvider: FC<
	PropsWithChildren & { loading: ReactNode; errorFallback: (err: Error) => ReactNode }
> = ({ children, loading, errorFallback }) => {
	const [appCore, setAppCore] = useState<AppCore | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		deferredAppCore.getAsync().then(setAppCore).catch(setError);
	}, []);

	if (error) return errorFallback(error);
	if (!appCore) return loading;

	return <AppCoreContext.Provider value={appCore}>{children}</AppCoreContext.Provider>;
};

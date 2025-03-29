import { createContext, useContext } from "react";
import { AppCore } from "../../core/AppCore";

export const AppCoreContext = createContext<AppCore | undefined>(undefined);

export const useAppCore = () => {
	const appCore = useContext(AppCoreContext);
	if (!appCore) {
		throw new Error("must be used within AppCoreContext");
	}
	return appCore;
};

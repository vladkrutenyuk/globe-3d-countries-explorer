import { useCallback, useEffect, useState } from "react";
import { useAppCore } from "../app-core/AppCoreContext";

export const useSelectedGlobeCountryId = () => {
	const appCore = useAppCore();
	const [selected, _setSelected] = useState(appCore.globe.getSelectedCountry());

	useEffect(() => {
		const onSelection = (id: string | null) => {
			_setSelected(id);
		};
		appCore.globe.on("selection", onSelection);

		return () => {
			appCore.globe.off("selection", onSelection);
		};
	}, [appCore]);

	const select = useCallback(
		(id: string | null) => {
			appCore.globe.selectCountry(id);
		},
		[appCore]
	);

	return [selected, select] as const;
};

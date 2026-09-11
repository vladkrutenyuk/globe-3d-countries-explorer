import van, { type StateView } from "vanjs-core";
import type { ReadableAtom } from "nanostores";

/** `van.state` mirroring a nanostores store. For UI living as long as the app */
export const storeState = <T>(store: ReadableAtom<T>): StateView<T> => {
	const state = van.state(store.get());
	store.listen((value) => {
		state.val = value;
	});
	return state;
};

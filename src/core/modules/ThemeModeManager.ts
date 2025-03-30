import { CoreContextModule } from "@vladkrutenyuk/three-kvy-core";

export class ThemeModeManager extends CoreContextModule<{ change: [isDark: boolean] }> {
	private _isDark: boolean;

	public get isDark() {
		return this._isDark;
	}
	constructor(isDark: boolean) {
		super();
		this._isDark = isDark;
	}

	set(isDark: boolean) {
		this._isDark = isDark;
		this.emit("change", isDark);
	}

	toggle() {
		this.set(!this._isDark);
	}

	watch(listener: (isDark: boolean) => void) {
		this.on("change", listener);
		listener(this._isDark);

		return () => {
			this.off("change", listener);
		};
	}
}

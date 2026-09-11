import van from "vanjs-core";
import { createElement, Moon, Sun } from "lucide";
import type { AppCore } from "@/core/AppCore";

const { button } = van.tags;

const DARK_CLASS = "dark";

export const ThemeSwitchButton = (appCore: AppCore) => {
	const isDark = van.state(document.documentElement.classList.contains(DARK_CLASS));

	van.derive(() => {
		document.documentElement.classList.toggle(DARK_CLASS, isDark.val);
		appCore.ctx.modules.themeMode.set(isDark.val);
	});

	return button(
		{
			class: "btn btn-ghost btn-icon theme-switch",
			onclick: () => {
				isDark.val = !isDark.val;
			},
		},
		() => createElement(isDark.val ? Moon : Sun)
	);
};

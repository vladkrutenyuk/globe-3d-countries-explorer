import van from "vanjs-core";
import { createElement, Moon, Sun } from "lucide";
import { storeState } from "@/shared/lib/storeState";
import { $isDark } from "@/stores";

const { button } = van.tags;

export const ThemeSwitchButton = () => {
	const isDark = storeState($isDark);

	$isDark.subscribe((dark) => {
		document.documentElement.classList.toggle("dark", dark);
	});

	return button(
		{
			class: "btn btn-ghost btn-icon theme-switch",
			onclick: () => $isDark.set(!$isDark.get()),
		},
		() => createElement(isDark.val ? Moon : Sun)
	);
};

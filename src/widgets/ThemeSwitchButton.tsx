"use client";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/shared/shadcn/components/ui/button";
import { useAppCore } from "@/features/app-core/AppCoreContext";

const className = "dark";

export const ThemeSwitchButton: FC<Omit<HTMLAttributes<HTMLButtonElement>, "onClick">> = (props) => {
	const [isDark, setIsDark] = useState(false);
	const appCore = useAppCore();

	useEffect(() => {
		appCore.ctx.modules.themeMode.set(isDark);
	}, [appCore, isDark])

	useEffect(() => {
		setIsDark(document.documentElement.classList.contains(className));
	}, []);

	const toggleTheme = () => {
		const isNowDark = document.documentElement.classList.toggle(className);
		setIsDark(isNowDark);
	};

	return (
		<Button variant="ghost" size="icon" {...props} onClick={toggleTheme} >
			{isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
		</Button>
	);
};

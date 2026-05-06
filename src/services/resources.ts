import { hideAsync } from "expo-splash-screen";
import { useEffect, useState } from "react";

import { LoadFontsTask, Task } from "../app/app-loading.component";

import { AppStorage } from "./app-storage.service";
import { Mapping, Theme } from "./theme.service";

export const defaultConfig: { mapping: Mapping; theme: Theme } = {
	mapping: "eva",
	theme: "light",
};

const loadingTasks = [
	AppStorage.getMapping(defaultConfig.mapping).then(result => ["mapping", result]),
	AppStorage.getTheme(defaultConfig.theme).then(result => ["theme", result]),
	LoadFontsTask({
		"opensans-regular": require("../assets/fonts/opensans-regular.ttf"),
		"roboto-regular": require("../assets/fonts/roboto-regular.ttf"),
		"great-vibes-regular": require("../assets/fonts/great-vibes-regular.ttf"),
		"italianno-regular": require("../assets/fonts/italianno-regular.ttf"),
		
	}),
];

export const useCachedResources = () => {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		Promise.all(loadingTasks).then(() => {
			setReady(true);
			hideAsync();
		});
	}, []);

	return ready;
};

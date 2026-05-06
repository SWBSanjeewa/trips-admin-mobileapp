import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React from "react";

import { Task, TaskResult } from "./app-loading.component";

export interface ApplicationLoaderProps<LoadableConfiguration = any> {
	tasks?: Task[];
	initialConfig?: LoadableConfiguration;
	placeholder?: (props: { loading: boolean }) => React.ReactElement;
	children: (config: LoadableConfiguration) => React.ReactElement;
}

export const LoadFontsTask = (fonts: { [key: string]: number }): Promise<TaskResult> => {
	return Font.loadAsync(fonts).then(() => null);
};

export const LoadAssetsTask = (assets: number[]): Promise<TaskResult> => {
	const tasks: Promise<void>[] = assets.map((source: number): Promise<void> => {
		return Asset.fromModule(source).downloadAsync().then();
	});

	return Promise.all(tasks).then(() => null);
};

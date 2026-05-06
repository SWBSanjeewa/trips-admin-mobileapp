import * as ExpoComponent from "./app-loading.component.expo";

export type TaskResult<T = any> = [string, T];
export type Task = () => Promise<TaskResult | null>;

export const LoadFontsTask = ExpoComponent.LoadFontsTask;

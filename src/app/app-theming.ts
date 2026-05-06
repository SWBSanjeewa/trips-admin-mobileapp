import * as eva from "@eva-design/eva";
import * as material from "@eva-design/material";

import { default as customEva } from "./app-mapping-eva.json";
import { default as customMaterial } from "./app-mapping-material.json";
import { default as appTheme } from "./app-theme.json";

import { default as customEvaRoutes } from "./light.json";

export const appMappings = {
	eva: {
		mapping: eva.mapping,
		customMapping: customEva,
	},
	material: {
		mapping: material.mapping,
		customMapping: customMaterial,
	},
};

export const appThemes = {
	eva: {
		brand: {
			light: appTheme,
			dark: appTheme,
		},
		light: customEvaRoutes,
		dark: eva.dark,
	},
	material: {
		light: material.light,
		dark: material.dark,
		brand: {
			light: {},
			dark: {},
		},
	},
};

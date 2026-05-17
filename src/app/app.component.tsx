import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { preventAutoHideAsync } from "expo-splash-screen";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SplashImage } from "../components/splash-image.component";
import { StatusBar } from "../components/status-bar.component";
import { AppNavigator } from "../navigation/app.navigator";
import { defaultConfig, useCachedResources } from "../services/resources";
import { Mapping, Theme, Theming } from "../services/theme.service";

import { AppIconsPack } from "./app-icons-pack";
import { appMappings, appThemes } from "./app-theming";

import { Provider } from 'mobx-react';

import AppStore from '../store/AppStore';


import { useProvider, useCreateStore } from "mobx-store-provider";
import FlashMessage from "react-native-flash-message";

import { CacheManager } from '@georstat/react-native-image-cache';
import { Dirs } from 'react-native-file-access';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

preventAutoHideAsync();

const App: React.FC<{ mapping: Mapping; theme: Theme }> = ({ mapping, theme }) => {

	const appStore = useCreateStore(AppStore, { });
	

	// Get the Provider for the AppStore
	//const Provider = useProvider(NewBusStore,AppStore);
	const Provider = useProvider(AppStore);

	const loaded = useCachedResources();

	const [mappingContext, currentMapping] = Theming.useMapping(appMappings, mapping);
	const [themeContext, currentTheme] = Theming.useTheming(appThemes, mapping, theme);

	CacheManager.config = {
		baseDir: `${Dirs.CacheDir}/images_cache/`,
		blurRadius: 15,
		cacheLimit: 0,
		maxRetries: 3 /* optional, if not provided defaults to 0 */,
		retryDelay: 3000 /* in milliseconds, optional, if not provided defaults to 0 */,
		sourceAnimationDuration: 1000,
		thumbnailAnimationDuration: 1000,
	  };

	if (!loaded) {
		return <Splash loading />;
	}

	return (
		<GestureHandlerRootView>
			<AutocompleteDropdownContextProvider>
			<Provider value={appStore}>
			<React.Fragment>
				<IconRegistry icons={[ AppIconsPack]} />
				<ApplicationProvider {...currentMapping} theme={currentTheme}>
					
					<Theming.MappingContext.Provider value={mappingContext}>
						<Theming.ThemeContext.Provider value={themeContext}>
							<SafeAreaProvider>
								<StatusBar />
								<AppNavigator />
							</SafeAreaProvider>
						</Theming.ThemeContext.Provider>
					</Theming.MappingContext.Provider>
				</ApplicationProvider>
				<FlashMessage position="top" />
			</React.Fragment>
			</Provider>
			</AutocompleteDropdownContextProvider>
			
		</GestureHandlerRootView>
	);
};

const Splash = ({ loading }): React.ReactElement => (
	<SplashImage loading={loading} source={require("../assets/images/image-splash.png")} />
);

export default (): React.ReactElement => <App {...defaultConfig} />;
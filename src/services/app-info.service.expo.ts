import Constants from "expo-constants";
import { Platform } from "react-native";

export class AppInfoService {
	static getVersion = (): string => {
		return Constants.manifest.version;
	};

	static getBuildNumber = (): string => {
		return Platform.select({
			ios: Constants.manifest.ios.buildNumber,
			android: Constants.manifest.android.versionCode + "",
			web: "",
		});
	};
}

import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { SpinnerShowcase } from "./spinner-showcase.component";
import { spinnerSettings, spinnerShowcase } from "./type";

export const SpinnerScreen = ({ navigation }): React.ReactElement => (
	<ShowcaseContainer
		showcase={spinnerShowcase}
		settings={spinnerSettings}
		renderItem={SpinnerShowcase}
		onBackPress={navigation.goBack}
	/>
);

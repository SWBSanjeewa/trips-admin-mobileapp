import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { ButtonShowcase } from "./button-showcase.component";
import { buttonSettings, buttonShowcase } from "./type";

export const ButtonScreen = ({ navigation }): React.ReactElement => (
	<ShowcaseContainer
		showcase={buttonShowcase}
		settings={buttonSettings}
		renderItem={ButtonShowcase}
		onBackPress={navigation.goBack}
	/>
);

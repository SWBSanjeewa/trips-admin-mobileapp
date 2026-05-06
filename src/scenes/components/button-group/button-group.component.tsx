import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { ButtonGroupShowcase } from "./button-group-showcase.component";
import { buttonGroupSettings, buttonGroupShowcase } from "./type";

export const ButtonGroupScreen = ({ navigation }): React.ReactElement => (
	<ShowcaseContainer
		showcase={buttonGroupShowcase}
		settings={buttonGroupSettings}
		renderItem={ButtonGroupShowcase}
		onBackPress={navigation.goBack}
	/>
);

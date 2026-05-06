import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { TextShowcase } from "./text-showcase.component";
import { textSettings, textShowcase } from "./type";

export const TextScreen = ({ navigation }): React.ReactElement => (
	<ShowcaseContainer
		showcase={textShowcase}
		settings={textSettings}
		renderItem={TextShowcase}
		onBackPress={navigation.goBack}
	/>
);

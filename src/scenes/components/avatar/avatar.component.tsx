import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { AvatarShowcase } from "./avatar-showcase.component";
import { avatarShowcase } from "./type";

export const AvatarScreen = ({ navigation }): React.ReactElement => (
	<ShowcaseContainer
		showcase={avatarShowcase}
		renderItem={AvatarShowcase}
		onBackPress={navigation.goBack}
	/>
);

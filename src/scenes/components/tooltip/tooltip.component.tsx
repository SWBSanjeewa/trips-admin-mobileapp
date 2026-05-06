import { TooltipElement, TooltipProps } from "@ui-kitten/components";
import React from "react";

import { ShowcaseContainer } from "../../../components/showcase-container.component";

import { TooltipShowcase } from "./tooltip-showcase.component";
import { tooltipSettings, tooltipShowcase } from "./type";

export const TooltipScreen = ({ navigation }): React.ReactElement => {
	const renderItem = (props: TooltipProps): TooltipElement => <TooltipShowcase {...props} />;

	return (
		<ShowcaseContainer
			showcase={tooltipShowcase}
			settings={tooltipSettings}
			renderItem={renderItem}
			onBackPress={() => navigation.goBack()}
		/>
	);
};

import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";

export const ArrowHeadUpIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="arrowhead-up" />
);

export const ArrowHeadDownIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="arrowhead-down" />
);

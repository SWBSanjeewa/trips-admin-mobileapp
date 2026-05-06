import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";

export const ClockIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="clock-outline" />
);

export const HeartIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="heart-outline" />
);

export const PlusIcon = (style: ImageStyle): IconElement => <Icon {...style} name="plus" />;

export const ShareIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="share-outline" />
);

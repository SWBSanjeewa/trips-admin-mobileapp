import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";

export const HeartIcon = (style: ImageStyle): IconElement => <Icon {...style} name="heart" />;

export const MessageCircleIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="message-circle-outline" />
);

export const MoreHorizontalIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="more-horizontal" />
);

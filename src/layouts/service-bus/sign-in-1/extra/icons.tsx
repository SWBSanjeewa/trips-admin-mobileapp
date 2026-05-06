import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";

export const ArrowForwardIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="arrow-forward-outline" />
);

export const GoogleIcon = (style: ImageStyle): IconElement => <Icon {...style} name="google" />;

export const FacebookIcon = (style: ImageStyle): IconElement => <Icon {...style} name="facebook" />;

export const TwitterIcon = (style: ImageStyle): IconElement => <Icon {...style} name="twitter" />;

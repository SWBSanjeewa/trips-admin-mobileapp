import { Avatar, AvatarElement, AvatarProps } from "@ui-kitten/components";
import React from "react";

export const AvatarShowcase = (props?: AvatarProps): AvatarElement => (
	<Avatar {...props} source={require("../../../assets/images/image-app-icon.png")} />
);

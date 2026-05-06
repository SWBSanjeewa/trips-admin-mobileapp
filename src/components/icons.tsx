import { Icon, IconElement } from "@ui-kitten/components";
import React from "react";
import { ImageStyle } from "react-native";
import {
	MaterialIcons as MDIcon,
} from '@expo/vector-icons';

import Ionicons from '@expo/vector-icons/Ionicons';

import AntDesign from '@expo/vector-icons/AntDesign';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import Entypo from '@expo/vector-icons/Entypo';

import Feather from '@expo/vector-icons/Feather';



export const HomeOutlineIcon = (style: ImageStyle): IconElement => (
	<Ionicons name="home" size={24} color="black" />
);

export const PersonOutlineIcon = (style: ImageStyle): IconElement => (
	<Ionicons name="person-outline" size={24} color="black" />
);

export const CheckmarkOutlineIcon = (style: ImageStyle): IconElement => (
	<Ionicons name="checkmark" size={24} color="#142169" />
);

export const PlusOutlineIcon = (style: ImageStyle): IconElement => (
	<AntDesign name="plus" size={24} color="#142169" />
);

export const RefreshIcon = (style: ImageStyle): IconElement => (
	<Feather name="refresh-cw" size={20} color="#142169" />
);

export const BusSearchIcon = (style: ImageStyle): IconElement => (
	<Ionicons name="search-outline" size={24} color="#142169" />
);

export const ArrowIosBackIcon = (style: ImageStyle): IconElement => (
	<Ionicons name="arrow-back" size={24} color="black" />
);

export const ArrowIosForwardIcon = (style: ImageStyle): IconElement => (
	<MDIcon name="arrow-ios-forward"/>
);

export const PersonIcon = (style: ImageStyle): IconElement => (
	<FontAwesome6 name="person" size={24} color="black" />
);

export const MobileIcon = (style: ImageStyle): IconElement => (
	<Entypo name="mobile" size={24} color="black" />
);


export const BookIcon = (style: ImageStyle): IconElement => <Icon {...style} name="book" />;

export const BookmarkIcon = (style: ImageStyle): IconElement => <Icon {...style} name="bookmark" />;

export const BookmarkOutlineIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="bookmark-outline" />
);

export const ColorPaletteIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="color-palette-outline" />
);

export const CloseIcon = (style: ImageStyle): IconElement => <Icon {...style} name="close" />;

export const GithubIcon = (style: ImageStyle): IconElement => <Icon {...style} name="github" />;

export const GridIcon = (style: ImageStyle): IconElement => <Icon {...style} name="grid-outline" />;

export const LayoutIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="layout-outline" />
);

export const ListIcon = (style: ImageStyle): IconElement => <Icon {...style} name="list" />;

export const MenuIcon = (style: ImageStyle): IconElement => <Icon {...style} name="menu" />;

export const MoreVerticalIcon = (style: ImageStyle): IconElement => (
	<MaterialIcons name="more-vert" size={24} color="black" />
);

export const SearchIcon = (style: ImageStyle): IconElement => <Icon {...style} name="search" />;

export const SettingsIcon = (style: ImageStyle): IconElement => <Icon {...style} name="settings" />;

export const StarIcon = (style: ImageStyle): IconElement => <Icon {...style} name="star" />;

export const StarOutlineIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} name="star-outline" />
);

export const TrashIcon = (style: ImageStyle): IconElement => <Icon {...style} name="trash" />;

export const AssetAuthIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="auth" />
);

export const AssetAuthDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="auth-dark" />
);

export const AssetSocialIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="social" />
);

export const AssetSocialDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="social-dark" />
);

export const AssetArticlesIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="articles" />
);

export const AssetArticlesDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="articles-dark" />
);

export const AssetMessagingIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="messaging" />
);

export const AssetMessagingDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="messaging-dark" />
);

export const AssetDashboardsIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="dashboards" />
);

export const AssetDashboardsDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="dashboards-dark" />
);

export const AssetEcommerceIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="ecommerce" />
);

export const AssetEcommerceDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="ecommerce-dark" />
);

export const AssetAutocompleteIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="autocomplete" />
);

export const AssetAutocompleteDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="autocomplete-dark" />
);

export const AssetAvatarIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="avatar" />
);

export const AssetAvatarDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="avatar-dark" />
);

export const AssetBottomNavigationIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="bottom-navigation" />
);

export const AssetBottomNavigationDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="bottom-navigation-dark" />
);

export const AssetButtonIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="button" />
);

export const AssetButtonDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="button-dark" />
);

export const AssetButtonGroupIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="button-group" />
);

export const AssetButtonGroupDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="button-group-dark" />
);

export const AssetCalendarIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="calendar" />
);

export const AssetCalendarDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="calendar-dark" />
);

export const AssetCardIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="card" />
);

export const AssetCardDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="card-dark" />
);

export const AssetCheckBoxIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="check-box" />
);

export const AssetCheckBoxDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="check-box-dark" />
);

export const AssetDatepickerIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="datepicker" />
);

export const AssetDatepickerDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="datepicker-dark" />
);

export const AssetDrawerIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="drawer" />
);

export const AssetDrawerDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="drawer-dark" />
);

export const AssetIconIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="icon" />
);

export const AssetIconDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="icon-dark" />
);

export const AssetInputIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="input" />
);

export const AssetInputDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="input-dark" />
);

export const AssetListIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="list" />
);

export const AssetListDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="list-dark" />
);

export const AssetMenuIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="menu" />
);

export const AssetMenuDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="menu-dark" />
);

export const AssetModalIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="modal" />
);

export const AssetModalDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="modal-dark" />
);

export const AssetOverflowMenuIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="overflow-menu" />
);

export const AssetOverflowMenuDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="overflow-menu-dark" />
);

export const AssetPopoverIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="popover" />
);

export const AssetPopoverDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="popover-dark" />
);

export const AssetRadioIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="radio" />
);

export const AssetRadioDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="radio-dark" />
);

export const AssetSelectIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="select" />
);

export const AssetSelectDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="select-dark" />
);

export const AssetSpinnerIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="spinner" />
);

export const AssetSpinnerDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="spinner-dark" />
);

export const AssetTabViewIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="tab-view" />
);

export const AssetTabViewDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="tab-view-dark" />
);

export const AssetTextIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="text" />
);

export const AssetTextDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="text-dark" />
);

export const AssetToggleIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="toggle" />
);

export const AssetToggleDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="toggle-dark" />
);

export const AssetTooltipIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="tooltip" />
);

export const AssetTooltipDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="tooltip-dark" />
);

export const AssetTopNavigationIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="top-navigation" />
);

export const AssetTopNavigationDarkIcon = (style: ImageStyle): IconElement => (
	<Icon {...style} pack="app" name="top-navigation-dark" />
);

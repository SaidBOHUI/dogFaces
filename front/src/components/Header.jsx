import * as React from "react";
import PropTypes from "prop-types";
import {
	AppBar,
	Box,
	CssBaseline,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Toolbar,
	Typography,
	Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import logo from "../assets/dogLogo.svg";
// import logo from "../assets/dogLogo.webp";
import { useNavigate } from "react-router-dom"; // Utiliser useNavigate à la place de Navigate

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact"];

const Header = (props) => {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const navigate = useNavigate(); // Utiliser useNavigate ici

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
			<Typography variant="h6" sx={{ my: 2 }}>
				MUI
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item} disablePadding>
						<ListItemButton sx={{ textAlign: "center" }}>
							<ListItemText primary={item} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			{/* <AppBar component="nav" sx={{ backgroundColor: "#660C0B" }}> */}
			<AppBar
				component="nav"
				sx={{
					backgroundColor: "#EBC5A1",
					height: "56px",
					padding: 0,
					zIndex: 1000,
				}}
			>
				<Toolbar sx={{ minHeight: "56px", padding: "0 16px" }}>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
					<Box sx={{ flexGrow: 1 }}>
						<img
							src={logo}
							alt="logo"
							style={{ height: "30px", marginRight: "16px" }}
						/>
					</Box>
				</Toolbar>
			</AppBar>
			<nav>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					{drawer}
				</Drawer>
			</nav>
		</Box>
	);
};

Header.propTypes = {
	window: PropTypes.func,
};

export default Header;

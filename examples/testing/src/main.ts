import "./style.css";
import "@brytdesigns/web-component-keen-slider";
import "@brytdesigns/web-component-keen-slider/styles.css";
import "@brytdesigns/web-component-keen-slider-auto-switch";
import "@brytdesigns/web-component-keen-slider-autoplay";
import "@brytdesigns/web-component-keen-slider-navigation-arrows";
import "@brytdesigns/web-component-keen-slider-navigation-dots";
import "@brytdesigns/web-component-keen-slider-scrollbar";
import "@brytdesigns/web-component-keen-slider-scrollbar/styles.css";
import "@brytdesigns/web-component-parallax";
import "@brytdesigns/web-component-drawer";

// Ensure drawer trigger can access the drawer context even if it's added later
const button = document.getElementById("drawerButton");

const drawerTrigger = document.createElement("drawer-trigger");

drawerTrigger.setAttribute("target", "#testDrawer");
drawerTrigger.setAttribute("on", "click");
drawerTrigger.setAttribute("action", "toggle");

const buttonClone = button?.cloneNode(true);

drawerTrigger.appendChild(buttonClone!);

setTimeout(() => {
  button?.replaceWith(drawerTrigger);
}, 5000);

import type * as Main from "resource:///org/gnome/shell/ui/main.js";
import type {
  PopupDummyMenu,
  PopupMenu,
} from "resource:///org/gnome/shell/ui/popupMenu.js";
import {
  PopupMenuItem,
  PopupSeparatorMenuItem,
  PopupBaseMenuItem,
} from "resource:///org/gnome/shell/ui/popupMenu.js";
import St from "gi://St";
import Clutter from "gi://Clutter";
import type { BrowserProfiles } from "./digging.helper";
import { openFirefoxProfile } from "./runner.helper";

/**
 * Populate the menu with Firefox profiles.
 *
 * This method can be used also to refresh the menu.
 * It clears the existing menu items and adds new ones.
 *
 * @param {MenuOptions} options - Options for creating the menu.
 */
export function fillMenu({
  title,
  menu,
  profiles,
  notify,
  onRefresh,
}: {
  title: string;
  menu: PopupMenu | PopupDummyMenu;
  profiles: Array<BrowserProfiles>;
  notify: typeof Main.notify;
  onRefresh?: () => void;
}): void {
  // Clear existing menu items
  if ("removeAll" in menu) {
    menu.removeAll();
  }

  // Populate the menu with profiles
  if ("addMenuItem" in menu) {
    fillProfilesInMenu(menu, profiles, title, notify);
    addActionsToMenu(menu, onRefresh);
  }
}

/**
 * Fill the menu with browser profiles sections.
 *
 * @param menu - The popup menu to fill.
 * @param profiles - Array of browser profiles.
 * @param title - The extension title (for notifications).
 * @param notify - GNOME Shell notification function.
 */
function fillProfilesInMenu(
  menu: PopupMenu | PopupDummyMenu,
  profiles: Array<BrowserProfiles>,
  title: string,
  notify: typeof Main.notify,
): void {
  if (!("addMenuItem" in menu)) {
    return;
  }

  // No profiles found
  if (profiles.length === 0) {
    menu.addMenuItem(new PopupMenuItem("No profiles found", { reactive: false }));
    return;
  }

  profiles.forEach((browser) => {
    const section = new PopupSeparatorMenuItem(browser.label);
    menu.addMenuItem(section);

    browser.profiles.forEach((profile) => {
      const item = new PopupMenuItem(profile);
      item.connect("activate", () =>
        openFirefoxProfile({
          command: browser.command,
          profile,
          title,
          notify,
        }),
      );
      menu.addMenuItem(item);
    });
  });
}

/**
 * Add action buttons (icons) at the end of the menu.
 *
 * @param menu - The popup menu to add actions to.
 * @param onRefresh - Optional callback to trigger when refresh button is clicked.
 */
function addActionsToMenu(
  menu: PopupMenu | PopupDummyMenu,
  onRefresh?: () => void,
): void {
  if (!("addMenuItem" in menu)) {
    return;
  }

  // Create a box for action icons
  const iconBox = new St.BoxLayout({
    vertical: false,
    x_expand: true,
    x_align: Clutter.ActorAlign.END,
  });

  let hasActions = false;

  // Add refresh button only if onRefresh is provided
  if (onRefresh) {
    const refreshButton = new St.Button({
      style_class: "system-menu-action",
      child: new St.Icon({
        icon_name: "view-refresh-symbolic",
        icon_size: 16,
      }),
    });

    refreshButton.connect("clicked", () => {
      onRefresh();
    });

    iconBox.add_child(refreshButton);
    hasActions = true;
  }

  // If no actions to show, do not add an empty item
  if (!hasActions) {
    return;
  }

  // Create menu item for actions
  const actionItem = new PopupBaseMenuItem();
  if ("actor" in actionItem) {
    actionItem.actor.add_child(iconBox);
  }
  menu.addMenuItem(actionItem);
}

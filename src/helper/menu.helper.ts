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
}: {
  title: string;
  menu: PopupMenu | PopupDummyMenu;
  profiles: Array<BrowserProfiles>;
  notify: typeof Main.notify;
}): void {
  // Clear existing menu items
  if ("removeAll" in menu) {
    menu.removeAll();
  }

  // Populate the menu with profiles
  if ("addMenuItem" in menu) {
    fillProfilesInMenu(menu, profiles, title, notify);
    addActionsToMenu(menu);
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
 */
function addActionsToMenu(menu: PopupMenu | PopupDummyMenu): void {
  if (!("addMenuItem" in menu)) {
    return;
  }

  // Create a box for action icons
  const iconBox = new St.BoxLayout({
    vertical: false,
    x_expand: true,
    x_align: Clutter.ActorAlign.END,
  });

  // Refresh button
  const refreshButton = new St.Button({
    style_class: "system-menu-action",
    child: new St.Icon({
      icon_name: "view-refresh-symbolic",
      icon_size: 16,
    }),
  });

  refreshButton.connect("clicked", () => {
    // TODO: Trigger menu refresh (reload profiles)
  });

  iconBox.add_child(refreshButton);

  // Create menu item for actions
  const actionItem = new PopupBaseMenuItem();
  if ("actor" in actionItem) {
    actionItem.actor.add_child(iconBox);
  }
  menu.addMenuItem(actionItem);
}

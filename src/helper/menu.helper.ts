import type * as Main from "resource:///org/gnome/shell/ui/main.js";
import type {
  PopupDummyMenu,
  PopupMenu,
} from "resource:///org/gnome/shell/ui/popupMenu.js";
import {
  PopupMenuItem,
  PopupSeparatorMenuItem,
} from "resource:///org/gnome/shell/ui/popupMenu.js";
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
}

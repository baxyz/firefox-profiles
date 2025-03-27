import St from 'gi://St';
import type * as Main from 'resource:///org/gnome/shell/ui/main.js';
import type { PopupDummyMenu, PopupMenu } from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { PopupMenuItem, PopupSeparatorMenuItem } from 'resource:///org/gnome/shell/ui/popupMenu.js';
import type { BrowserProfiles } from './digging.helper';
import { openFirefoxProfile } from './runner.helper';

/**
 * Creates a menu for Firefox profiles.
 * 
 * @param {MenuOptions} options - Options for creating the menu.
 */
export function createMenu({ title, menu, profiles, notify }: {
  title: string;
  menu: PopupMenu | PopupDummyMenu;
  profiles: Array<BrowserProfiles>;
  notify: typeof Main.notify;
}): void {

  // Add the Firefox icon
  menu.actor.add_child(new St.Icon({
    icon_name: 'firefox-symbolic', // white version of the Firefox icon
    style_class: 'system-status-icon',
  }));

  // Populate the menu with profiles
  if ("addMenuItem" in menu) {
    profiles.forEach(browser => {
      const section = new PopupSeparatorMenuItem(browser.label);
      menu.addMenuItem(section);

      browser.profiles.forEach(profile => {
        const item = new PopupMenuItem(profile);
        item.connect('activate', () => openFirefoxProfile({
          command: browser.command,
          profile,
          title,
          notify,
        }));
        menu.addMenuItem(item);
      });
    })
  }
}
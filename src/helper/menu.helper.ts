import St from 'gi://St';
import { PopupMenu, PopupMenuItem, PopupDummyMenu } from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import type { getFirefoxProfiles } from './digging.helper';
import { openFirefoxProfile } from './runner.helper';

/**
 * Creates a menu for Firefox profiles.
 * 
 * @param {MenuOptions} options - Options for creating the menu.
 */
export function createMenu({ title, menu, profiles }: {
  title: string;
  menu: PopupMenu | PopupDummyMenu;
  profiles: ReturnType<typeof getFirefoxProfiles>;
}): void {

  // Add the Firefox icon
  menu.actor.add_child(new St.Icon({
    icon_name: 'firefox-symbolic', // white version of the Firefox icon
    style_class: 'system-status-icon',
  }));

  // Populate the menu with profiles
  if ("addMenuItem" in menu) {
    profiles.forEach(profile => {
      const item = new PopupMenuItem(profile);
      item.connect('activate', () => openFirefoxProfile({
        profile,
        title,
        notify: Main.notify,
      }));
      menu.addMenuItem(item);
    });
  }
}
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// -- Extension ----------------------------------------------------------------

/**
 * Main extension that mainly consists of an indicator.
 * 
 * @see FirefoxProfilesIndicator
 */
export default class FirefoxProfilesExtension extends Extension {
  private _indicator?: FirefoxProfilesIndicator;

  enable() {
    this._indicator = new GFirefoxProfilesIndicator(this.metadata.name);
    Main.panel.addToStatusArea(this.uuid, this._indicator);
  }

  disable() {
    if (this._indicator) {
      this._indicator.destroy();
      this._indicator = undefined;
    }
  }
}

// -- Indicator ----------------------------------------------------------------

/**
 * Indicator for Firefox profiles
 */
class FirefoxProfilesIndicator extends PanelMenu.Button {

  /**
   * Shortcut to the menu, well casted
   */
  indicator: PopupMenu.PopupMenu;

  debugIndex = 0;

  constructor(readonly title: string) {
    // 0.0 is the value of menuAlignment
    super(0.0, 'Firefox Profiles');

    // Shortcut to the menu
    this.indicator = this.menu as PopupMenu.PopupMenu;

    this.add_child(new St.Icon({
      icon_name: 'firefox-symbolic', // white version of the Firefox icon
      style_class: 'system-status-icon',
    }));

    getFirefoxProfiles(this.title).forEach(profile => {
      let item = new PopupMenu.PopupMenuItem(profile);
      item.connect('activate', () => openFirefoxProfile(profile, { title: this.title }));
      this.indicator.addMenuItem(item);
    });

    // Build the menu
    this.buildMenu();
  }

  /**
   * Build the menu
   */
  private buildMenu() {

    // -- Dev Mode --
    this.indicator.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this.indicator.addMenuItem(new PopupMenu.PopupMenuItem(`this is dev mode ${++this.debugIndex}`));
  }


  /**
   * Refresh the profiles
   */
  _refreshProfiles() {
    Main.notify(this.title, "Refreshing profiles...");
    this._rebuidMenu();
  }


  /**
  * Rebuild the menu
  */
  _rebuidMenu(): void {
    // Clear the current menu
    this.indicator.removeAll();

    // 
    // -- Button group --
    //
    const refreshButton = new St.Button({
      child: new St.Icon({ icon_name: 'view-refresh-symbolic', style_class: 'popup-menu-icon' }),
      style_class: 'popup-menu-item'
    });
    refreshButton.connect('clicked', () => this._refreshProfiles());

    const buttonBox = new St.BoxLayout({ style_class: 'popup-menu-item' });
    buttonBox.add_child(refreshButton);

    const buttonItem = new PopupMenu.PopupBaseMenuItem({ reactive: false });
    buttonItem.add_child(buttonBox);
    this.indicator.addMenuItem(buttonItem);

    //
    // -- Firefox Profiles --
    //
    getFirefoxProfiles(this.title).sort().forEach(profile => {
      const item = new PopupMenu.PopupMenuItem(profile);
      item.connect('activate', () => openFirefoxProfile(profile, { title: this.title }));
      this.indicator.addMenuItem(item);
    });


    // -- Dev Mode --
    this.indicator.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    this.indicator.addMenuItem(new PopupMenu.PopupMenuItem(`this is dev mode ${++this.debugIndex}`));
  }

}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

// -- Helpers ------------------------------------------------------------------

/**
 * Get Firefox profiles
 * @returns {Array} - Array of Firefox profiles
 */
function getFirefoxProfiles(title: string): string[] {
  const filePaths = [
    GLib.get_home_dir() + '/.mozilla/firefox/profiles.ini',
    GLib.get_home_dir() + '/snap/firefox/common/.mozilla/firefox/profiles.ini' // Edge case for Snap installation
  ];

  const filePath = filePaths.find(path => GLib.file_test(path, GLib.FileTest.EXISTS));

  if (!filePath) {
    Main.notify(title, "Could not find the profiles.ini file.");
    return [];
  }


  const [, fileContent] = GLib.file_get_contents(filePath);
  const content = fileContent.toString();
  const namePattern = /Name=(.*)/g;
  let profiles: string[] = [];
  let match;

  while ((match = namePattern.exec(content)) !== null) {
    profiles.push(match[1]);
  }

  return profiles;
}

/**
 * Open Firefox with a specific profile.
 * 
 * It will call `firefox -P <profile> -no-remote`.
 * 
 * @param {string} profile name of the profile
 */
function openFirefoxProfile(profile: string, { title }: { title: string }): void {
  const command = `firefox -P ${profile} -no-remote`;

  try {
    const success = GLib.spawn_command_line_async(command);

    if (!success) {
      Main.notify(title, `Failed to start Firefox with the "${profile}" profile.`);
    }
  } catch (e: unknown) {
    const message = `An error occurred while launching Firefox with the "${profile}" profile.`;
    logError(e as Object, `[${title}] ${message}`);
    Main.notify(title, message);
  }
}

import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';


const EXTENSION_TITLE = "Firefox Profiles";


// -- Extension ----------------------------------------------------------------

/**
 * Main extension that mainly consists of an indicator.
 * 
 * @see FirefoxProfilesIndicator
 */
export default class FirefoxProfilesExtension extends Extension {
    private _indicator?: FirefoxProfilesIndicator;

    enable() {
        this._indicator = new GFirefoxProfilesIndicator();
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
    constructor() {
        // 0.0 is the value of menuAlignment
        super(0.0, 'Firefox Profiles');

        // Shortcut to the menu
        const menu = this.menu as PopupMenu.PopupMenu;

        this.add_child(new St.Icon({
            icon_name: 'firefox-symbolic', // white version of the Firefox icon
            style_class: 'system-status-icon',
        }));

        getFirefoxProfiles().forEach(profile => {
            let item = new PopupMenu.PopupMenuItem(profile);
            item.connect('activate', () => openFirefoxProfile(profile));
            menu.addMenuItem(item);
        });
    }
}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

// -- Helpers ------------------------------------------------------------------

/**
 * Get Firefox profiles
 * @returns {Array} - Array of Firefox profiles
 */
function getFirefoxProfiles(): string[] {
    let filePath = GLib.get_home_dir() + '/.mozilla/firefox/profiles.ini';
    let fileContent = GLib.file_get_contents(filePath)[1];
    let content = fileContent.toString();
    let namePattern = /Name=(.*)/g;
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
function openFirefoxProfile(profile: string): void {
    const command = `firefox -P ${profile} -no-remote`;

    try {
        const success = GLib.spawn_command_line_async(command);

        if (!success) {
            Main.notify(EXTENSION_TITLE, `Failed to start Firefox with the "${profile}" profile.`);
        }
    } catch (e: unknown) {
        const message = `An error occurred while launching Firefox with the "${profile}" profile.`;
        logError(e as Object, `[${EXTENSION_TITLE}] ${message}`);
        Main.notify(EXTENSION_TITLE, message);
    }
}

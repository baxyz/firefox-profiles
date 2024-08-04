import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const FIREFOX_PATH: string | null = findFirefoxPath();

export default class FirefoxProfilesExtension extends Extension {
    private _indicator?: FirefoxProfilesIndicator;
    private _launcher?: Gio.SubprocessLauncher;

    enable() {
        this._indicator = new GFirefoxProfilesIndicator(() => (this._launcher!));
        this._launcher = new Gio.SubprocessLauncher({
            flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
        });
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = undefined;
        }
        this._launcher = undefined;
    }
}

// -- Indicator --


class FirefoxProfilesIndicator extends PanelMenu.Button {
    constructor(getLauncher: () => Gio.SubprocessLauncher) {
        // 0.0 est la valeur de menuAlignment
        super(0.0, 'Firefox Profiles');

        // Shortcut to the menu
        const menu = this.menu as PopupMenu.PopupMenu;

        this.add_child(new St.Icon({
            icon_name: 'firefox-symbolic', // white version of the Firefox icon
            style_class: 'system-status-icon',
        }));

        getFirefoxProfiles().forEach(profile => {
            let item = new PopupMenu.PopupMenuItem(profile);
            item.connect('activate', () => {
                openFirefoxProfile2(getLauncher() , profile);
            });
            menu.addMenuItem(item);
        });
    }
}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

// -- Helpers --

/**
 * Find the path to the Firefox executable.
 * 
 * @returns {string|null} The path to Firefox or null if not found.
 */
function findFirefoxPath() {
    try {
        let [success, stdout, stderr, exitStatus] = GLib.spawn_command_line_sync('which firefox');
        if (success && exitStatus === 0 && stdout) {
            return stdout.toString().trim();
        }
    } catch (e) {
        logError(e);
    }
    return null;
}

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
function openFirefoxProfile(launcher: Gio.SubprocessLauncher, profile: string): void {
    if (FIREFOX_PATH === null) {
        logError('Firefox executable not found.');
        return;
    }

    GLib.spawn_async(
        null,
        [FIREFOX_PATH, '-P', profile, '-no-remote'],
        null,
        GLib.SpawnFlags.DO_NOT_REAP_CHILD,
        null
    );
}


function openFirefoxProfile2(launcher: Gio.SubprocessLauncher, profile: string): void {
    const command = [`${FIREFOX_PATH} -P ${profile} -no-remote`];

    try {
        const proc = launcher.spawnv(command);
        proc.communicate_utf8_async(null, null, (proc, res) => {
            const [, stdout, stderr] = proc!.communicate_utf8_finish(res);

            if (stdout || stderr) {
                Main.notify("Firefox Profiles", `[${profile}]: ${stdout || stderr}`);
            } else {
                Main.notify("Firefox Profiles", `[${profile}]: completed with exit code: ${proc!.get_exit_status()}`);
            }
        });
    } catch (e: unknown) {
        if (e instanceof GLib.Error) {
            Main.notify("Firefox Profiles", `[${profile}]: ${e.toString().replace("GLib.SpawnError: ", "")}`);
        } else {
            Main.notify("Firefox Profiles", `[${profile}]: An unknown error occurred`);
        }
    }
}





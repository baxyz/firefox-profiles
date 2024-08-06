import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const EXTENSION_TITLE = "Firefox Profiles";

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

// -- Indicator --

class FirefoxProfilesIndicator extends PanelMenu.Button {
    constructor() {
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
            item.connect('activate', () => openFirefoxProfile(profile));
            menu.addMenuItem(item);
        });
    }
}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

// -- Helpers --

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
    const [success, stdout, stderr, r4] = GLib.spawn_command_line_sync(`systemd-run --user --scope firefox -P ${profile} -no-remote`);
    Main.notify(EXTENSION_TITLE, `[${profile}]: success: ${success} -- stdout:  ${String.fromCharCode(...(stdout ?? []))} -- stderr:  ${String.fromCharCode(...(stderr ?? []))} -- r4: ${r4}`);

    /*
    const result = GLib.spawn_command_line_async(`firefox -P ${profile} -no-remote`);
    if (result) {
        Main.notify(EXTENSION_TITLE, `[${profile}]: launched`);
    } else {
        Main.notify(EXTENSION_TITLE, `[${profile}]: failed to start`);
    }
    */
    /*
    GLib.spawn_async(
        null,
        ["systemd-run", "--user", "--scope", "firefox", '-P', profile, '-no-remote'],
        null,
        GLib.SpawnFlags.DO_NOT_REAP_CHILD,
        null
    );
    */
}

function openFirefoxProfile2(profile: string): void {
    // Command to open Firefox with the specified profile using systemd-run
    const command = ["systemd-run", "--user", "--scope", "firefox", "-P", profile, "-no-remote"];

    try {
        const launcher = new Gio.SubprocessLauncher({
            flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
        });
        const subprocess = launcher.spawnv(command);
        subprocess.communicate_utf8_async(null, null, (proc, res) => {
            if (!res || !proc) {
                Main.notify(EXTENSION_TITLE, `[${profile}]: failed to start`);
                return;
            }

            const [, stdout, stderr] = proc.communicate_utf8_finish(res);
            if (stdout) logError(new Error(stdout), `[${profile}]: stdout`);
            if (stderr) logError(new Error(stderr), `[${profile}]: stderr`);

            if (stdout || stderr) {
                Main.notify(EXTENSION_TITLE, `[${profile}]: ${stdout || stderr}`);
            } else {
                Main.notify(EXTENSION_TITLE, `[${profile}]: completed with exit code: ${proc.get_exit_status()}`);
            }
        });
    } catch (e: unknown) {
        logError(e as Object, `[${profile}]: failed to start`);
        if (e instanceof GLib.Error) {
            Main.notify(EXTENSION_TITLE, `[${profile}]: ${e.toString().replace("GLib.SpawnError: ", "")}`);
        } else {
            Main.notify(EXTENSION_TITLE, `[${profile}]: An unknown error occurred`);
        }
    }
}

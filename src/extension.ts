import GObject from 'gi://GObject';
import St from 'gi://St';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { getFirefoxProfiles, openFirefoxProfile } from './helpers';

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
            item.connect('activate', () => {
                openFirefoxProfile(profile);
            });
            menu.addMenuItem(item);
        });
    }
}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

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


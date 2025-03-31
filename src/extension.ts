import GObject from 'gi://GObject';
import St from 'gi://St';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Button } from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { fillMenu, getFirefoxProfiles } from './helper';


// -- Extension ----------------------------------------------------------------

/**
 * Main extension that mainly consists of an indicator.
 * 
 * @see FirefoxProfilesIndicator
 */
export default class FirefoxProfilesExtension extends Extension {
  private _indicator: FirefoxProfilesIndicator | null = null;

  enable() {
    this._indicator = new GFirefoxProfilesIndicator(this.metadata.name);
    Main.panel.addToStatusArea(this.uuid, this._indicator);
  }

  disable() {
    if (this._indicator) {
      this._indicator.destroy();
      this._indicator = null;
    }
  }
}

// -- Indicator ----------------------------------------------------------------

/**
 * Indicator for Firefox profiles
 */
class FirefoxProfilesIndicator extends Button {
  constructor(title: string) {
    // 0.0 is the value of menuAlignment
    super(0.0, title);

    // Get Profiles
    const profiles = getFirefoxProfiles({ title, notify: Main.notify });

    // Add the Firefox icon
    this.add_child(new St.Icon({
      icon_name: 'firefox-symbolic', // white version of the Firefox icon
      style_class: 'system-status-icon',
    }));

    // Create the menu
    // (same method can be used to refresh the menu)
    fillMenu({ title, menu: this.menu, profiles, notify: Main.notify });
  }
}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

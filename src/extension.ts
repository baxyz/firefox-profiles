import GObject from 'gi://GObject';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import { Button } from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { createMenu, getFirefoxProfiles, openFirefoxProfile } from 'helper';


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
class FirefoxProfilesIndicator extends Button {
  constructor(title: string) {
    // 0.0 is the value of menuAlignment
    super(0.0, title);

    // Get Profiles
    const profiles = getFirefoxProfiles({ title });

    // Create the menu
    createMenu({ title, menu: this.menu, profiles });
  }
}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

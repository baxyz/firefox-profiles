import GObject from "gi://GObject";
import St from "gi://St";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Button } from "resource:///org/gnome/shell/ui/panelMenu.js";
import { fillMenu, getFirefoxProfiles } from "./helper";

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
  private title: string;

  constructor(title: string) {
    // 0.0 is the value of menuAlignment
    super(0.0, title);

    this.title = title;

    // Add the Firefox icon
    this.add_child(
      new St.Icon({
        icon_name: "firefox-symbolic", // white version of the Firefox icon
        style_class: "system-status-icon",
      }),
    );

    // Load and display profiles
    this.refreshProfiles();
  }

  /**
   * Refresh the profiles list and update the menu.
   * This is called on initial load and when the refresh button is clicked.
   */
  private refreshProfiles(): void {
    const profiles = getFirefoxProfiles();

    fillMenu({
      title: this.title,
      menu: this.menu,
      profiles,
      notify: Main.notify,
      onRefresh: () => this.refreshProfiles(),
    });
  }
}

const GFirefoxProfilesIndicator = GObject.registerClass(FirefoxProfilesIndicator);

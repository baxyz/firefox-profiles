import GLib from 'gi://GLib';

// Define a constant for the home directory
const HOME_DIR = GLib.get_home_dir();

/**
 * Type definition for the configuration paths.
 */
export type BrowserInfo = {
  /**
   * Title of the browser.
   * Used for the menu's section label.
   */
  label: string;

  /**
   * Path to the configuration file.
   * This is used to find the profiles for the browser.
   * This is an absolute path.
   */
  path: string;

  /**
   * Command to run the browser.
   * This is used to launch the browser with a specific profile.
   */
  command: string;
};

/**
 * List of configuration paths for different browsers.
 * Each object contains the title of the browser, the path to its configuration file,
 * and the command to run it.
 */
export const CONFIG_PATHS: Array<BrowserInfo> = [
  {
    label: 'Firefox',
    path: HOME_DIR + '/.mozilla/firefox/profiles.ini',
    command: 'firefox'
  },
  {
    label: 'Firefox (snap)',
    path: HOME_DIR + '/snap/firefox/common/.mozilla/firefox/profiles.ini',
    command: 'snap run firefox'
  },
  {
    label: 'Firefox (flatpak)',
    path: HOME_DIR + '/.var/app/org.mozilla.firefox/.mozilla/firefox/profiles.ini',
    command: 'flatpak run org.mozilla.firefox'
  },
  {
    label: 'Floorp (flatpak)',
    path: HOME_DIR + '/.var/app/one.ablaze.floorp/.floorp/profiles.ini',
    command: 'flatpak run one.ablaze.floorp'
  },
  {
    label: 'Zen (flatpak)',
    path: HOME_DIR + '/.var/app/app.zen_browser.zen/.zen/profiles.ini',
    command: 'flatpak run app.zen_browser.zen'
  }
];

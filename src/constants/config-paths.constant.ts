import GLib from "gi://GLib";

// Define a constant for the home directory
const HOME_DIR = GLib.get_home_dir();

// XDG Base Directory Specification support
const XDG_CONFIG_HOME = GLib.getenv("XDG_CONFIG_HOME") || HOME_DIR + "/.config";

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
 *
 * The paths are checked in order, so the most specific paths should come first.
 * Supports standard XDG Base Directory locations since Firefox 147.
 */
export const CONFIG_PATHS: Array<BrowserInfo> = [
  // === Firefox (native installations) ===
  {
    label: "Firefox",
    path: XDG_CONFIG_HOME + "/firefox/profiles.ini",
    command: "firefox",
  },
  {
    label: "Firefox (classic)",
    path: HOME_DIR + "/.mozilla/firefox/profiles.ini",
    command: "firefox",
  },

  // === Firefox (flatpak) ===
  {
    label: "Firefox (flatpak)",
    path:
      HOME_DIR + "/.var/app/org.mozilla.firefox/.mozilla/firefox/profiles.ini",
    command: "flatpak run org.mozilla.firefox",
  },

  // === Firefox (snap) ===
  {
    label: "Firefox (snap)",
    path: HOME_DIR + "/snap/firefox/common/.mozilla/firefox/profiles.ini",
    command: "snap run firefox",
  },

  // === Waterfox (Firefox fork) ===
  {
    label: "Waterfox",
    path: XDG_CONFIG_HOME + "/waterfox/profiles.ini",
    command: "waterfox",
  },
  {
    label: "Waterfox (classic)",
    path: HOME_DIR + "/.waterfox/profiles.ini",
    command: "waterfox",
  },

  // === LibreWolf (Privacy-focused Firefox) ===
  {
    label: "LibreWolf",
    path: XDG_CONFIG_HOME + "/librewolf/profiles.ini",
    command: "librewolf",
  },
  {
    label: "LibreWolf (classic)",
    path: HOME_DIR + "/.librewolf/profiles.ini",
    command: "librewolf",
  },

  // === Floorp (Firefox fork) ===
  {
    label: "Floorp",
    path: XDG_CONFIG_HOME + "/floorp/profiles.ini",
    command: "floorp",
  },
  {
    label: "Floorp (classic)",
    path: HOME_DIR + "/.floorp/profiles.ini",
    command: "floorp",
  },
  {
    label: "Floorp (flatpak)",
    path: HOME_DIR + "/.var/app/one.ablaze.floorp/.floorp/profiles.ini",
    command: "flatpak run one.ablaze.floorp",
  },

  // === Zen Browser (Gecko-based) ===
  {
    label: "Zen",
    path: XDG_CONFIG_HOME + "/zen/profiles.ini",
    command: "zen-browser",
  },
  {
    label: "Zen (classic)",
    path: HOME_DIR + "/.zen/profiles.ini",
    command: "zen-browser",
  },
  {
    label: "Zen (flatpak)",
    path: HOME_DIR + "/.var/app/app.zen_browser.zen/.zen/profiles.ini",
    command: "flatpak run app.zen_browser.zen",
  },

  // === IceCat (GNU Firefox) ===
  {
    label: "IceCat",
    path: HOME_DIR + "/.icecat/profiles.ini",
    command: "icecat",
  },

  // === Palemoon (legacy fork) ===
  {
    label: "Palemoon",
    path: HOME_DIR + "/.moonchild productions/pale moon/profiles.ini",
    command: "palemoon",
  },
];

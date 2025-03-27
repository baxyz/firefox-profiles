import GLib from 'gi://GLib';
import type * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { BrowserInfo, CONFIG_PATHS } from '../constants';

/**
 * Type definition for the browser profiles.
 */
export type BrowserProfiles = Pick<BrowserInfo, 'label' | 'command'> & {
  /**
   * List of profile names found in the configuration file.
   */
  profiles: string[];
};

/**
 * Get Firefox profiles
 * @returns {Array} - Array of Firefox profiles
 */
export function getFirefoxProfiles({ title, notify }: {
  title: string;
  notify: typeof Main.notify;
}): Array<BrowserProfiles> {
  // Check if the configuration files exist
  const browsers = CONFIG_PATHS.filter(browser => GLib.file_test(browser.path, GLib.FileTest.EXISTS));

  // If no configuration files exist, show a notification
  if (browsers.length === 0) {
    notify(title, 'No supported browsers found.');
    return [];
  }

  // Check the availability of profiles by browser
  return browsers.map(browser => <BrowserProfiles>{
    ...browser,
    profiles: getProfilesFromConfigFile(browser.path)
  });
}

/**
 * 
 * @param title 
 * @param path 
 * @returns 
 */
function getProfilesFromConfigFile(path: string): string[] {
  let fileContent = GLib.file_get_contents(path)[1];
  let content = fileContent.toString();
  let namePattern = /Name=(.*)/g;
  let profiles: string[] = [];
  let match;

  while ((match = namePattern.exec(content)) !== null) {
    profiles.push(match[1]);
  }

  return profiles;
}

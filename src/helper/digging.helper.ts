import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

/**
 * Get Firefox profiles
 * @returns {Array} - Array of Firefox profiles
 */
export function getFirefoxProfiles({ title }: { title: string }): string[] {
  let filePaths = [
    GLib.get_home_dir() + '/.mozilla/firefox/profiles.ini',
    GLib.get_home_dir() + '/snap/firefox/common/.mozilla/firefox/profiles.ini' // Edge case for Snap installation
  ];

  let filePath = filePaths.find(path => GLib.file_test(path, GLib.FileTest.EXISTS));

  if (!filePath) {
    Main.notify(title, 'Could not find the profiles.ini file.');
    return [];
  }

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

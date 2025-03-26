import GLib from 'gi://GLib';
import type * as Main from 'resource:///org/gnome/shell/ui/main.js';

/**
 * Open Firefox with a specific profile.
 * 
 * It will call `firefox -P <profile> -no-remote`.
 * 
 * @param {string} profile name of the profile
 */
export function openFirefoxProfile({ profile, title, notify }: {
  profile: string;
  title: string;
  notify: typeof Main.notify;
}): void {
  const command = `firefox -P ${profile} -no-remote`;

  try {
    const success = GLib.spawn_command_line_async(command);

    if (!success) {
      notify(title, `Failed to start Firefox with the "${profile}" profile.`);
    }
  } catch (e: unknown) {
    const message = `An error occurred while launching Firefox with the "${profile}" profile.`;
    logError(e as Object, `[${title}] ${message}`);
    notify(title, message);
  }
}
/* Firefox Profiles
 * Copyright (C) 2024 BAXYZ
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


import GLib from 'gi://GLib';

/**
 * Get Firefox profiles
 * @returns {Array} - Array of Firefox profiles
 */
export function getFirefoxProfiles() {
    let filePath = GLib.get_home_dir() + '/.mozilla/firefox/profiles.ini';
    let fileContent = GLib.file_get_contents(filePath)[1];
    let content = fileContent.toString();
    let namePattern = /Name=(.*)/g;
    let profiles = [];
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
export function openFirefoxProfile(profile) {
    GLib.spawn_async(
        null,
        ['firefox', '-P', profile, '-no-remote'],
        null,
        GLib.SpawnFlags.DO_NOT_REAP_CHILD,
        null
    );
}
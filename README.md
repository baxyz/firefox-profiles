# Firefox Profiles

Easily launch Firefox with your favorite profile right from the indicator menu!

Supports Firefox (regular, snap, and flatpak), Floorp (flatpak), and Zen (flatpak).

*Note: This extension is not sponsored, endorsed, or affiliated with Mozilla, Firefox, Floorp, or Zen; it's just pure profile-switching convenience!*

## Description

The **Firefox Profiles** extension allows you to easily launch different Firefox profiles directly from the GNOME indicator menu. This is particularly useful for users who manage multiple Firefox profiles for different tasks or identities.

## Installation

1. Download the extension from the [GNOME Extensions](https://extensions.gnome.org/) website
2. Extract the downloaded file into the GNOME extensions directory

```bash
mkdir -p ~/.local/share/gnome-shell/extensions/firefox-profiles@baxyz.tech
unzip firefox-profiles.zip -d ~/.local/share/gnome-shell/extensions/firefox-profiles@baxyz.tech
```

## Testing Locally

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- [pnpm](https://pnpm.io/) 6 or later

### Compilation

Please have a look to the official documentation on [Build and packaging automation ](https://gjs.guide/extensions/development/typescript.html#build-and-packaging-automation) for more information.

You can run `make` to compile your code and generate the file `extension.js` inside the dist folder. If needed, it will install the dependencies using pnpm install.

`make pack` will generate a file `firefox-profiles.zip` which you can upload for review. It will compile the code and the schema, if needed, and copy the `schemas` folder and the `metadata.json` file into the `dest` folder before zipping it.

`make install` will copy the files to the extensions folder. If you logout and back in it should appear in the Extension Manager app.

Finally, `make clean` removes all generated files.

### Test on Wayland

Follow the official documentation on [testing the extension](https://gjs.guide/extensions/development/creating.html#testing-the-extension). It provides detailed instructions on how to set up and test the extension.

Wayland sessions support running GNOME Shell in window, so an extension can be tested without disrupting the current session.

Start a nested GNOME Shell session:

```bash
dbus-run-session -- gnome-shell --nested --wayland
```

Open a terminal inside the new session and enable the extension    

```bash
gnome-extensions enable firefox-profiles@arnaud.work
```

And to disable it:
```bash
gnome-extensions disable firefox-profiles@arnaud.work
```

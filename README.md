# 🕒 GNOME Pomodoro Extension (Enhanced)

A lightweight, distraction‑free Pomodoro timer for **GNOME Shell**, forked and improved for a more streamlined workflow. This version focuses on simplicity and customization, giving you direct control over your work sessions while stripping away the clutter.

---

## ✨ What’s New in This Fork
Unlike the original project, this version is designed for those who find traditional Pomodoro "break" cycles intrusive.

* **Adjustable Duration:** Set your focus time via an intuitive slider.
* **Minimalist Logic:** Break functionality has been removed—perfect for users who prefer a single‑timer workflow.
* **Optimized UI:** Cleaned-up interface and simplified code for a smoother GNOME Shell experience.

> **Note:** This extension is ideal for a **pure, customizable focus timer** without the rigid constraints of traditional intervals.

---

## 🚀 Features
* **Customizable Sessions:** Adjust duration on the fly.
* **Deep Integration:** Native GNOME Shell look and feel.
* **Desktop Alerts:** Clear notifications when your session is up.
* **Session Counter:** Track how many "deep work" blocks you've completed.
* **Zero Distractions:** No forced breaks—just you and your work.

---

## 📦 Installation

### 1. 🔧 Prerequisites
Ensure you have the necessary tools installed for your distribution:

| Distribution | Command |
| :--- | :--- |
| **Debian / Ubuntu** | `sudo apt install gnome-shell-extension-prefs gnome-shell-extension-tool libglib2.0-bin` |
| **Fedora** | `sudo dnf install glib2 gnome-extensions-app` |
| **Arch Linux** | `sudo pacman -S gnome-shell gnome-extensions-app glib2` |

---

### 2. 📥 Setup
First, clone the repository to your local machine:
```bash
git clone git@github.com:askinward/gnome-pomodoro-extension.git
cd gnome-pomodoro-extension
```
   #### Option A: Quick Install (Script)
The easiest way to install. This script creates the necessary directories, generates the metadata, and moves the files for you:

```bash
chmod +x install_pomodoro.sh
./install_pomodoro.sh
```

   #### Option B: Manual Install
If you prefer to move the files manually, run the following:

```bash
# Create the extension directory
mkdir -p ~/.local/share/gnome-shell/extensions/pomodoro-timer@askinward

# Copy the extension files
cp extension.js ~/.local/share/gnome-shell/extensions/pomodoro-timer@askinward/
# Ensure you also copy or create a valid metadata.json in that folder
```

### 3. 🔄 Activation
To apply the changes, you must restart the GNOME Shell environment.

**Xorg**: Press Alt + F2, type r, and hit Enter.

**Wayland**: Log out and log back in.

Finally, enable the extension:
```bash
gnome-extensions enable pomodoro-timer@askinward
```
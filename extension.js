// extension.js
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Slider from 'resource:///org/gnome/shell/ui/slider.js';

const DEFAULT_WORK_TIME = 25; // minutes
const MIN_WORK_TIME = 1; // minimum minutes
const MAX_WORK_TIME = 60; // maximum minutes

const PomodoroIndicator = GObject.registerClass(
class PomodoroIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Pomodoro Timer');
        
        // Initialize state
        this._workTimeMinutes = DEFAULT_WORK_TIME;
        this._timeLeft = this._workTimeMinutes * 60;
        this._isRunning = false;
        this._pomodoroCount = 0;
        this._timeout = null;
        this._signalIds = [];
    }
    
    buildUI() {
        // Create panel button label
        this._label = new St.Label({
            text: this._formatTime(this._timeLeft),
            y_align: Clutter.ActorAlign.CENTER
        });
        this.add_child(this._label);
        
        // Create menu items
        this._startStopItem = new PopupMenu.PopupMenuItem('Start');
        const startStopId = this._startStopItem.connect('activate', () => this._toggleTimer());
        this._signalIds.push({obj: this._startStopItem, id: startStopId});
        this.menu.addMenuItem(this._startStopItem);
        
        this._resetItem = new PopupMenu.PopupMenuItem('Reset');
        const resetId = this._resetItem.connect('activate', () => this._resetTimer());
        this._signalIds.push({obj: this._resetItem, id: resetId});
        this.menu.addMenuItem(this._resetItem);
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Add slider for work time
        const sliderItem = new PopupMenu.PopupBaseMenuItem({activate: false});
        const sliderBox = new St.BoxLayout({
            vertical: true,
            style_class: 'popup-menu-item'
        });
        
        this._sliderLabel = new St.Label({
            text: `Work Time: ${this._workTimeMinutes} min`,
            style_class: 'popup-menu-item'
        });
        sliderBox.add_child(this._sliderLabel);
        
        this._slider = new Slider.Slider(this._minutesToSliderValue(this._workTimeMinutes));
        const sliderId = this._slider.connect('notify::value', () => this._onSliderChanged());
        this._signalIds.push({obj: this._slider, id: sliderId});
        sliderBox.add_child(this._slider);
        
        sliderItem.add_child(sliderBox);
        this.menu.addMenuItem(sliderItem);
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        this._countItem = new PopupMenu.PopupMenuItem('Sessions: 0', {
            reactive: false
        });
        this.menu.addMenuItem(this._countItem);
    }
    
    _minutesToSliderValue(minutes) {
        return (minutes - MIN_WORK_TIME) / (MAX_WORK_TIME - MIN_WORK_TIME);
    }
    
    _sliderValueToMinutes(value) {
        return Math.round(MIN_WORK_TIME + value * (MAX_WORK_TIME - MIN_WORK_TIME));
    }
    
    _onSliderChanged() {
        const newMinutes = this._sliderValueToMinutes(this._slider.value);
        
        if (newMinutes !== this._workTimeMinutes) {
            this._workTimeMinutes = newMinutes;
            this._sliderLabel.text = `Work Time: ${this._workTimeMinutes} min`;
            
            // Only update time if not currently running
            if (!this._isRunning) {
                this._timeLeft = this._workTimeMinutes * 60;
                this._label.text = this._formatTime(this._timeLeft);
            }
        }
    }
    
    _formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    _toggleTimer() {
        if (this._isRunning) {
            this._stopTimer();
        } else {
            this._startTimer();
        }
    }
    
    _startTimer() {
        this._isRunning = true;
        this._startStopItem.label.text = 'Pause';
        
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }

        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
            if (this._timeLeft > 0) {
                this._timeLeft--;
                this._label.text = this._formatTime(this._timeLeft);
                return GLib.SOURCE_CONTINUE;
            } else {
                this._onTimerComplete();
                return GLib.SOURCE_REMOVE;
            }
        });
    }
    
    _stopTimer() {
        this._isRunning = false;
        this._startStopItem.label.text = 'Start';
        
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }
    }
    
    _resetTimer() {
        this._stopTimer();
        this._timeLeft = this._workTimeMinutes * 60;
        this._label.text = this._formatTime(this._timeLeft);
    }
    
    _onTimerComplete() {
        this._isRunning = false;
        this._timeout = null;
        
        this._pomodoroCount++;
        this._countItem.label.text = `Sessions: ${this._pomodoroCount}`;
        
        // Reset to work time with custom duration
        this._timeLeft = this._workTimeMinutes * 60;
        this._label.text = this._formatTime(this._timeLeft);
        this._startStopItem.label.text = 'Start';
        
        // Send notification
        Main.notify('Pomodoro Timer', 'Timer complete!');
    }
    
    destroy() {
        // Disconnect all signals
        this._signalIds.forEach(signal => {
            if (signal.obj && signal.id) {
                signal.obj.disconnect(signal.id);
            }
        });
        this._signalIds = [];
        
        // Remove timeout source
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }
        
        super.destroy();
    }
});

export default class PomodoroExtension extends Extension {
    enable() {
        this._indicator = new PomodoroIndicator();
        this._indicator.buildUI();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }
    
    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
    }
}
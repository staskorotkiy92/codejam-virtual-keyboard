'use strict';

class Keyboard {
    constructor() {
        localStorage.setItem('capsSwitcher', 0);
        this.langSwitcher = +localStorage.getItem('langSwitcher');
        this.shiftSwitcher = 0;
        this.keysValue = {
            Backquote: ['`', '~'],
            Digit1: ['1', '!'],
            Digit2: ['2', '@'],
            Digit3: ['3', '#'],
            Digit4: ['4', '$'],
            Digit5: ['5', '%'],
            Digit6: ['6', '^'],
            Digit7: ['7', '&'],
            Digit8: ['8', '*'],
            Digit9: ['9', '('],
            Digit0: ['0', ')'],
            Minus: ['-', '_'],
            Equal: ['=', '+'],
            Backspace: 'Backspace',
            Tab: 'Tab',
            KeyQ: ['q', 'й'],
            KeyW: ['w', 'ц'],
            KeyE: ['e', 'у'],
            KeyR: ['r', 'к'],
            KeyT: ['t', 'е'],
            KeyY: ['y', 'н'],
            KeyU: ['u', 'г'],
            KeyI: ['i', 'ш'],
            KeyO: ['o', 'щ'],
            KeyP: ['p', 'з'],
            BracketLeft: ['[', 'х'],
            BracketRight: [']', 'ъ'],
            Backslash: '\\',
            CapsLock: 'CapsLock',
            KeyA: ['a', 'ф'],
            KeyS: ['s', 'ы'],
            KeyD: ['d', 'в'],
            KeyF: ['f', 'а'],
            KeyG: ['g', 'п'],
            KeyH: ['h', 'р'],
            KeyJ: ['j', 'о'],
            KeyK: ['k', 'л'],
            KeyL: ['l', 'д'],
            Semicolon: [';', 'ж'],
            Quote: ["'", 'э'],
            Enter: 'Enter',
            ShiftLeft: 'Shift',
            KeyZ: ['z', 'я'],
            KeyX: ['x', 'ч'],
            KeyC: ['c', 'с'],
            KeyV: ['v', 'м'],
            KeyB: ['b', 'и'],
            KeyN: ['n', 'т'],
            KeyM: ['m', 'ь'],
            Comma: [',', 'б'],
            Period: ['.', 'ю'],
            Slash: ['/', '.'],
            ArrowUp: '&uarr;',
            ShiftRight: 'Shift',
            ControlLeft: 'Ctrl',
            Lang: ['En', 'Ру'],
            AltLeft: 'Alt',
            Space: ' ',
            AltRight: 'Alt',
            ControlRight: 'Ctrl',
            ArrowLeft: '&larr;',
            ArrowDown: '&darr;',
            ArrowRight: '&rarr;',
            Delete: 'Delete',
        };
    }

    keyboardLoad = () => {
        let fragment = new DocumentFragment();
        let counter = 0;
        let container = document.createElement('div');
        let keyRaw = document.createElement('div');
        keyRaw.className = 'raw flex';
        container.className = 'container flex';
        if (this.langSwitcher === null || this.langSwitcher === undefined) {
            this.langSwitcher = 0;
        }
        if (this.shiftSwitcher === null || this.shiftSwitcher === undefined) {
            this.shiftSwitcher = 0;
        }
        for (let prop in  this.keysValue) {
            if (!this.keysValue.hasOwnProperty(prop)) continue;
            let div = document.createElement('div');
            div.className = 'key';
            div.setAttribute('data-key', prop);
            div.classList.add(prop);
            if (Array.isArray(this.keysValue[prop])) {
                if (prop.indexOf('Digit') === -1 && prop !== 'Backquote' && prop !== 'Minus' && prop !== 'Equal') {
                    div.innerHTML = `${this.keysValue[prop][this.langSwitcher]}`;
                }
                else
                    div.innerHTML = `${this.keysValue[prop][this.shiftSwitcher]}`;
            }
            else {
                div.innerHTML = `${this.keysValue[prop]}`;
            }
            if (div.innerHTML.length > 1) {
                div.setAttribute('data-special', 'specialKey');
            }
            if (prop.includes('Shift') || prop.includes('Tab') || prop.includes('Caps') || prop.includes('Enter') ||
                prop.includes('Backspace')) {
                div.classList.add('bigKey');
            }
            if (prop.includes('Space')) {
                div.classList.add('keySpace');
            }
            keyRaw.append(div);

            if (prop === 'Backspace') {
                keyRaw.classList.add(`raw-${++counter}`);
                container.append(keyRaw);
                keyRaw = document.createElement('div');
            }
            if (prop === 'Backslash') {
                container.append(keyRaw);
                keyRaw.className = 'raw flex';
                keyRaw.classList.add(`raw-${++counter}`);
                keyRaw = document.createElement('div');
            }
            if (prop === 'Enter') {
                container.append(keyRaw);
                keyRaw.className = 'raw flex';
                keyRaw.classList.add(`raw-${++counter}`);
                keyRaw = document.createElement('div');
            }
            if (prop === 'ShiftRight') {
                container.append(keyRaw);
                keyRaw.className = 'raw flex';
                keyRaw.classList.add(`raw-${++counter}`);
                keyRaw = document.createElement('div');
            }
            if (prop === 'Delete') {
                container.append(keyRaw);
                keyRaw.className = 'raw flex';
                keyRaw.classList.add(`raw-${++counter}`);
            }
        }
        let textarea = document.createElement('textarea');
        textarea.className = 'textarea';
        textarea.setAttribute('type', 'text');
        textarea.id = 'textarea';
        container.prepend(textarea);
        fragment.append(container);
        document.body.append(fragment);
    };
}




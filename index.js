'use strict';

let context;
let keyEventFunctions = {

    copyAction() {
        let selected = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
        localStorage.setItem('copied', selected);
    },

    pasteAction() {
        textarea.setRangeText(localStorage.getItem('copied'), textarea.selectionStart, textarea.selectionEnd, 'end');
        textarea.selectionStart = textarea.selectionEnd;
    },

    cutAction() {
        let selected = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
        let from = textarea.selectionStart;
        let to = textarea.selectionEnd;
        localStorage.setItem('copied', selected);
        textarea.setRangeText('', from, to);
    },

    enterAction() {
        textarea.value += '\n';
    },

    tabAction() {
        textarea.value += '   ';
    },

    backspaceAction() {
        if (textarea.selectionStart === textarea.selectionEnd) {
            textarea.setRangeText('', (textarea.selectionStart - 1), textarea.selectionStart);
        }
        else {
            textarea.setRangeText('', textarea.selectionStart, (textarea.selectionEnd));
        }
    },

    deleteAction() {
        if (textarea.selectionStart === textarea.selectionEnd) {
            textarea.setRangeText('', textarea.selectionStart, (textarea.selectionStart + 1));
        }
        else {
            textarea.setRangeText('', textarea.selectionStart, (textarea.selectionEnd));
        }
    },

    capsLockAction() {
        let counter = 0;
        return function (key) {
            let data = key.dataset.key;
            if (counter === 1) {
                for (let elem of document.querySelectorAll('.key')) {
                    if (elem.innerHTML.length === 1) {
                        elem.innerHTML = elem.innerHTML.toLowerCase();
                    }
                }
                document.querySelector(`.${data}`).classList.remove('pressedSpecialKey');
                counter--;
            }
            else {
                for (let elem of document.querySelectorAll('.key')) {
                    if (elem.innerHTML.length === 1) {
                        elem.innerHTML = elem.innerHTML.toUpperCase();
                    }
                }
                document.querySelector(`.${data}`).classList.add('pressedSpecialKey');
                counter++;
            }
            localStorage.setItem('capsSwitcher', counter);
        };

    },

    shiftAction() {
        let length = document.querySelector('.raw-1').children.length - 1;
        switch (this.shiftSwitcher) {
            case 0:
                this.shiftSwitcher = 1;
                break;
            case 1:
                this.shiftSwitcher = 0;
                break;
        }
        let counter = 0;
        for (let prop in this.keysValue) {
            if (counter === length) {
                break;
            }
            if (!this.keysValue.hasOwnProperty(prop)) continue;
            document.querySelector('.raw-1').children[counter].innerHTML = `${this.keysValue[prop][this.shiftSwitcher]}`;
            counter++;
        }
    },

    arrowsAction(arrowType) {
        if (arrowType === 'ArrowLeft') {
            textarea.selectionStart--;
            textarea.selectionEnd--;
            textarea.selectionEnd = textarea.selectionStart;
        }
        if (arrowType === 'ArrowRight') {
            textarea.selectionStart++;
            textarea.selectionEnd++;
            textarea.selectionEnd = textarea.selectionStart;
        }
        if (arrowType === 'ArrowDown') {
        }
        if (arrowType === 'ArrowUp') {
        }
    },

    hotKeysAction(func, ...hotKeys) {
        let pressedKeys = new Set();
        document.addEventListener('keydown', function (event) {
            pressedKeys.add(event.code);
            for (let code of hotKeys) {

                if (!pressedKeys.has(code)) {
                    return;
                }
            }
            pressedKeys.clear();
            func();
        });
        document.addEventListener('keyup', function (event) {
            pressedKeys.delete(event.code);
        });
    },

    commonKeysAction(key) {
        textarea.setRangeText(key.innerHTML, textarea.selectionStart, textarea.selectionEnd, 'end');
    }
};

let mainInputFunctions = {
    keyBoardKeysInput() {
        let isPressed = {};
        let pressedKey;
        let makeUpperCaseKeys = keyEventFunctions.capsLockAction();

        document.addEventListener('mousedown', function (event) {
            if (event.which === 1) {
                pressedKey = event.target.closest('.key');
                pressedKey.classList.add('pressedKey');
                if (pressedKey.dataset.key === 'Backspace') {
                    keyEventFunctions.backspaceAction();
                }
                else if (pressedKey.dataset.key === 'Delete') {
                    keyEventFunctions.deleteAction();
                }
                else if (pressedKey.dataset.key === 'CapsLock') {
                    if (!document.querySelector('.ShiftLeft').classList.contains('pressedSpecialKey') &&
                        !document.querySelector('.ShiftRight').classList.contains('pressedSpecialKey')) {
                        makeUpperCaseKeys(pressedKey);
                    }
                }

                else if (pressedKey.dataset.key.indexOf('Arrow') !== -1) {

                    keyEventFunctions.arrowsAction(pressedKey.dataset.key);
                }
                else if (pressedKey.dataset.key === 'Enter') {
                    keyEventFunctions.enterAction();
                }
                else if (pressedKey.dataset.key === 'Tab') {
                    keyEventFunctions.tabAction();
                }
                else if (pressedKey.dataset.key.indexOf('Shift') !== -1) {
                    if (!document.querySelector('.CapsLock').classList.contains('pressedSpecialKey')) {
                        makeUpperCaseKeys(pressedKey);
                    }
                    keyEventFunctions.shiftAction.call(context);
                }
                else if (pressedKey.dataset.key === 'Lang') {
                    mainInputFunctions.langSwitch.call(context);
                }
                else {
                    if (!pressedKey.dataset.special) {
                        keyEventFunctions.commonKeysAction(pressedKey);
                    }
                }

                document.addEventListener('mouseup', function (event) {
                    document.getElementById('textarea').focus();
                    pressedKey.classList.remove('pressedKey');
                });
            }
        });

        document.addEventListener('keydown', function (event) {
            isPressed[event.code] = true;
            pressedKey = document.querySelector(`.${event.code}`);
            pressedKey.classList.add('pressedKey');
            textarea.focus();
            event.preventDefault();
            if (event.code === 'Backspace') {
                keyEventFunctions.backspaceAction();
            }
            else if (event.code === 'Delete') {
                keyEventFunctions.deleteAction();
            }
            else if (event.code === 'CapsLock') {
                makeUpperCaseKeys(pressedKey);
            }
            else if (event.code.indexOf('Arrow') !== -1) {
                keyEventFunctions.arrowsAction(pressedKey.dataset.key);
            }
            else if (event.code === 'Enter') {
                keyEventFunctions.enterAction();
            }
            else if (event.code === 'Tab') {
                keyEventFunctions.tabAction();
            }
            else if (event.code.indexOf('Shift') !== -1) {
                let allowedRepeat = true;
                if (event.repeat !== undefined) {
                    allowedRepeat = !event.repeat;
                }
                if (!allowedRepeat) {
                    return;
                }
                makeUpperCaseKeys(pressedKey);
                keyEventFunctions.shiftAction.call(context);
            }
            else {
                if (!pressedKey.dataset.special && !isPressed['ControlLeft']) {
                    keyEventFunctions.commonKeysAction(pressedKey);
                }
            }
        });

        document.addEventListener('keyup', function (event) {
            isPressed[event.code] = false;
            if (event.code.indexOf('Shift') !== -1) {
                makeUpperCaseKeys(pressedKey);
                keyEventFunctions.shiftAction.call(context);
            }
            textarea.focus();
            pressedKey = document.querySelector(`.${event.code}`);
            pressedKey.classList.remove('pressedKey');
            if (event.code.indexOf('Shift') !== -1) {
                pressedKey.classList.remove('pressedSpecialKey');
            }
        });
    },

    langSwitch() {
        switch (this.langSwitcher) {
            case 0:
                localStorage.setItem('langSwitcher', 1);
                break;
            case 1:
                localStorage.setItem('langSwitcher', 0);
                break;
        }
        this.langSwitcher = +localStorage.getItem('langSwitcher');
        let counter = 0;
        for (let prop in this.keysValue) {
            if (!this.keysValue.hasOwnProperty(prop)) continue;
            if (Array.isArray(this.keysValue[prop]) && prop.indexOf('Digit') === -1 &&
                prop !== 'Backquote' && prop !== 'Minus' && prop !== 'Equal') {
                if (+localStorage.getItem('capsSwitcher') === 1) {
                    document.querySelectorAll('.key')[counter].innerHTML = `${this.keysValue[prop][this.langSwitcher]}`.toUpperCase();
                }
                else
                    document.querySelectorAll('.key')[counter].innerHTML = `${this.keysValue[prop][this.langSwitcher]}`;
            }
            counter++;
        }
    }
};


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

let changeKeysLang = keyEventFunctions.hotKeysAction;
let copy = keyEventFunctions.hotKeysAction;
let paste = keyEventFunctions.hotKeysAction;
let cut = keyEventFunctions.hotKeysAction;


window.onload = function () {
    let keyBoard = new Keyboard();
    context = keyBoard;
    mainInputFunctions.keyBoardKeysInput();
    keyBoard.keyboardLoad();
    changeKeysLang(mainInputFunctions.langSwitch.bind(keyBoard), 'AltLeft', 'ControlLeft');
    copy(keyEventFunctions.copyAction, 'ControlLeft', 'KeyC');
    paste(keyEventFunctions.pasteAction, 'ControlLeft', 'KeyV');
    cut(keyEventFunctions.cutAction, 'ControlLeft', 'KeyX');
};




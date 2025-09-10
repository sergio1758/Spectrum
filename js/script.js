const colorDisplay     = document.getElementById('colorDisplay');
const hexInput         = document.getElementById('hexInput');
const applyHex         = document.getElementById('applyHex');
const redSlider        = document.getElementById('red');
const greenSlider      = document.getElementById('green');
const blueSlider       = document.getElementById('blue');
const redValue         = document.getElementById('redValue');
const greenValue       = document.getElementById('greenValue');
const blueValue        = document.getElementById('blueValue');
const copyNotification = document.getElementById('copyNotification');
const paletteColors    = document.querySelectorAll('.palette-color');
let red = 108, green = 99, blue = 255;

function init() {
    updateColor();

    [redSlider, greenSlider, blueSlider].forEach(slider => {
    slider.addEventListener('input', () => {
        red   = +redSlider.value;
        green = +greenSlider.value;
        blue  = +blueSlider.value;
        redValue.textContent   = red;
        greenValue.textContent = green;
        blueValue.textContent  = blue;
        updateColor();
    });
    });

    applyHex.addEventListener('click', applyHexColor);
    hexInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') applyHexColor();
    });

    document.querySelectorAll('.format-box').forEach(box => {
    box.addEventListener('click', () => {
        const target = document.getElementById(box.dataset.target);
        navigator.clipboard.writeText(target.value).then(notify).catch(console.error);
    });
    });

    colorDisplay.addEventListener('click', () => {
    navigator.clipboard.writeText(rgbToHex(red, green, blue)).then(notify).catch(console.error);
    });

    paletteColors.forEach(el => {
    el.addEventListener('click', () => {
        const [r, g, b] = getComputedStyle(el).backgroundColor.match(/\d+/g).map(Number);
        red = r; green = g; blue = b;
        redSlider.value   = red;
        greenSlider.value = green;
        blueSlider.value  = blue;
        redValue.textContent   = red;
        greenValue.textContent = green;
        blueValue.textContent  = blue;
        updateColor();
    });
    });
}

function applyHexColor() {
    const hex = hexInput.value.trim().toUpperCase();
    if (!/^#([A-F0-9]{6})$/.test(hex)) {
    hexInput.style.borderColor = '#ff6584';
    hexInput.value = '';
    hexInput.placeholder = 'Invalid HEX!';
    setTimeout(() => {
        hexInput.placeholder = '#RRGGBB';
        hexInput.style.borderColor = '';
    }, 1500);
    return;
    }
    const num = parseInt(hex.slice(1), 16);
    red   = (num >> 16) & 255;
    green = (num >> 8)  & 255;
    blue  = num         & 255;

    redSlider.value   = red;
    greenSlider.value = green;
    blueSlider.value  = blue;
    redValue.textContent   = red;
    greenValue.textContent = green;
    blueValue.textContent  = blue;
    updateColor();
}

function updateColor() {
    const rgb = `rgb(${red}, ${green}, ${blue})`;
    colorDisplay.style.backgroundColor = rgb;
    const brightness = (red*299 + green*587 + blue*114) / 1000;
    colorDisplay.style.color = brightness > 128 ? '#000' : '#fff';
    document.getElementById('hexValue').value  = rgbToHex(red, green, blue);
    document.getElementById('rgbValue').value  = rgb;
    document.getElementById('hslValue').value  = rgbToHsl(red, green, blue);
    document.getElementById('cmykValue').value = rgbToCmyk(red, green, blue);
    hexInput.value = document.getElementById('hexValue').value;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
    const h = x.toString(16).toUpperCase();
    return h.length === 1 ? '0' + h : h;
    }).join('');
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
    }
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function rgbToCmyk(r, g, b) {
    if (r === 0 && g === 0 && b === 0) return 'cmyk(0%,0%,0%,100%)';
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    const c = Math.round((1 - r - k) / (1 - k) * 100);
    const m = Math.round((1 - g - k) / (1 - k) * 100);
    const y = Math.round((1 - b - k) / (1 - k) * 100);
    const kP = Math.round(k * 100);
    return `cmyk(${c}%, ${m}%, ${y}%, ${kP}%)`;
}

function notify() {
    copyNotification.classList.add('show');
    setTimeout(() => copyNotification.classList.remove('show'), 800);
}

window.addEventListener('DOMContentLoaded', init);

// Run in the actual contact page through the approved browser/CDP path.
// Regression: an input boundary reverting to a pale theme token fails 3:1.
(() => {
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
 const luminance=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);const rgb=[...ctx.getImageData(0,0,1,1).data].slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
 const controls=[...document.querySelectorAll('form input:not([type="hidden"]),form textarea,form select,form button[role="combobox"],form button[type="button"]')].filter(e=>!e.disabled&&e.getBoundingClientRect().width>0);
 const rows=controls.map(e=>{const style=getComputedStyle(e);const ratio=1.05/(luminance(style.borderTopColor)+.05);return {name:e.name||e.textContent.trim(),ratio,pass:ratio>=3}});
 return {pass:rows.length>=7&&rows.every(r=>r.pass),rows};
})()

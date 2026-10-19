// Execute against the real mobile homepage through the approved browser path.
// Reverting a control to its former 32px hit area fails this regression.
(() => {
 const rows=Array.from(document.querySelectorAll('.hero-controls button')).map(button=>{
  const rect=button.getBoundingClientRect()
  return {label:button.getAttribute('aria-label'),width:rect.width,height:rect.height,pass:rect.width>=44&&rect.height>=44}
 })
 return {pass:rows.length===6&&rows.every(row=>row.pass),rows}
})()

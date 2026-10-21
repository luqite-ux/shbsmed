// October 21: describe supplied structures and specifications, not treatment efficacy.
// Sources: original product workbook and the four named tip-structure photographs.
export const productDescriptions:Record<string,string>={
 'rf-electrodes':'Single-use RF electrode. Available models, gauges, effective lengths and color codes are listed below.',
 'straight-sharp-rf-cannulas':'Single-use RF cannula with a straight sharp tip. See the enlarged tip image and model specifications below.',
 'curved-sharp-rf-cannulas':'Single-use RF cannula with a curved sharp tip. See the enlarged tip image and model specifications below.',
 'curved-blunt-rf-cannulas':'Single-use RF cannula with a curved blunt tip. See the enlarged tip image and model specifications below.',
 'side-port-rf-cannulas':'Single-use RF cannula with a curved sharp tip and side port. See the enlarged tip image and model specifications below.',
}

// Product workbook: product-information sheet, tip-structure fields and F49.
// Electrode anatomy: customer's October 19 reply, item 1. Do not extend
// anatomical facts into efficacy, treatment instructions or model-wide claims.
export const productStructures:Record<string,string[]>={
 'rf-electrodes':[
  'The working end consists of the stainless-steel tip and black insulated section.',
  'The gray plug is the connection end for the RF generator.',
  'Electrode and cannula model combinations are listed below the specification table.',
 ],
 'straight-sharp-rf-cannulas':['Straight cannula tip with a sharp point.','Gauge, effective length, active tip length and color code vary by model; see the specification table.'],
 'curved-sharp-rf-cannulas':['Curved cannula tip with a sharp point.','The enlarged tip photograph shows the curved structure. Gauge, effective length and active tip length are listed by model.'],
 'curved-blunt-rf-cannulas':['Curved cannula tip with a blunt point.','The enlarged tip photograph shows the rounded tip profile. Gauge, effective length and active tip length are listed by model.'],
 'side-port-rf-cannulas':['Curved sharp tip with a side port.','With the matching electrode, its tip exits through the side port to form a Y-shaped configuration with the cannula tip.','Use the model combinations stated in the electrode specifications; do not assume every electrode matches this structure.'],
}

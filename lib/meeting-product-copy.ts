// October 21: describe supplied structures and specifications, not treatment efficacy.
// Sources: original product workbook and the four named tip-structure photographs.
export const productDescriptions:Record<string,string>={
 'rf-electrodes':'Single-use RF electrode. Available models, gauges, effective lengths and color codes are listed below.',
 'straight-sharp-rf-cannulas':'Single-use RF cannula with a straight sharp tip. See the enlarged tip image and model specifications below.',
 'curved-sharp-rf-cannulas':'Single-use RF cannula with a curved sharp tip. See the enlarged tip image and model specifications below.',
 'curved-blunt-rf-cannulas':'Single-use RF cannula with a curved blunt tip. See the enlarged tip image and model specifications below.',
 'side-port-rf-cannulas':'Single-use RF cannula with a curved sharp tip and side port. See the enlarged tip image and model specifications below.',
}

// Listing summaries: same source facts as details, without detail-only directions.
export const productSummaries:Record<string,string>={
 'rf-electrodes':'The working end has a stainless-steel tip and black insulated section; the gray plug connects to the RF generator. Used with a compatible RF cannula according to the listed model combinations.',
 'straight-sharp-rf-cannulas':'Straight cannula with a sharp tip. Model specifications include gauge, effective length, active tip length and color code.',
 'curved-sharp-rf-cannulas':'Cannula with a curved sharp tip. Model specifications include gauge, effective length, active tip length and color code.',
 'curved-blunt-rf-cannulas':'Cannula with a curved blunt tip and rounded tip profile. Gauge, effective length and active tip length are listed by model.',
 'side-port-rf-cannulas':'Cannula with a curved sharp tip and side port. The matching electrode tip exits through the side port to form a Y-shaped configuration with the cannula tip.',
}
// Preview-only corrections; no writes to the database shared with the protected live site.
export const meetingCopyZh:Record<string,string>={
 'Pain Management Series':'疼痛治疗系列',
 'Epidural Anesthesia Series':'硬脊膜外麻醉系列',
 'Single-use RF Electrodes':'一次性射频电极',
 'Single-use RF Cannulas — Four Tip Structures':'一次性射频套管 · 四种结构',
 [productSummaries['rf-electrodes']]:'工作端由不锈钢针尖和黑色绝缘段组成，灰色插头为连接射频发生器的连接端。按所列型号配套关系，与相应射频套管配合使用。',
 [productSummaries['straight-sharp-rf-cannulas']]:'套管采用直型尖头结构。各型号列明针规、有效长度、裸露端长度及颜色标识。',
 [productSummaries['curved-sharp-rf-cannulas']]:'套管采用弯曲尖头结构。各型号列明针规、有效长度、裸露端长度及颜色标识。',
 [productSummaries['curved-blunt-rf-cannulas']]:'套管采用弯曲钝头结构，针尖呈圆钝轮廓。针规、有效长度及裸露端长度按型号列明。',
 [productSummaries['side-port-rf-cannulas']]:'套管采用带侧端口的弯曲尖头结构。与对应型号电极配套时，电极尖端从侧端口伸出，与套管尖端形成 Y 形结构。',
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

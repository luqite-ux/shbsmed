"""Deterministic background masks. Original geometry and protected pixels unchanged."""
from pathlib import Path
import json,hashlib,gc,sys
import numpy as np
from PIL import Image,ImageDraw,ImageFilter,ImageOps

src=Path('public/images/oem-20261104');out=Path('public/images/oem-20261104-unified');out.mkdir(exist_ok=True)
ev=Path('.codex-delivery/oem-background-20261104');ev.mkdir(exist_ok=True)
records=[];sheet=Image.new('RGB',(1600,1200),'white')
for idx,p in enumerate(sorted(src.iterdir())):
 if p.suffix not in ['.jpg','.webp']:continue
 if len(sys.argv)>1 and not p.stem.startswith(sys.argv[1]):continue
 a=np.array(Image.open(p).convert('RGB'));h,w=a.shape[:2];f=a.astype('float32')
 bg=(f[:,:,1]-f[:,:,0]>7)&(f[:,:,2]-f[:,:,0]>10)&(f[:,:,0]>65)
 m=Image.new('L',(w,h));d=ImageDraw.Draw(m)
 def line(a,b,width=.009):d.line(tuple(int(v*s) for pt in [a,b] for v,s in zip(pt,[w,h])),fill=255,width=max(3,int(w*width)))
 def poly(points):d.polygon([(int(x*w),int(y*h)) for x,y in points],fill=255)
 if p.stem.startswith('quincke'):
  for start,end in [((.394,.075),(.68,.34)),((.367,.179),(.657,.439)),((.340,.282),(.632,.542)),((.310,.383),(.607,.647)),((.278,.495),(.582,.747)),((.249,.603),(.556,.852))]:
   line(start,end)
   x,y=end;poly([(x-.018,y-.025),(x+.088,y+.04),(x+.105,y+.10),(x+.065,y+.12),(x-.023,y+.035)])
  if '-detail' in p.stem:poly([(.143,.105),(.31,.237),(.286,.28),(.14,.157)])
 elif p.stem.startswith('epidural'):
  for start,end in [((.326,.059),(.635,.343)),((.308,.196),(.619,.477)),((.294,.341),(.600,.605)),((.270,.478),(.585,.733)),((.250,.626),(.567,.866))]:line(start,end,.012)
  # Complete transparent wings, hubs and colored ends; kept as original pixels.
  poly([(.657,.266),(.691,.26),(.678,.362),(.746,.411),(.724,.455),(.65,.413),(.631,.473),(.735,.516),(.714,.576),(.647,.541),(.625,.606),(.714,.646),(.695,.701),(.622,.668),(.600,.733),(.703,.775),(.681,.83),(.602,.792),(.578,.867),(.691,.906),(.676,.971),(.562,.924),(.552,.979),(.526,.977),(.568,.713),(.603,.477)])
 elif p.stem.startswith('sprotte'):
  for start,end in [((.197,.198),(.621,.793)),((.345,.293),(.665,.727)),((.381,.215),(.707,.657))]:line(start,end,.006)
  for points in [[(.610,.779),(.656,.785),(.746,.902),(.713,.959),(.644,.895),(.608,.831)],[(.650,.711),(.697,.729),(.787,.843),(.757,.900),(.687,.834),(.647,.762)],[(.693,.642),(.735,.651),(.836,.776),(.800,.836),(.730,.769),(.690,.692)]]:poly(points)
  if '-detail' in p.stem:poly([(.697,.182),(.842,.353),(.822,.388),(.698,.227)])
 else:
  line((.177,.081),(.634,.625),.009)
  poly([(.696,.570),(.713,.583),(.677,.64),(.733,.703),(.744,.742),(.789,.784),(.802,.831),(.833,.823),(.892,.891),(.854,.950),(.809,.901),(.793,.855),(.739,.804),(.705,.767),(.693,.72),(.652,.673),(.619,.747),(.603,.732),(.635,.664),(.614,.638),(.620,.607),(.649,.610)])
  if '-detail' in p.stem:poly([(.145,.478),(.399,.768),(.379,.797),(.146,.516)])
 keep=(np.array(m)>0)|(~bg)
 if p.stem.startswith('sprotte'):
  # This supplied image has a flat cyan/green backdrop. Resolve the actual
  # thin needle edges from source-pixel contrast rather than a wide keep-out
  # line, which would retain a visible stripe of the old background.
  reference=np.median(f[int(.02*h):int(.1*h),int(.4*w):int(.6*w)].reshape(-1,3),axis=0)
  keep=np.max(np.abs(f-reference),axis=2)>7
 keep=np.array(Image.fromarray((keep*255).astype('uint8')).filter(ImageFilter.MaxFilter(3)))>0
 blur=np.array(Image.fromarray(((~keep)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(max(3,w/400))),dtype='float32')/255
 alpha=np.clip((blur-.5)*2,0,1);alpha[keep]=0;alpha=alpha*alpha*(3-2*alpha)
 sample=alpha>.999;lum=f[:,:,0]*.2126+f[:,:,1]*.7152+f[:,:,2]*.0722
 offset=lum-float(np.median(lum[sample]));result=a.copy()
 for c,target in enumerate([187,214,225]):result[:,:,c]=np.rint(f[:,:,c]*(1-alpha)+np.clip(target+offset,0,255)*alpha).astype('uint8')
 result[keep]=a[keep];dest=out/(p.stem+'.webp');Image.fromarray(result).save(dest,lossless=True,method=6)
 check=np.array(Image.open(dest));assert np.array_equal(check[keep],a[keep]);assert check.shape==a.shape
 Image.fromarray((keep*255).astype('uint8')).save(ev/(p.stem+'-protected.png'))
 overlay=a.copy();overlay[keep]=(a[keep]*.5+np.array([255,0,0])*.5).astype('uint8');ImageOps.contain(Image.fromarray(overlay),(900,650)).save(ev/(p.stem+'-mask.jpg'))
 thumb=ImageOps.contain(Image.fromarray(result),(390,550));x=idx%4*400;y=idx//4*600;sheet.paste(thumb,(x,y+30));ImageDraw.Draw(sheet).text((x,y),p.stem,fill='black')
 records.append(dict(source=str(p),output=str(dest),size=[w,h],protectedPixels=int(keep.sum()),protectedChangedPixels=0,backgroundMedianRGB=np.median(check[sample],axis=0).tolist(),sourceSha256=hashlib.sha256(p.read_bytes()).hexdigest(),outputSha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
 print(p.name,'protected changed 0',flush=True)
 del a,f,result,check,overlay,keep,alpha,blur,lum,offset,sample;gc.collect()
if len(sys.argv)>1:
 old=json.loads((ev/'pixel-verification.json').read_text(encoding='utf-8'))
 records=[r for r in old if not Path(r['source']).stem.startswith(sys.argv[1])]+records
for idx,p in enumerate(sorted(out.glob('*.webp'))):
 thumb=ImageOps.contain(Image.open(p),(390,550));x=idx%4*400;y=idx//4*600;sheet.paste(thumb,(x,y+30));ImageDraw.Draw(sheet).text((x,y),p.stem,fill='black')
sheet.save(ev/'unified-contact.jpg');(ev/'pixel-verification.json').write_text(json.dumps(records,indent=2),encoding='utf-8')

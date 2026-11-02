"""Non-generative background-only color normalization, authorized 2026-11-02.
Original files are retained. Protected subject pixels are copied verbatim; no
geometry transform, generative fill, sharpening, or product color adjustment.
"""
from pathlib import Path
import hashlib,json,sys
import numpy as np
from PIL import Image,ImageDraw,ImageOps,ImageFilter

src=Path('public/images/client-products-20261102')
out=Path('public/images/client-products-20261102-unified');out.mkdir(exist_ok=True)
evidence=Path('.codex-delivery/feedback36/background-20261102');evidence.mkdir(exist_ok=True)
target=np.array([187.,214.,225.])
# Conservative extra protection for clear connectors and blue handles.
boxes={
 '4.1':[(.655,.375,.746,.465),(.716,.441,.882,.635)],
 '4.2':[(.674,.488,.817,.692)],
 '5.1':[(.151,.538,.258,.678),(.167,.681,.278,.804),(.297,.675,.403,.806),(.309,.814,.423,.927),(.442,.800,.558,.920)],
 '5.2':[(.180,.369,.288,.468),(.184,.468,.292,.570),(.300,.474,.409,.579),(.308,.580,.417,.687),(.312,.681,.421,.788),(.438,.676,.548,.782),(.440,.780,.558,.889)],
 '5.3':[(.164,.716,.333,.924)],
 '5.4':[(.650,.617,.879,.782)]
}
lines={'4.1':[((.395,.061),(.668,.384),.007)],'4.2':[((.356,.085),(.689,.503),.004)],'5.4':[((.128,.247),(.668,.631),.008)]}
files=sorted(src.glob('*.webp'))+sorted(src.glob('5.*-detail.jpeg'))
selected=set(sys.argv[1:]);records=[]
if selected:records=[r for r in json.loads((evidence/'pixel-verification.json').read_text()) if Path(r['source']).name not in selected]
def hull(points):
 points=sorted(set(points))
 def cross(o,a,b):return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
 low=[];high=[]
 for p in points:
  while len(low)>=2 and cross(low[-2],low[-1],p)<=0:low.pop()
  low.append(p)
 for p in reversed(points):
  while len(high)>=2 and cross(high[-2],high[-1],p)<=0:high.pop()
  high.append(p)
 return low[:-1]+high[:-1]
def largest_component(region):
 # Avoid including a neighbouring needle that crosses a connector's ROI.
 r=np.array(Image.fromarray((region*255).astype('uint8')).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7)))>0
 seen=np.zeros(r.shape,dtype=bool);best=[];hh,ww=r.shape
 for y,x in zip(*np.where(r)):
  if seen[y,x]:continue
  stack=[(int(y),int(x))];seen[y,x]=True;component=[]
  while stack:
   cy,cx=stack.pop();component.append((cx,cy))
   for ny,nx in [(cy-1,cx),(cy+1,cx),(cy,cx-1),(cy,cx+1)]:
    if 0<=ny<hh and 0<=nx<ww and r[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;stack.append((ny,nx))
  if len(component)>len(best):best=component
 return best
sheet=Image.new('RGB',(1500,1100),'white');draw=ImageDraw.Draw(sheet)
for index,p in enumerate(files):
 if selected and p.name not in selected:continue
 im=Image.open(p).convert('RGB');a=np.array(im);f=a.astype(float);h,w=a.shape[:2];key=p.stem[:3]
 # Blue/cyan backdrop; white cables, metal, black shafts, markings and colored
 # hubs are excluded by chroma. Manual keep-outs additionally cover clear hubs.
 bg=(f[:,:,2]-f[:,:,0]>13)&(f[:,:,1]-f[:,:,0]>7)&(f[:,:,0]>65)
 protected=Image.new('L',(w,h));d=ImageDraw.Draw(protected)
 for x0,y0,x1,y1 in boxes.get(key,[]):
  left,top,right,bottom=int(x0*w),int(y0*h),int(x1*w),int(y1*h)
  # Convex envelope of observed product pixels protects transparent material
  # between highlights, without retaining rectangular areas of old background.
  region=~bg[top:bottom,left:right];points=[]
  for col in range(region.shape[1]):
   ys=np.flatnonzero(region[:,col])
   if ys.size:points.extend([(col+left,int(ys[0])+top),(col+left,int(ys[-1])+top)])
  if len(points)>2:d.polygon(hull(points),fill=255)
  if key in ['4.1','4.2']:
   # Blue electrical grips are product, not blue backdrop.
   blue=(f[top:bottom,left:right,2]-f[top:bottom,left:right,0]>55)&(f[top:bottom,left:right,0]<130)
   yy,xx=np.where(blue)
   if len(xx)>2:d.polygon(hull(list(zip((xx+left).tolist(),(yy+top).tolist()))),fill=255)
 for (x0,y0),(x1,y1),width in lines.get(key,[]):d.line((int(x0*w),int(y0*h),int(x1*w),int(y1*h)),fill=255,width=max(3,int(width*w)))
 # Preserve the white technical inset and the actual enlarged needle pixels.
 # Protect all pixels of the source technical inset, including blue reflections
 # in the enlarged steel tip that could otherwise resemble the backdrop.
 if '-detail' in p.stem and key=='5.1':d.rectangle((int(.765*w),int(.147*h),int(.921*w),int(.402*h)),fill=255)
 if '-detail' in p.stem and key=='5.2':d.polygon([(int(x*w),int(y*h)) for x,y in [(.762,.307),(.886,.134),(.908,.163),(.786,.337)]],fill=255)
 keep=(np.array(protected)>0)|(~bg)
 keep=np.array(Image.fromarray((keep*255).astype('uint8')).filter(ImageFilter.MaxFilter(3)))>0
 # Feather on BACKGROUND side only: every protected pixel remains unchanged.
 blurred=np.array(Image.fromarray(((~keep)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(max(8,w/65)))).astype(float)/255
 alpha=np.clip((blurred-.5)*2,0,1);alpha[keep]=0;alpha=alpha*alpha*(3-2*alpha)
 sample=(alpha>.999);lum=f@np.array([.2126,.7152,.0722]);median=float(np.median(lum[sample]))
 adjusted=np.clip(target+(lum-median)[:,:,None],0,255)
 result=np.rint(f*(1-alpha[:,:,None])+adjusted*alpha[:,:,None]).astype('uint8');result[keep]=a[keep]
 dest=out/(p.stem+'.webp');Image.fromarray(result).save(dest,lossless=True,method=6)
 decoded=np.array(Image.open(dest).convert('RGB'))
 assert np.array_equal(decoded[keep],a[keep])
 assert decoded.shape==a.shape
 Image.fromarray((keep*255).astype('uint8')).save(evidence/(p.stem+'-protected.png'))
 # Red overlay makes the protected scope reviewable without changing output.
 overlay=a.copy();overlay[keep]=np.rint(a[keep]*.5+np.array([255,0,0])*.5).astype('uint8')
 ImageOps.contain(Image.fromarray(overlay),(1100,900)).save(evidence/(p.stem+'-mask-review.jpg'))
 thumb=ImageOps.contain(Image.fromarray(result),(480,320));x=index%3*500;y=index//3*365;sheet.paste(thumb,(x,y+30));draw.text((x+8,y+5),p.name,fill='black')
 records.append({'source':str(p),'output':str(dest),'dimensions':[w,h],'sourceSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'outputSha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'protectedPixels':int(keep.sum()),'protectedChangedPixels':int(np.any(decoded[keep]!=a[keep],axis=1).sum()),'backgroundMedianRGB':np.median(decoded[sample],axis=0).tolist(),'method':'background-only deterministic color transform, lossless WebP; geometry unchanged'})
 print(p.name,'protected changed = 0',flush=True)
for index,p in enumerate(files):
 im=Image.open(out/(p.stem+'.webp'));thumb=ImageOps.contain(im,(480,320));x=index%3*500;y=index//3*365;sheet.paste(thumb,(x,y+30));draw.text((x+8,y+5),p.name,fill='black')
sheet.save(evidence/'unified-contact.jpg');(evidence/'pixel-verification.json').write_text(json.dumps(sorted(records,key=lambda r:r['source']),indent=2),encoding='utf-8')

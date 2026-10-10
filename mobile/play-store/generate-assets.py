"""Render reproducible Play artwork. Requires Pillow; no screenshots are fabricated."""
from pathlib import Path
from math import hypot
from PIL import Image, ImageDraw, ImageFont
ROOT = Path(__file__).parent
S = 4
GREEN = '#063B36'
def curve(draw, points, color, width):
    coords=[]
    for segment in points:
        a,b,c,d=segment
        for i in range(101):
            t=i/100; u=1-t
            coords.append((u**3*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t**3*d[0],u**3*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t**3*d[1]))
    radius=width/2
    left=[]; right=[]
    for i,(x,y) in enumerate(coords):
        a=coords[max(0,i-1)]; b=coords[min(len(coords)-1,i+1)]
        dx,dy=b[0]-a[0],b[1]-a[1]; length=hypot(dx,dy) or 1
        nx,ny=-dy/length*radius,dx/length*radius
        left.append((x+nx,y+ny)); right.append((x-nx,y-ny))
    draw.polygon(left+list(reversed(right)),fill=color)
    for x,y in [coords[0],coords[-1]]: draw.ellipse((x-radius,y-radius,x+radius,y+radius),fill=color)
def dna(im, box):
    draw=ImageDraw.Draw(im); x,y,size=box
    def p(a,b):return (x+a*size/108,y+b*size/108)
    def seg(values):return tuple(p(*v) for v in values)
    curve(draw,[seg([(38,28),(38,43),(70,44),(70,54)]),seg([(70,54),(70,64),(38,66),(38,80)])],'#FFFFFF',round(size*5/108))
    curve(draw,[seg([(70,28),(70,43),(38,44),(38,54)]),seg([(38,54),(38,64),(70,66),(70,80)])],'#FB923C',round(size*5/108))
    for a,b,c,d in [(42,34,66,34),(43,43,65,43),(45,65,63,65),(42,74,66,74)]:draw.line([p(a,b),p(c,d)],fill='#A7F3D0',width=round(size*3/108))
icon=Image.new('RGB',(512*S,512*S),GREEN); dna(icon,(0,0,512*S)); icon.resize((512,512),Image.Resampling.LANCZOS).save(ROOT/'store-icon-512.png')
img=Image.new('RGB',(1024*S,500*S),GREEN); d=ImageDraw.Draw(img)
def font(size,bold=False): return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if bold else '')+'.ttf',round(size*S))
def text(x,y,value,size,color='white',bold=False):d.text((x*S,y*S),value,font=font(size,bold),fill=color)
d.ellipse((50*S,76*S,370*S,396*S),fill='#104B44',outline='#2D6D60',width=2*S); dna(img,(42*S,68*S,336*S))
text(410,78,'ARIF UDDIN',17,'#A7F3D0',True)
text(410,121,'Arif Bio Hub',58,'#FFFFFF',True)
text(412,202,'Bioinformatics on your phone',26,'#D1FAE5')
text(412,268,'LEARN   •   TOOLS   •   CENTRAL DOGMA',18,'#FB923C',True)
text(412,326,'Reference evidence.',23)
text(412,364,'Clear scientific limits.',23)
img.resize((1024,500),Image.Resampling.LANCZOS).save(ROOT/'feature-graphic-1024x500.png')
print('Rendered 512×512 icon and 1024×500 feature graphic; actual phone screenshots are still required.')

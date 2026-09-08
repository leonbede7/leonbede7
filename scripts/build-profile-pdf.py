"""Build the public one-page profile from the same facts as the HTML profile."""
import hashlib
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, HRFlowable, Spacer, KeepTogether
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
raw = (ROOT / 'src/profile.json').read_bytes()
data = json.loads(raw)
target = ROOT / 'site/assets/leon-bede-profile.pdf'
ink = colors.HexColor('#242820')
muted = colors.HexColor('#535a50')
accent = colors.HexColor('#9d2c1b')
styles = {
 'name': ParagraphStyle('name',fontName='Helvetica-Bold',fontSize=29,leading=32,textColor=ink,spaceAfter=5),
 'title': ParagraphStyle('title',fontName='Helvetica',fontSize=13,leading=17,textColor=ink,spaceAfter=6),
 'small': ParagraphStyle('small',fontName='Helvetica',fontSize=8.5,leading=11.5,textColor=muted,spaceAfter=4),
 'body': ParagraphStyle('body',fontName='Helvetica',fontSize=9.3,leading=12.7,textColor=ink,spaceAfter=5),
 'section': ParagraphStyle('section',fontName='Helvetica-Bold',fontSize=10,leading=13,textColor=accent,spaceBefore=10,spaceAfter=7,keepWithNext=True),
 'entry': ParagraphStyle('entry',fontName='Helvetica-Bold',fontSize=10.3,leading=13,textColor=ink,spaceAfter=3,keepWithNext=True),
 'links': ParagraphStyle('links',fontName='Helvetica',fontSize=8.5,leading=11.5,textColor=accent,spaceAfter=6),
}
def p(value,style='body'): return Paragraph(value,styles[style])
def text(value): return escape(value)
def links(items): return ' &nbsp; / &nbsp; '.join(f'<link href="{text(x["url"])}" color="#9d2c1b"><u>{text(x["label"])}</u></link>' for x in items)
story=[p(text(data['name']),'name'),p(text(data['headline']),'title'),p(text(data['location']+' | '+data['workEligibility']),'small'),p(links(data['links']),'links'),Spacer(1,4),p(text(data['summary'])),p(text(data['focus']),'small'),HRFlowable(width='100%',thickness=.7,color=colors.HexColor('#c6cbbf')),p('SELECTED WORK','section')]
for item in data['projects']:
 story.append(KeepTogether([p(text(item['name']),'entry'),p(text(item['description'])),p(text(item['stack']),'small'),p(links(item['links']),'links')]))
story.append(p('EXPERIENCE','section'))
for item in data['experience']:
 story.append(KeepTogether([p(f'{text(item["organization"])} <font name="Helvetica" size="9">| {text(item["period"])}</font>','entry'),p(text(item['role'])+'<br/>'+text(item['description']))]))
story.append(p('TOOLS &amp; METHODS','section'))
for item in data['skills']:story.append(p('<b>'+text(item['label'])+':</b> '+text(item['value']),'small'))
story.append(p('EDUCATION &amp; LANGUAGES','section'))
story.extend([p('<b>'+text(data['education']['institution'])+'</b> | '+text(data['education']['description'])+' | '+text(data['education']['status']),'small'),p(text(data['languages']),'small')])
def footer(canvas,doc):
 canvas.saveState();canvas.setFont('Helvetica',8);canvas.setFillColor(muted)
 canvas.drawString(42,25,'Updated '+data['updated'])
 canvas.drawRightString(A4[0]-42,25,'leonbede7.github.io/leonbede7/')
 canvas.restoreState()
doc=SimpleDocTemplate(str(target),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=34,bottomMargin=38,title='Leon Bede | Experience and selected work',author='Leon Bede',subject='AI implementation and product development',pageCompression=1)
doc.build(story,onFirstPage=footer,onLaterPages=footer)
reader=PdfReader(target)
content='\n'.join(page.extract_text() for page in reader.pages)
assert len(reader.pages)==1, f'Expected one page, found {len(reader.pages)}'
assert all(term in content for term in ['In progress','Automobili Galerija','Intake Eval','Hrvatski Telekom'])
assert not any(term in content for term in ['Expected 2026','final-year','@gmail.com','+385','\u2014'])
assert len(reader.pages[0].get('/Annots',[]))>=8
(ROOT/'src/profile-pdf.json').write_text(json.dumps({'dataSha256':hashlib.sha256(raw).hexdigest(),'pdfSha256':hashlib.sha256(target.read_bytes()).hexdigest()},indent=2)+'\n',encoding='utf-8')
print(f'{target}: {len(reader.pages)} page, {len(content.split())} words, {target.stat().st_size} bytes')

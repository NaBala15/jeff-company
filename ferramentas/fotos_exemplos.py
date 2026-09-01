# -*- coding: utf-8 -*-
"""Fotos das duas paginas de exemplo (institucional e catalogo), pelo ComfyUI.

Cada foto tem o prompt escrito a mao, com o NICHO explicito -- foi o que
faltou nas 98 anteriores (buffet infantil ganhou foto de evento adulto).

Uso:
    python fotos_exemplos.py teste
    python fotos_exemplos.py institucional
    python fotos_exemplos.py catalogo
    python fotos_exemplos.py tudo
"""
import io, os, sys, json, time
import urllib.parse
import urllib.request

API  = 'http://127.0.0.1:8000'
CKPT = 'sdxlYamersRealistic5_v5Rundiffusion.safetensors'
RAIZ = u'C:/Users/jeffe/OneDrive/\u00c1rea de Trabalho/Jeff Company/exemplos'

BASE = (u'professional photograph, %s, natural realistic lighting, sharp focus, '
        u'fine detail, photorealistic, shot on a full frame camera')

NEGATIVO = (u'text, letters, words, numbers, watermark, signature, logo, brand, '
            u'deformed hands, extra fingers, mutated hands, bad anatomy, '
            u'blurry, low quality, jpeg artifacts, cartoon, illustration, '
            u'3d render, cgi, oversaturated, plastic skin, stock photo look')

# ---------------------------------------------------------------------------
# INSTITUCIONAL -- Marino Contabilidade
# Escritorio de contabilidade em Campinas, 27 anos, 14 pessoas, clientes
# pequenas empresas. Paleta marinho + ambar. Serio, sobrio, humano.
# ---------------------------------------------------------------------------
NEG_RETRATO = NEGATIVO + u', full body, wide shot, group of people, children'

INSTITUCIONAL = [
 ('fachada.jpg', '4 / 5',
  u'front facade of a small ACCOUNTING OFFICE in a brazilian city, ground floor '
  u'of a modern low building, large glass window with warm interior light, '
  u'discreet dark navy signage panel without readable text, planters by the '
  u'entrance, late afternoon, street level view', NEGATIVO),

 ('sala-reuniao.jpg', '3 / 4',
  u'meeting room of a brazilian ACCOUNTING FIRM, long wooden table, six chairs, '
  u'documents and a laptop on the table, glass partition wall, navy blue and '
  u'warm wood interior, daylight from a side window, no people', NEGATIVO),

 ('recepcao.jpg', '1 / 1',
  u'reception desk of a small brazilian ACCOUNTING OFFICE, dark navy counter, '
  u'brass desk lamp, a plant, two waiting chairs, warm and tidy, no people',
  NEGATIVO),

 ('nelson.jpg', '1 / 1',
  u'corporate headshot portrait of a brazilian MAN in his early sixties, '
  u'grey hair, glasses, navy suit jacket over open collar shirt, calm confident '
  u'expression, seated in an accounting office, softly blurred background, '
  u'waist up', NEG_RETRATO),

 ('priscila.jpg', '1 / 1',
  u'corporate headshot portrait of a brazilian WOMAN in her early forties, '
  u'shoulder length dark hair, blazer, friendly professional expression, '
  u'standing in an accounting office, softly blurred background, waist up',
  NEG_RETRATO),

 ('diego.jpg', '1 / 1',
  u'corporate headshot portrait of a brazilian MAN in his early thirties, '
  u'short dark hair, light blue shirt, approachable expression, in an office '
  u'with desks behind, softly blurred background, waist up', NEG_RETRATO),
]

# ---------------------------------------------------------------------------
# CATALOGO -- Cozinha da Vila
# Marmitaria de comida caseira brasileira, em Sorocaba. Entrega em casa.
# Paleta tomate + mostarda + creme. Comida de verdade, nao restaurante chique.
# ---------------------------------------------------------------------------
COMIDA = (u', brazilian home style food, appetising, top down or 45 degree angle, '
          u'rustic wooden table, soft daylight, shallow depth of field')

CATALOGO = [
 ('hero-marmita.jpg', '4 / 3',
  u'open takeaway meal box filled with brazilian home cooked food, white rice, '
  u'black beans, grilled steak with onions, french fries and fresh salad' + COMIDA,
  NEGATIVO),

 ('marmita-tradicional.jpg', '4 / 3',
  u'takeaway meal box with white rice, brazilian black beans, sliced steak with '
  u'onions, french fries and salad' + COMIDA, NEGATIVO),

 ('marmita-frango.jpg', '4 / 3',
  u'takeaway meal box with white rice, beans, grilled chicken breast fillet and '
  u'steamed vegetables, carrots and broccoli' + COMIDA, NEGATIVO),

 ('marmita-vegetariana.jpg', '4 / 3',
  u'takeaway meal box with brown rice, beans, stuffed zucchini boats and green '
  u'salad, vegetarian meal, no meat' + COMIDA, NEGATIVO),

 ('marmita-familia.jpg', '4 / 3',
  u'large family size takeaway container filled with brazilian home cooked food '
  u'for two people, rice, beans, meat and vegetables' + COMIDA, NEGATIVO),

 ('feijoada.jpg', '4 / 3',
  u'brazilian feijoada served in a black clay pot with a side of white rice, '
  u'sauteed collard greens, cassava flour farofa and orange slices' + COMIDA,
  NEGATIVO),

 ('parmegiana.jpg', '4 / 3',
  u'breaded chicken cutlet parmigiana with tomato sauce and melted cheese, '
  u'served with white rice and french fries on a plate' + COMIDA, NEGATIVO),

 ('strogonoff.jpg', '4 / 3',
  u'creamy brazilian beef stroganoff served with white rice and crispy potato '
  u'sticks on a plate' + COMIDA, NEGATIVO),

 ('fritas.jpg', '4 / 3',
  u'portion of crispy golden french fries with coarse salt and rosemary served '
  u'in a metal basket' + COMIDA, NEGATIVO),

 ('bolinho.jpg', '4 / 3',
  u'six small round deep fried savoury croquettes on a plate, golden crust, one '
  u'broken open showing the shredded meat filling' + COMIDA, NEGATIVO),

 ('pudim.jpg', '4 / 3',
  u'slice of brazilian creme caramel flan with dark caramel sauce on a small '
  u'plate, glossy smooth surface' + COMIDA, NEGATIVO),

 ('bolo-fuba.jpg', '4 / 3',
  u'slice of brazilian cornmeal cake with guava paste filling on a plate, '
  u'homemade, golden crumb' + COMIDA, NEGATIVO),

 ('suco.jpg', '4 / 3',
  u'tall glass of fresh orange juice with condensation, a jug beside it and '
  u'cut oranges' + COMIDA, NEGATIVO),

 ('refrigerante.jpg', '4 / 3',
  u'three cold plain aluminium soda cans without any label or writing, covered '
  u'in condensation drops, on a rustic wooden table, soft daylight', NEGATIVO),

 ('cozinha.jpg', '16 / 9',
  u'small brazilian home style commercial KITCHEN in service, two ADULT cooks '
  u'in their forties wearing white aprons plating takeaway meal boxes on a '
  u'stainless steel counter, steam rising from pans, busy but tidy, '
  u'no children in frame', NEGATIVO),

 ('entrega.jpg', '16 / 9',
  u'ADULT brazilian delivery man in his thirties holding an insulated delivery '
  u'bag beside a motorcycle in front of a small food shop, daytime street, '
  u'no children in frame', NEGATIVO),
]

TAMANHO = {
 '1 / 1':   (1024, 1024),
 '4 / 5':   (832, 1040),
 '3 / 4':   (888, 1184),
 '4 / 3':   (1184, 888),
 '16 / 9':  (1360, 768),
}


# ------------------------------------------------------------------ API
def post(caminho, dados):
    req = urllib.request.Request(API + caminho,
                                 data=json.dumps(dados).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read())


def get(caminho):
    return json.loads(urllib.request.urlopen(API + caminho, timeout=30).read())


def fluxo(pos, neg, larg, alt, semente):
    return {
      "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": CKPT}},
      "2": {"class_type": "CLIPTextEncode", "inputs": {"text": pos, "clip": ["1", 1]}},
      "3": {"class_type": "CLIPTextEncode", "inputs": {"text": neg, "clip": ["1", 1]}},
      "4": {"class_type": "EmptyLatentImage",
            "inputs": {"width": larg, "height": alt, "batch_size": 1}},
      "5": {"class_type": "KSampler",
            "inputs": {"seed": semente, "steps": 30, "cfg": 6.0,
                       "sampler_name": "dpmpp_2m", "scheduler": "karras",
                       "denoise": 1.0, "model": ["1", 0],
                       "positive": ["2", 0], "negative": ["3", 0],
                       "latent_image": ["4", 0]}},
      "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
      "7": {"class_type": "SaveImage",
            "inputs": {"images": ["6", 0], "filename_prefix": "jc-exemplos"}},
    }


def gerar(nome, prop, prompt, negativo, destino, semente=None):
    larg, alt = TAMANHO[prop]
    sem = semente if semente is not None else (abs(hash(nome)) % 2**31)
    pid = post('/prompt', {'prompt': fluxo(BASE % prompt, negativo, larg, alt, sem)})['prompt_id']

    for _ in range(400):
        time.sleep(2)
        h = get('/history/' + pid)
        if pid not in h:
            continue
        for no in h[pid]['outputs'].values():
            for img in no.get('images', []):
                url = '%s/view?filename=%s&subfolder=%s&type=%s' % (
                    API, urllib.parse.quote(img['filename']),
                    urllib.parse.quote(img.get('subfolder', '')), img['type'])
                dados = urllib.request.urlopen(url, timeout=90).read()
                from PIL import Image
                im = Image.open(io.BytesIO(dados)).convert('RGB')
                im.save(destino, 'JPEG', quality=88, optimize=True, progressive=True)
                return im.size, os.path.getsize(destino) // 1024
        raise RuntimeError('terminou sem imagem: ' + pid)
    raise RuntimeError('tempo esgotado: ' + pid)


def lote(pasta, fotos, semente_base=None):
    destino = os.path.join(RAIZ, pasta, 'fotos')
    if not os.path.isdir(destino):
        os.makedirs(destino)

    for i, (nome, prop, prompt, neg) in enumerate(fotos):
        alvo = os.path.join(destino, nome)
        t0 = time.time()
        tam, kb = gerar(nome, prop, prompt, neg, alvo,
                        None if semente_base is None else semente_base + i)
        print('  %-28s %sx%s  %4d KB  %4.0fs' % (nome, tam[0], tam[1], kb, time.time() - t0))
        sys.stdout.flush()


if __name__ == '__main__':
    modo = sys.argv[1] if len(sys.argv) > 1 else 'teste'
    sem = int(sys.argv[2]) if len(sys.argv) > 2 else None

    if modo == 'teste':
        lote('catalogo', CATALOGO[:1], sem)
    elif modo == 'institucional':
        print('institucional (%d fotos)' % len(INSTITUCIONAL))
        lote('institucional', INSTITUCIONAL, sem)
    elif modo == 'catalogo':
        print('catalogo (%d fotos)' % len(CATALOGO))
        lote('catalogo', CATALOGO, sem)
    else:
        print('institucional (%d fotos)' % len(INSTITUCIONAL))
        lote('institucional', INSTITUCIONAL, sem)
        print('catalogo (%d fotos)' % len(CATALOGO))
        lote('catalogo', CATALOGO, sem)
    print('pronto')

# -*- coding: utf-8 -*-
"""Fotos dos dois modelos simples do ramo institucional.

Nicho escrito em cada prompt, que e a licao das 98 anteriores.

    python fotos_institucional.py juridico
    python fotos_institucional.py cuidado
    python fotos_institucional.py tudo
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fotos_exemplos import gerar, NEGATIVO, TAMANHO   # reaproveita o motor

RAIZ = u'C:/Users/jeffe/OneDrive/\u00c1rea de Trabalho/Jeff Company/modelos/institucional'

NEG_RETRATO = NEGATIVO + u', full body, wide shot, group of people, children'

# ---------------------------------------------------------------------------
# SIMPLES 1 -- Bertoldi & Salles Advocacia
# Escritorio pequeno em Sao Bernardo do Campo. Carvao + bordo + bronze.
# Sobrio, sem ostentacao: nao e escritorio de Faria Lima.
# ---------------------------------------------------------------------------
JURIDICO = [
 ('01-sala-atendimento.jpg', '4 / 3',
  u'meeting room of a small brazilian LAW OFFICE, dark wooden table with four '
  u'chairs, closed law books and a folder on the table, dark grey walls, brass '
  u'desk lamp, warm side window light, sober and understated, no people',
  NEGATIVO),

 ('02-helena.jpg', '1 / 1',
  u'corporate headshot portrait of a brazilian WOMAN LAWYER in her mid forties, '
  u'dark hair pulled back, charcoal blazer, serious but warm expression, arms '
  u'relaxed, standing in a law office with bookshelves softly blurred behind, '
  u'waist up', NEG_RETRATO),

 ('03-rodrigo.jpg', '1 / 1',
  u'corporate headshot portrait of a brazilian MAN LAWYER in his early forties, '
  u'short dark hair, light beard, navy suit without tie, calm approachable '
  u'expression, seated at a desk in a law office, softly blurred background, '
  u'waist up', NEG_RETRATO),

 ('04-escritorio.jpg', '3 / 4',
  u'tall dark wooden bookshelf filled with old leather bound LAW BOOKS in a '
  u'brazilian law office, a green banker lamp on a side table, warm low light, '
  u'shallow depth of field, no people, no readable text on the spines',
  NEGATIVO),
]

# ---------------------------------------------------------------------------
# SIMPLES 2 -- Espaco Vivo, psicologia e terapia
# Casa adaptada em Santo Andre. Salvia + terracota + areia.
# Acolhedor e discreto. NUNCA mostrar paciente em atendimento.
# ---------------------------------------------------------------------------
CUIDADO = [
 ('01-sala-atendimento.jpg', '4 / 3',
  u'THERAPY ROOM of a brazilian psychology practice, two comfortable armchairs '
  u'facing each other with a small side table between them, a plant, soft sage '
  u'green wall, warm natural light through a linen curtain, calm and welcoming, '
  u'EMPTY ROOM with no people', NEGATIVO),

 ('02-camila.jpg', '1 / 1',
  u'portrait of a brazilian WOMAN PSYCHOLOGIST in her mid forties, shoulder '
  u'length wavy dark hair, soft knit sweater in earth tones, calm and kind '
  u'expression, seated in an armchair, warm blurred interior behind, waist up',
  NEG_RETRATO),

 ('03-taina.jpg', '1 / 1',
  u'portrait of a young brazilian WOMAN PSYCHOLOGIST around thirty, curly dark '
  u'hair, terracotta coloured shirt, friendly open expression, standing in a '
  u'bright warm room, softly blurred background, waist up', NEG_RETRATO),

 ('04-marina.jpg', '1 / 1',
  u'portrait of a brazilian WOMAN PSYCHOLOGIST around fifty, short grey and '
  u'dark hair, sage green blouse, serene thoughtful expression, seated by a '
  u'window, warm blurred interior, waist up', NEG_RETRATO),

 ('05-sala-espera.jpg', '16 / 9',
  u'small quiet WAITING ROOM of a brazilian psychology practice inside a house, '
  u'two armchairs, a low table with a water jug, plants, wooden floor, warm '
  u'lamp light, sage and sand colours, EMPTY with no people', NEGATIVO),

 ('06-fachada.jpg', '16 / 9',
  u'front facade of a small brazilian HOUSE converted into a psychology '
  u'practice, white walls with sage green window frames, a wooden gate, garden '
  u'plants by the entrance, quiet residential street, late afternoon light, '
  u'no readable signage text', NEGATIVO),
]


def lote(pasta, fotos, base=None):
    destino = os.path.join(RAIZ, pasta)
    for i, (nome, prop, prompt, neg) in enumerate(fotos):
        alvo = os.path.join(destino, nome)
        tam, kb = gerar(nome + pasta, prop, prompt, neg, alvo,
                        None if base is None else base + i)
        print('  %-26s %sx%s  %4d KB' % (nome, tam[0], tam[1], kb))
        sys.stdout.flush()


if __name__ == '__main__':
    modo = sys.argv[1] if len(sys.argv) > 1 else 'tudo'
    if modo in ('juridico', 'tudo'):
        print('simples-01-juridico (%d fotos)' % len(JURIDICO))
        lote('simples-01-juridico', JURIDICO)
    if modo in ('cuidado', 'tudo'):
        print('simples-02-cuidado (%d fotos)' % len(CUIDADO))
        lote('simples-02-cuidado', CUIDADO)
    print('pronto')

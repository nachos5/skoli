import nltk
import random

from collections import Counter
from decimal import Decimal
from prettytable import PrettyTable
from timeit import Timer


def get_grammar():
    """
    Aðferð sem skilar heimatilbúinni samhengisfrjálsri mállýsingu
    """
    store = nltk.corpus.wordnet.synset("store.n.01")
    store_hypos = [
        "'" + h.name().split(".")[0].replace("'", "") + "'" for h in store.hyponyms()
    ]
    nofn = ["'Alfred'", "'Jenna'", "'Sarah'"]
    nafnord = ["'boy'", "'girl'"]
    sagnir = ["'walks'", "'looks'", "'reads'"]
    sagnir_þt = ["'walked'", "'went'", "'looked'"]
    det = ["'a'", "'the'"]
    forsetningar_1 = ["'at'", "'in'", "'into'"]
    forsetningar_2 = ["'into'", "'past'"]
    prp = ["'my'", "'our'", "'her'", "'his'"]
    # | V NP PP
    grammar_strengur = f"""
      S -> NP VP
      VP -> V P DetPRP NS | VPAST P2 DetPRP NS
      PP -> P NP
      DetPRP -> Det | PRP
      V -> {" | ".join(sagnir)}
      VPAST -> {" | ".join(sagnir_þt)}
      NP -> Det N | {" | ".join(nofn)}
      N -> {" | ".join(nafnord)}
      NS -> {" | ".join(store_hypos)}
      Det -> {" | ".join(det)}
      P -> {" | ".join(forsetningar_1)}
      P2 -> {" | ".join(forsetningar_2)}
      PRP -> {" | ".join(prp)}
    """
    grammar = nltk.CFG.fromstring(grammar_strengur)

    return grammar


def rand_sent_from_grammar(grammar, start):
    """
    Endurkvæm hjálparaðferð sem býr til setningu út frá samhengisfrjálsri mállýsingu

    Breytur:
    grammar: samhengisfrjáls mállýsing
    start: byrjunartákn

    Skilagildi:
    string: setning
    """
    if type(start) is str:
        return [start]

    pro = grammar.productions(start)
    lengd = len(pro)
    if lengd > 1:
        # ef fleiri en einn möguleiki veljum við að handahófi
        randint = random.randint(0, lengd - 1)
    else:
        randint = 0
    # sækjum hægri hliðina
    rhs = pro[randint].rhs()
    if len(rhs) > 1:
        vidbot = []
        # förum í gegnum reglurnar endurkvæmt
        for r in rhs:
            vidbot += rand_sent_from_grammar(grammar, r)
        return vidbot
    else:
        return rand_sent_from_grammar(grammar, rhs[0])


def merkingargreining():
    # ver 2
    read_expr = nltk.sem.Expression.fromstring
    expr_1 = read_expr("like(Angus, Cyril) & hate(Irene, Cyril)", type_check=True)
    expr_2 = read_expr("taller(Tofu, Bertie)", type_check=True)
    expr_3 = read_expr("love(Bruce, Bruce) & love(Pat, Pat)", type_check=True)
    expr_4 = read_expr("saw(Cyril, Bertie) & -saw(Angus, Bertie)", type_check=True)
    expr_5 = read_expr("has_four_legs(Cyril) & friendly(Cyril)", type_check=True)
    expr_6 = read_expr("near(Tofu, Olive) & near(Olive, Tofu)", type_check=True)
    expressions = [expr_1, expr_2, expr_3, expr_4, expr_5, expr_6]
    for expr in expressions:
        print(expr)


def textaframleidsla():
    grammar = get_grammar()
    rand_sents = []
    for i in range(10):
        rand_sents.append(rand_sent_from_grammar(grammar, grammar.start()))
    for sent in rand_sents:
        s = " ".join(sent).replace("_", " ")
        s = s[0].upper() + s[1:] + "."
        print(s)


# textaframleidsla()
merkingargreining()


import re
import sys
import string

def tilreidari(textaskra):
  texti = ""

  for lina in textaskra:
    # bilum breytt í nýja línu, ef ný málsgrein er auð lína á milli sem viðhelst
    lina = re.sub(r"\s", "\n", lina)

    ### greinarmerki fyrir utan punkt 
    # stafur svo greinarmerkið svo bil + algeng greinarmerki => aðskiljum (tökum líka skástrik út hérna því í yfirgnæfandi líkur á urli)
    regex = "(.)([" + re.escape(string.punctuation.replace('.', '').replace('/', '')) + "])[\s\.,!?]"
    lina = re.sub(regex, r"\1\n\2\n", lina)
    # bil + algeng greinarmerki svo greinarmerkið svo stafur => aðskiljum
    regex = "[\s\.,!?]([" + re.escape(string.punctuation.replace('.', '')) + "])(.)"
    lina = re.sub(regex, r"\n\1\n\2", lina)
    # ef það er svigi inní orði (t.d. upplýst(ur)) myndi ) lenda í nýrri línu => lögum það
    regex = "(\w+\(\w+)\n(\))"
    lina = re.sub(regex, r"\1\2", lina)

    ### punktur
    # stafur, punktur, bil og svo stór stafur => aðskiljum
    regex = r"(\w)\.\s([A-ZÁÉÍÓÚÝÆÖÞ])"
    lina = re.sub(regex, r"\1\n.\n\2", lina)
    # línan endar á punkti => aðskilja
    lina = re.sub(r"\.$", "\n.", lina)
    # ef línan hefst á tölu með fylgjandi punkti erum við með upptalningu og viljum ekki aðskilja
    lina = re.sub(r"^(\d*)\n\.", r"\1.", lina)
    
    # ef fleiri en ein auð lína í röð => breytum í eina auða línu
    lina = re.sub(r"^\s*\n$", r"\n", lina)
    
    texti += lina

  return texti


# fyrsta arg er input skrá, annað er output skrá
inp = sys.argv[1]
out = sys.argv[2]
# lesum skránna
textaskra = open(inp, "r")
# tilreiðum
texti_t = tilreidari(textaskra)
# vistum
out_file = open(out, "w")
out_file.write(texti_t)
out_file.close()

from collections import Counter


def main():
    strengur = input()
    skref = 0
    # dict á forminu stafur:fjöldi og röðum frá lægsta í hæsta
    # svo óalgengustu stafirnir séu tékkaðir fyrst
    c = Counter(strengur).most_common()
    for key, val in list(reversed(c)):
        # tékkum hvort við getum fjarlægt þennan staf
        len_an_key = len(set(strengur.replace(key, "")))
        if len_an_key > 2:
            strengur = strengur.replace(key, "")
            skref += val
        # ef simplicity er 1 2 þá stoppum við
        elif len_an_key == 2:
            print(skref + val)
            return
        # ef einn stafur
        else:
            print(0)
            return


main()

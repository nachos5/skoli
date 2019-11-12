import collections
import re

from datetime import datetime


class Dagatal:
    def __init__(self, *args, **kwargs):
        """ 
        Dagskráin er geymd í dict hlut á forminu
        tími:nafn viðburðar
        """
        self.dagskra = dict()

    def saekja_dagskra(self):
        """ skilar dagskránni á OrderedDict formi """
        od = collections.OrderedDict(sorted(self.dagskra.items()))
        return od

    def baeta_vid(self, timi, vidburdur):
        """
        Bætir við í dagskránna.

        timi - heiltala frá 0-24
        viburdur - strengur
        """
        if timi in self.dagskra:
            raise Exception("Það er nú þegar viðburður á þessum tíma!")
        self.dagskra[timi] = vidburdur.rstrip()

    def naest(self):
        """
        Sækir næsta viðburð á dagskránni miðað við hvað kl. er þegar
        kallað er á aðferðina.
        """
        nuna = datetime.now().hour
        # sækjum allar klst-irnar sem eru núna á dagskránni
        klstir = list(self.dagskra.keys())
        klstir.sort()
        # finnum fyrstu sem er stærri en núna
        try:
            naest = next(k for k in klstir if k > nuna)
        except:
            return "Dagskráin er búin í dag."
        # skilum viðburðinum fyrir þessa klst
        return "Viðburður: {vidburdur}, klukkan: {klukkan}".format(
            vidburdur=self.dagskra[naest], klukkan=naest
        )

    def baeta_vid_med_mallysingu(self, strengur):
        """
        Tekur inn streng og skoðar hvort hann passi við mállýsinguna fyrir
        að bæta við viðburði á dagskránna. Dæmi um gilda strengi væri t.d.

        'Bættu við fundi með Jóhönnu á dagatalið kl. 15.'
        'Settu hestakerrusýningu inn kl. 13'
        """
        r = "([Bb]ættu við|[Ss]ettu( inn)?) (?P<viðburðarnafn>(\w+ )+)"
        r += "(inn)?(á dagatalið( mitt)?)? kl. (?P<tími>(\w|:)+)"
        r += "( á dagatalið( mitt)?)?"
        m = re.search(r, strengur)
        if not m:
            return None
        vidburdur = m.group("viðburðarnafn")
        timi = m.group("tími")
        timi = int(timi[:2])
        self.baeta_vid(timi, vidburdur)
        return m

    def saekja_dagskra_mallysing(self, strengur):
        """
        Tekur við streng og athugar hvort hann passi við mállýsingu
        sem athugar hvort eigi að sækja alla dagskránna. Dæmi um gilda strengi:

        'sækja dagatalið.'
        'Hvað er á dagatalinu?'
        """
        r = "([Ss]ækja dagatal(ið)?(\.)?)|([Hh]vað er á dagatalinu(\?)?)"
        m = re.search(r, strengur)
        return m

    def naest_dagatal_mallysing(self, strengur):
        """
        Tekur við streng og athugar hvort hann passi við mállýsingu
        sem athugar hvort eigi að sækja næsta viðburð á dagskránni
        miðað við tíma dags sem kallað var á aðferðina. Dæmi um gilda strengi:

        'Hvað er framundan á dagskránni?'
        'hvað er næst?'
        """
        r = "([Hh]vað er (framundan|næst))((\?)|( á dagskrá(nni)?))?"
        m = re.search(r, strengur)
        return m

    def mallysing(self, strengur):
        """
        Tekur við streng og athugar hvort hann passi við einhverja
        af þeim þremur mállýsingum sem eru skilgreindar hér í aðferðunum
        fyrir ofan. Ef hann passar er sú aðgerð framkvæmd.
        """
        # prófum fyrst að bæta við
        m = self.baeta_vid_med_mallysingu(strengur)
        if m:
            return "Bætt við á dagskránna"
        # prófum næst að sækja dagatalið
        m = self.saekja_dagskra_mallysing(strengur)
        if m:
            return self.saekja_dagskra()
        # að lokum prófum við að sækja hvað er næst á dagskránni
        m = self.naest_dagatal_mallysing(strengur)
        if m:
            return self.naest()
        # ef við komumst hingað skilst setningin ekki
        raise Exception("Því miður skilur forritið ekki þessa setningu.")


def main():
    d = Dagatal()
    # almenn dæmi
    d.baeta_vid(10, "Trampólínpása")
    print(d.naest())
    d.baeta_vid(22, "Jólaföndur")
    print(d.naest())
    print(d.saekja_dagskra())
    print()
    # mállýsingardæmi
    print(d.mallysing("Bættu við fundi með Jóhönnu á dagatalið kl. 15."))
    print(d.mallysing("Settu hestakerrusýningu inn kl. 13"))
    print(d.mallysing("sækja dagatalið."))
    print(d.mallysing("Hvað er á dagatalinu?"))
    print(d.mallysing("Hvað er framundan á dagskránni?"))
    print(d.mallysing("hvað er næst?"))
    print()
    # prófum óskiljanlega setningu
    print(d.mallysing("Halló ég heiti Epli"))


main()

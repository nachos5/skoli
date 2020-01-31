def main():
    n = int(input())

    for i in range(n):
        inp_str = input()
        heilt_listi = [x for x in inp_str.split(",")]
        veldi = len(heilt_listi) - 1
        summa = 0

        for h in heilt_listi:
            hh = int(h) if len(h) > 0 else 0
            summa += hh * (60 ** veldi)
            veldi -= 1

        print(summa)


main()

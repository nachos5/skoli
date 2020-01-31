def main():
    n = int(input())
    for i in range(n):
        lina = input().split(" ")
        count = int(lina[0])
        lina = [int(x) for x in lina[1:]]
        # sækjum difference á milli allra elementa
        lina_diff = [lina[i + 1] - lina[i] for i in range(count - 1)]
        # tékkum hvort allt það sama (arithmetic)
        sama = all(x == lina_diff[0] for x in lina_diff)
        if sama:
            print("arithmetic")
            continue
        # tékkum aftur eftir að hafa raðað
        lina = sorted(lina)
        lina_diff = [lina[i + 1] - lina[i] for i in range(count - 1)]
        sama = all(x == lina_diff[0] for x in lina_diff)
        if sama:
            print("permuted arithmetic")
            continue
        print("non-arithmetic")


main()

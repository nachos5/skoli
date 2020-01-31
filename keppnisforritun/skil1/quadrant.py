def main():
    x = int(input())
    y = int(input())
    if x > 0:
        if y > 0:
            q = 1
        else:
            q = 4
    else:
        if y > 0:
            q = 2
        else:
            q = 3
    print(q)


main()

def main():
    n = 5
    # inita borð með engum knightum
    bord = [[False] * n for _ in range(n)]
    knight_count = 0
    for i in range(n):
        line = input()
        index = 0
        # merkjum knighta á borðið
        for char in line:
            if char == "k":
                bord[i][index] = True
                knight_count += 1
            index += 1

    if not knight_count == 9:
        print("invalid")
        return

    # tékkum alla knighta
    for i in range(n):
        for j in range(n):
            curr = bord[i][j]
            if curr:
                top_left = bord[i - 2][j - 1] if i - 2 >= 0 and j - 1 >= 0 else False
                top_left_2 = bord[i - 1][j - 2] if i - 1 >= 0 and j - 2 >= 0 else False
                top_right = bord[i + 2][j - 1] if i + 2 < n and j - 1 >= 0 else False
                top_right_2 = bord[i + 1][j - 2] if i + 1 < n and j - 2 >= 0 else False
                bottom_left = bord[i - 2][j + 1] if i - 2 >= 0 and j + 1 < n else False
                bottom_left_2 = (
                    bord[i - 1][j + 2] if i - 1 >= 0 and j + 2 < n else False
                )
                bottom_right = bord[i + 2][j + 1] if i + 2 < n and j + 1 < n else False
                bottom_right_2 = (
                    bord[i + 1][j + 2] if i + 1 < n and j + 2 < n else False
                )
                if (
                    top_left
                    or top_left_2
                    or top_right
                    or top_right_2
                    or bottom_left
                    or bottom_left_2
                    or bottom_right
                    or bottom_right_2
                ):
                    # print(i, j)
                    # print(
                    #     top_left,
                    #     top_left_2,
                    #     top_right,
                    #     top_right_2,
                    #     bottom_left,
                    #     bottom_left_2,
                    #     bottom_right,
                    #     bottom_right_2,
                    # )
                    print("invalid")
                    return
    print("valid")


main()

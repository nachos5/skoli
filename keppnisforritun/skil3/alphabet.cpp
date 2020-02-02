#include <stdio.h>
#include <string>
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int longest_increase(string strengur);

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int l, a;
    string s;
    getline(cin, s);
    // cout << s << endl;
    // stafrófið er 26 stafir
    a = 26;
    // lengsta runa strengsins
    // l = min(longest_increase(s), a);
    l = longest_increase(s);
    // það sem vantar þá uppá er a-l
    cout << (a-l) << endl;

    return 0;
}

// abcdefghijklmnopqrstuvwxyz
int longest_increase(string strengur) {
    int l = strengur.length();
    if (l == 0) return 0;
    int keep, skip, curr, prev;
    vector<vector<int>> a(l + 1, vector<int>(l + 1, 0));
    // base case-ið 0 ef i=0
    for (int j = 0; j < l; j++) {
        a[0][j] = 0;
    }
    for (int i = 1; i <= l; i++) {
        for (int j = 1; j <= l; j++) {
            keep = a[i - 1][i] + 1;
            skip = a[i - 1][j];
            // er núverandi stafur á undan síðasta í stafrófinu? Eða fyrsta stepið
            curr = strengur[i - 1];
            prev = strengur[j - 1];
            // a-z ascii
            bool az = curr >= 97 && curr <= 122 && prev >= 97 && prev <= 122;
            if ((curr < prev && az) || (i == l && j == l && az)) {
                a[i][j] = max(keep, skip);
            }
            else {
                a[i][j] = skip;
            }
        }
    }


    return a[l][l];
}
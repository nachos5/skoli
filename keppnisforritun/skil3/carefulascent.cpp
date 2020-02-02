#include <stdio.h>
#include <string>
#include <vector>
#include <iostream>
using namespace std;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int x, y, n, l, u;
    double f, bil, t = 0;

    cin >> x;
    cin >> y;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> l;
        cin >> u;
        cin >> f;
        // tíminn sem það tekur að ferðast í gegnum skjöldinn
        bil = u - l;
        t += bil * f;
        // getum fjarlægt þetta bil úr því sem á eftir að ferðast
        y -= bil;
    }
    // bætum restinni við á venjulegum hraða (enginn skjöldur)
    t += y;
    // á hvaða hraða þurfum við að fara til að enda á þessum tíma
    printf("%.10f", (x / t));

    return 0;
}
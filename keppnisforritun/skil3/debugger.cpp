#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

long long debugger(long long lines);

// code lines, run tími, tími að adda printf
long long n, r, p;

vector<long long> memo;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    cin >> n >> r >> p;
    memo.resize(n + 1, -1);

    cout << debugger(n) << endl;

    return 0;
}

long long debugger(long long lines) {
    // bara ein lína svo þarf ekkert
    if (lines == 1) return 0;
    // tvær línur => print í miðjuna svo runna
    if (lines == 2) return p + r;
    if (memo[lines] != -1) return memo[lines];

    // annars tveir möguleikar => prints inní kóðanum eða print á eftir öllum línum:

    // print á eftir öllum línum nema síðustu:
    long long t = (lines - 1) * p + r;
    long long prev = 0;
    for (long long i = 1; i < lines - 1; i++) {
        long long skipting = (lines + (i - 1)) / i - 1;
        if (skipting == prev) continue;
        prev = skipting;
        t = min(t, debugger(i) + skipting * p + r);
    }
    memo[lines] = t;

    return t;
}
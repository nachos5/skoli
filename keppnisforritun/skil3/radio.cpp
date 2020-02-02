#include <stdio.h>
#include <string>
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

// hversu margir eru að hlusta á i-th auglýsingabreak => profit
vector<int> l;
int profit(int i, int sum);

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // commercial breaks og verð per break
    int n, p;
    cin >> n;
    cin >> p;

    int e;
    for (int i = 0; i < n; i++) {
        cin >> e;
        // mínus kostnaður
        l.push_back(e - p);
    }

    //cout << endl;
    //for (int i = 0; i < n; i++) cout << l[i] << " ";
    //cout << endl;

    cout << profit(n, 0) << endl;
    return 0;
}

int profit(int n, int sum) {
    int max_so_far = l[0];
    int curr_max = l[0];

    for (int i = 1; i < n; i++) {
        // reset eða halda áfram
        curr_max = max(l[i], curr_max + l[i]);
        max_so_far = max(max_so_far, curr_max);
    }

    return max_so_far;
}
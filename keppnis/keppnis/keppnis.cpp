#include <stdio.h>
#include <string>
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int walrus(int i, int sum);
int closer(int value, int x, int y);

// global breytur
vector<int> weights;
vector<vector<bool>> memo;
int max_sum = 0;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int n, w;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> w;
        weights.push_back(w);
        max_sum += w;
    }
    memo.resize(n + 1, vector<bool>(max_sum + 1, false));

    cout << walrus(n, 0) << endl;

    return 0;
}

int walrus(int i, int sum) {
    if (i == 0) {
        return sum;
    }
    int keep, skip;

    if (memo[i - 1][sum + weights[i - 1]]) {
        keep = memo[i - 1][sum + weights[i - 1]];
        cout << "memo" << endl;
    }
    else {
        keep = walrus(i - 1, sum + weights[i - 1]);
        memo[i - 1][sum + weights[i - 1]] = keep;
    }

    if (memo[i - 1][sum]) {
        skip = memo[i - 1][sum];
        cout << "memo" << endl;
    }
    else {
        skip = walrus(i - 1, sum);
        memo[i - 1][sum] = skip;
    }

    return closer(1000, keep, skip);
}

int closer(int value, int x, int y) {
    int xx = abs(x - value);
    int yy = abs(y - value);
    if (xx < yy) {
        return x;
    }
    else if (xx > yy) {
        return y;
    }
    else {
        // ef jafnt returnum við hærra gildinu
        return max(x, y);
    }
}
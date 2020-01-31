#include <bits/stdc++.h>
using namespace std;

// byrjum aftast, include-um current eða skippum
long long int subsetSumUnder(vector<int> weights, int i, int n_fruits, int total) {
  // við vitum að minnsta weight er 50 svo yfir 4 fruits er alltaf > 200
  if (i == weights.size() || n_fruits == 4) {
    if (total < 200) return total;
    return 0;
  }

  // include
  int next = total + weights[i];
  long long int sum1 = subsetSumUnder(weights, i+1, n_fruits+1, next);
  // skip current
  long long int sum2 = subsetSumUnder(weights, i+1, n_fruits, total);
  // cout << sum1 << " " << sum2 << endl;
  return sum1 + sum2;
}

int main()
{
  ios_base::sync_with_stdio(false); 
  cin.tie(NULL);
  
  int n;
  vector<int> weights;
  cin >> n;

  map<string, int> memo;

  for (int i = 0; i < n; i++)
  {
    int w;
    cin >> w;
    weights.push_back(w);
  }

  // það eru 2^n-1 möguleg subset
  long long int total_possible = accumulate(weights.begin(), weights.end(), 0) * pow(2, n-1);
  long long int undir = subsetSumUnder(weights, 0, 0, 0);
  long long int total = total_possible - undir;

  cout << total << endl;
}
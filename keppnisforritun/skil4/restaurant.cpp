#include <bits/stdc++.h>
using namespace std;

int main()
{
  ios_base::sync_with_stdio(false);
  cin.tie(NULL);

  // items on menu, no orders placed
  int n, m;
  // utils dót
  int max, next_val, counter, index, i, j, w;

  cin >> n;
  // item kostnaður
  int* c = (int*) malloc(n * sizeof(int));
  //vector<int> c(n);
  for (i = 0; i < n; i++)
  {
    cin >> c[i];
  }
  cin >> m;
  // order kostanður
  int* s = (int*) malloc(m * sizeof(int));
  //vector<int> s(m);
  for (i = 0; i < m; i++)
  {
    cin >> s[i];
  }
  max = *max_element(s, s+m);
  //vector<int> cache(s[m-1] + 1, -1);
  int* cache = (int*) malloc((32000) * sizeof(int));
  cache[0] = 0;
  for (j=1; j<=max; ++j) cache[j] = -1;

  // skoðum hvaða gildi við getum fengið fyrir verðin
  // (frá 0 uppí max order kostnaðinn)
  for (i=0; i<n; ++i) {
    for (j=0; j<=max; ++j) {
      // tékkum hvort gildið getur komið upp
      if (cache[j] > -1) {
        next_val = cache[j + c[i]];
        // ef næsta gildi hefur ekki verið stillt áður
        if (next_val == -1) cache[j + c[i]] = i;
        // hefur verið stillt áður og þá fleiri en ein lausn
        else cache[j + c[i]] = -2;
      }
      // hefur komið áður og þá er næst líka merkt
      if (cache[j] == -2) cache[j + c[i]] = -2;
    }
  }

  int* item_counter = (int*) malloc(m * sizeof(int));
  //vector<int> item_counter(m);
  // tékkum orders
  for (i=0; i<m; ++i) {
    if (cache[s[i]] <= -2) cout << "Ambiguous" << endl;
    else if (cache[s[i]] == -1) cout << "Impossible" << endl;

    // þurfum að backtracka lausnina
    else {
      for (j=0; j<m; ++j) item_counter[j] = 0;
      counter = s[i];
      while (counter > 0) {
        index = cache[counter];
        ++item_counter[index];
        counter -= c[index];
      }

      for (j=0; j<m; ++j) {
        // prenta út jafn oft og kemur fyrir
        for (w=0; w<item_counter[j]; ++w) {
          cout << j+1 << " ";
        }
      }
      cout << endl;
    }
  }

  return 0;
}
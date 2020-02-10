#include <bits/stdc++.h>
using namespace std;

void greedy(int value);
bool dp(int value);

// myntstærðir, fjöldi stærða, minnsta counterexample (n og s)
int *d, n, s, i, j;
int *greedy_cache;
int *dp_cache;

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    cin >> n;
    d = (int*) malloc(n * sizeof(int)); // myntstærðir
    for (i=0; i<n; i++) {
      cin >> d[i];
    }
    
    s = d[n-1] + d[n-2] - 1;
    greedy_cache = (int*) malloc(s * sizeof(int));
    dp_cache = (int*) malloc(s * sizeof(int));
    greedy(s);
    bool canonical = dp(s);

    if (canonical) {
      cout << "canonical" << endl;
    } else {
      cout << "non-canonical" << endl;
    }

    return 0;
}

void greedy(int value) {
  greedy_cache[0] = 0;
  for (i=0; i<n; ++i) {
    for (j=1; j<=value; j++) {
      if (j >= d[i]) {
        greedy_cache[j] = greedy_cache[j - d[i]] + 1;
      }
    }
  }
}

bool dp(int value) {
  // base case
  dp_cache[0] = 0;
  // stillum sem max (erum að nota lágu gildin)
  for (i=1; i<=value; ++i) {
    dp_cache[i] = INT_MAX;
  }
  // finnum min coins sem þarf fyrir 1 til value
  for (i=1; i<=value; ++i) {
    for (j=0; j<n; ++j) {
      // tékkum bara coin minni en curr value-ið
      if (d[j] <= i) {
        // sjáum hvað við fáum ef við mínusum coinið við curr value (i)
        int next = dp_cache[i - d[j]];
        if (next != INT_MAX && next+1 < dp_cache[i]) {
          dp_cache[i] = next + 1;
          // um leið og ef við fáum verri greedy lausn getum við hætt
          if (greedy_cache[i] > dp_cache[i]) {
            return false;
          }
        }
      }
    }
  }

  return true;
}
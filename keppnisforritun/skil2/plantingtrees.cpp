#include <bits/stdc++.h>
using namespace std;

void debug(string s);

int main()
{
  int n_seedlings;
  int max = 0;
  vector<int> seedlings;

  cin >> n_seedlings;
  cin.ignore();

  for (int i=0; i<n_seedlings; i++) {
    int seed;
    cin >> seed;
    seedlings.push_back(seed);
  }

  sort(seedlings.begin(), seedlings.end(), greater<int>());

  for (int i=0; i<seedlings.size(); i++) {
    int day = i+1;
    int seedling_time = seedlings[i] + day;
    if (seedling_time > max) max = seedling_time;
  }

  // +1 útaf next day
  cout << max + 1 << endl;

  return 0;
}

void debug(string s) {
  cout << s << endl;
}
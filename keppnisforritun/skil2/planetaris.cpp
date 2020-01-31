#include <bits/stdc++.h>
using namespace std;

int main()
{
  ios_base::sync_with_stdio(false); 
  cin.tie(NULL);
  
  int n, a_ships;
  cin >> n;
  cin >> a_ships;
  
  vector<int> f_ships;
  for (int i=0; i<n; i++) {
    int in;
    cin >> in;
    f_ships.push_back(in);
  }

  // röðum árásarfjölda Finna frá lægsta til hæsta
  sort(f_ships.begin(), f_ships.end());

  // reynum að láta Atla fara alltaf einum yfir lægstu áráis Finna
  int a_wins = 0;
  for (int i=0; i<n; i++) {
    int curr = f_ships[i];
    if (a_ships > curr) {
      a_wins++;
      a_ships -= curr + 1;
    }
  }

  cout << a_wins << endl;

  return 0;
}
#include <bits/stdc++.h>
using namespace std;

void debug(string s);

int main()
{
  int n_ints;
  vector<int> ints;
  int a = 0;
  int b = 0;
  bool a_turn = true;

  cin >> n_ints;
  cin.ignore();

  for (int i=0; i<n_ints; i++) {
    int integer;
    cin >> integer;
    ints.push_back(integer);
  }

  // lækkandi röðun
  sort(ints.begin(), ints.end());

  while(!ints.empty()) {
    if (a_turn) a += ints.back();
    else b += ints.back();
    ints.pop_back();
    a_turn = !a_turn;
  }

  cout << a << ' ' << b << endl;

  return 0;
}

void debug(string s) {
  cout << s << endl;
}
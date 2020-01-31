#include <bits/stdc++.h>
using namespace std;

int main()
{
  auto start = chrono::steady_clock::now();

  int n;
  scanf("%d", &n);
  printf("%d", n);

  auto end = chrono::steady_clock::now();
  auto diff = end - start;
  cout << chrono::duration <double, milli> (diff).count() << " ms" << endl;

  return 0;
}
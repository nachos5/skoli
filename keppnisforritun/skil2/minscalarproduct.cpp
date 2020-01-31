#include <bits/stdc++.h>
using namespace std;

void test_case(int n);

int main()
{
  // auto start = chrono::steady_clock::now();

  int test_cases;
  cin >> test_cases;

  for (int i = 0; i < test_cases; i++)
  {
    test_case(i+1);
  }

  // auto end = chrono::steady_clock::now();
  // auto diff = end - start;
  // cout << chrono::duration <double, milli> (diff).count() << " ms" << endl;

  return 0;
}

void test_case(int n)
{
  vector<int> x, y;
  long long int sum = 0;
  int vector_size;
  scanf("%d", &vector_size);

  for (int j = 0; j < vector_size; j++)
  {
    int in;
    scanf("%d", &in);
    x.push_back(in);
  }

  for (int j = 0; j < vector_size; j++)
  {
    int in;
    scanf("%d", &in);
    y.push_back(in);
  }

  // sorterum á sitthvora vegu
  sort(x.begin(), x.end());
  sort(y.begin(), y.end());

  for (int i = 0; i < vector_size; i++)
  {
    sum += (x[i] * y[vector_size-1-i]);
  }

  printf("Case #%d: %lld\n", n, sum);
}
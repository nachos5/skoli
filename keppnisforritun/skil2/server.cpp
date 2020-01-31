#include <bits/stdc++.h>
using namespace std;

void debug(string s);

int main()
{
  int tasks, timelimit;
  int curr_time = 0;
  int tasks_completed = 0;

  cin >> tasks;
  cin >> timelimit;
  cin.ignore();

  for (int i=0; i<tasks; i++) {
    int curr_task;
    cin >> curr_task;
    curr_time += curr_task;
    if (curr_time > timelimit) break;
    else tasks_completed++;
  }

  cout << tasks_completed << endl;

  return 0;
}

void debug(string s) {
  cout << s << endl;
}
#include <bits/stdc++.h>
using namespace std;

void test_case();
bool player_turn(char* round, int* curr_p_points, int *other_p_points, int curr_player, int* rounds_left);

int main()
{
  // auto start = chrono::steady_clock::now();

  int t;
  scanf("%d", &t);

  for (int i=0; i<t; i++) {
    test_case();
  }

  // auto end = chrono::steady_clock::now();
  // auto diff = end - start;
  // cout << chrono::duration <double, milli> (diff).count() << " ms" << endl;

  return 0;
}

void test_case() {
  int k, s, c;
  int p1_points = 0;
  int p2_points = 0;
  char p1_round, p2_round, p1_round_prev, p2_round_prev;;
  bool p1_is_winner, p2_is_winner;
  // hvenær breyttist síðasta streak (losing eða winning)
  int last_p1_change = 0;
  int last_p2_change = 0;
  // getum ekki í alvöru breakað (þurfum að klára skannið)
  bool fake_break = false;

  scanf("%d", &k);

  // rounds
  for (int i=0; i<k; i++) {
    // printf("%d\n", i);
    scanf(" %c", &p1_round);
    scanf(" %c", &p2_round);
    if (fake_break) continue;
    int rounds_left = k - (i+1);
    p1_is_winner = player_turn(&p1_round, &p1_points, &p2_points, 1, &rounds_left);
    p2_is_winner = player_turn(&p2_round, &p2_points, &p1_points, 2, &rounds_left);
    if (p1_is_winner) {
      s = (i * 2) + 1;
      fake_break = true;
      continue;
    }

    if (i == 0) {
      p1_round_prev = p1_round;
      p2_round_prev = p2_round;
    } else {
      if (p1_round != p1_round_prev) last_p1_change = ((i-1) * 2) + 1;
      if (p2_round != p2_round_prev) last_p2_change = ((i-1) * 2) + 2;
    }

    if (p2_is_winner) {
      s = (i * 2) + 2;
      fake_break = true;
      continue;
    }
    // ef við komumst hingað í final roundinu er jafntefli
    if (i == k-1) {
      s = k*2;
    }
    
    p1_round_prev = p1_round;
    p2_round_prev = p2_round;
  }

  // getum fyllt inn í götin frá síðustu breytingu, ekki lengra en það
  c = max(last_p1_change, last_p2_change);
  // printf("s: %d, c: %d\n", s, c);
  printf("%d %d\n", s, c);
}

// skilum true ef búið í þessu turni
bool player_turn(char* round, int* curr_p_points, int* other_p_points, int curr_player, int* rounds_left) {
  if (*round == 'E' || *round == 'e') *curr_p_points = *curr_p_points + 1;
  // printf("player's turn: %d, %d, %d, %d,\n", curr_player, *curr_p_points, *other_p_points, *rounds_left);
  
  // ef p1 er current player þá á p2 ennþá eftir að gera (á leik til góða)
  int gap;
  if (curr_player == 1 && *curr_p_points > *other_p_points) gap = 1;
  else gap = 0;
  // absið er differencinn og svo tékkum við hvort hægt sé að
  // bridge-a gapið eftir þetta round eða ekki
  if (abs(*curr_p_points - *other_p_points) - *rounds_left > gap)
    return true;
  return false;
}
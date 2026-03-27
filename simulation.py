import math
import random

# --- シミュレーション設定 ---
INITIAL_BANKROLL = 100000  # 初期軍資金
SIMULATION_DAYS = 30       # シミュレーション期間（1ヶ月）
RACES_PER_DAY = 12         # 1日のレース数
BASE_WIN_RATE = 0.15       # 基本勝率（15%）
STOP_LOSS_RATIO = 0.10     # ストップ安（10%）

def run_simulation():
    current_bankroll = INITIAL_BANKROLL
    history = []
    
    print(f"{'日付':<5} | {'開始資金':<10} | {'終了資金':<10} | {'収支':<8} | {'的中率':<5} | {'状態'}")
    print("-" * 70)

    for day in range(1, SIMULATION_DAYS + 1):
        day_start_bankroll = current_bankroll
        daily_loss = 0
        hits = 0
        consecutive_losses = 0
        status = ""
        
        for race in range(1, RACES_PER_DAY + 1):
            # 1. 分割投入ルール（5% / 100円単位切り捨て）
            bet_amount = math.floor((current_bankroll * 0.05) / 100) * 100
            
            # 100円未満なら「見（ケン）」
            if bet_amount < 100:
                continue
                
            # 2. 連敗ガード（3連敗で条件引き上げ）
            target_odds = 15.0 if consecutive_losses >= 3 else 10.0
            
            # シミュレーション上の的中判定（高オッズほど当たりにくい調整）
            win_prob = BASE_WIN_RATE * (10.0 / target_odds)
            if random.random() < win_prob:
                # 的中！
                gain = bet_amount * target_odds
                current_bankroll += (gain - bet_amount)
                hits += 1
                consecutive_losses = 0
            else:
                # 不的中
                current_bankroll -= bet_amount
                daily_loss += bet_amount
                consecutive_losses += 1
            
            # 3. ストップ安ルール（初期軍資金の10%損失で強制停止）
            if daily_loss >= (INITIAL_BANKROLL * STOP_LOSS_RATIO):
                status = "🚨 ストップ安"
                break
        else:
            status = "✅ 完了"

        day_end_bankroll = current_bankroll
        daily_diff = day_end_bankroll - day_start_bankroll
        win_rate = (hits / RACES_PER_DAY) * 100
        
        print(f"Day {day:02} | {day_start_bankroll:>10.0f} | {day_end_bankroll:>10.0f} | {daily_diff:>+8.0f} | {win_rate:>5.1f}% | {status}")
        history.append(day_end_bankroll)

    # --- 最終統計 ---
    total_return = ((current_bankroll - INITIAL_BANKROLL) / INITIAL_BANKROLL) * 100
    print("-" * 70)
    print(f"最終軍資金: {current_bankroll:,.0f}円 (増減率: {total_return:+.2f}%)")
    print(f"最大ドローダウン: {min(history) - INITIAL_BANKROLL:,.0f}円")

if __name__ == "__main__":
    run_simulation()

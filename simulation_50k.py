import math
import random

# --- 設定：仮想50万円シミュレーション ---
INITIAL_BANKROLL = 500000  # 初期軍資金 50万円
SIMULATION_DAYS = 30       # 1ヶ月間
RACES_PER_DAY = 12
BASE_WIN_RATE = 0.12       # 現実的な的中率（12%前後）に調整
STOP_LOSS_RATIO = 0.10     # ストップ安（10%）

def run_50k_simulation():
    current_bankroll = INITIAL_BANKROLL
    peak_bankroll = INITIAL_BANKROLL
    history = []
    
    print(f"{'日付':<5} | {'開始資金':<10} | {'終了資金':<10} | {'前日比':<8} | {'状態'}")
    print("-" * 65)

    for day in range(1, SIMULATION_DAYS + 1):
        day_start = current_bankroll
        daily_loss = 0
        consecutive_losses = 0
        
        for race in range(1, RACES_PER_DAY + 1):
            # 5%分割投入（100円単位切り捨て）
            bet_amount = math.floor((current_bankroll * 0.05) / 100) * 100
            if bet_amount < 100: break

            # 連敗ガード
            target_odds = 15.0 if consecutive_losses >= 3 else 10.0
            win_prob = BASE_WIN_RATE * (10.0 / target_odds)

            if random.random() < win_prob:
                current_bankroll += (bet_amount * target_odds) - bet_amount
                consecutive_losses = 0
            else:
                current_bankroll -= bet_amount
                daily_loss += bet_amount
                consecutive_losses += 1
            
            # ストップ安判定
            if daily_loss >= (INITIAL_BANKROLL * STOP_LOSS_RATIO):
                status = "🚨 STOP"
                break
        else:
            status = "✅ OK"

        # 最高値更新チェック
        if current_bankroll > peak_bankroll:
            peak_bankroll = current_bankroll
            
        history.append(current_bankroll)
        print(f"Day {day:02} | {day_start:,.0f} | {current_bankroll:,.0f} | {current_bankroll-day_start:>+8,.0f} | {status}")

    print("-" * 65)
    total_profit = current_bankroll - INITIAL_BANKROLL
    max_drawdown = min(history) - peak_bankroll
    
    print(f"■ 最終結果")
    print(f"   最終資産   : {current_bankroll:,.0f}円")
    print(f"   トータル収支: {total_profit:>+,.0f}円")
    print(f"   最高到達資産: {peak_bankroll:,.0f}円")
    print(f"   最大下落幅  : {max_drawdown:,.0f}円")

if __name__ == "__main__":
    run_50k_simulation()

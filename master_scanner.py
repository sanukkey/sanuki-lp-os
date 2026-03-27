import asyncio
import math
from playwright.async_api import async_playwright
from datetime import datetime

# --- 設定：世界一稼げる「50万円運用」パラメータ ---
INITIAL_BANKROLL = 500000
current_bankroll = INITIAL_BANKROLL
consecutive_losses = 0

async def run_master_scanner():
    async with async_playwright() as p:
        # ブラウザを起動（動作を見たい場合は headless=False にしてください）
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        print(f"🚀 [{datetime.now().strftime('%H:%M:%S')}] マスター・スキャナー起動中...")

        while True:
            try:
                # 1. 全国24会場の「本日のレース一覧」へアクセス
                await page.goto("https://www.boatrace.jp/owpc/pc/race/index", timeout=60000)
                await page.wait_for_selector('.table1', timeout=10000)

                # 2. 開催中の会場データをすべて抽出
                # 各行（会場ごとの情報）を取得
                rows = await page.query_selector_all('div.table1 table tbody tr')
                
                print(f"\n--- 📡 全会場 リアルタイムスキャン実施中 ---")
                
                found_targets = 0
                for row in rows:
                    # 会場名とレース状態（締切時刻など）を取得
                    venue_element = await row.query_selector('.is-venue')
                    time_element = await row.query_selector('.is-payout1') # 締切目安のクラス
                    
                    if venue_element and time_element:
                        venue_name = await venue_element.inner_text()
                        status_text = await time_element.inner_text()
                        
                        # 締切間近のレースがあるか判定
                        if "締切" in status_text or ":" in status_text:
                            print(f"📍 会場: {venue_name.strip()} | ステータス: {status_text.strip()}")
                            found_targets += 1
                
                # 3. 資金管理ロジックの適用（ログ出力）
                bet_amount = math.floor((current_bankroll * 0.05) / 100) * 100
                target_odds = 15.0 if consecutive_losses >= 3 else 10.0
                
                print(f"\n💰 現在の軍資金: {current_bankroll:,.0f}円")
                print(f"🛡️ 次の1点ベット額: {bet_amount:,.0f}円 (5%)")
                print(f"🎯 狙い目オッズ: {target_odds}倍以上")
                print(f"------------------------------------------")

                # 次のスキャンまで待機（1分おきに全会場をチェック）
                await asyncio.sleep(60)

            except Exception as e:
                print(f"⚠️ スキャン中にエラーが発生しました(再試行します): {e}")
                await asyncio.sleep(10)

if __name__ == "__main__":
    try:
        asyncio.run(run_master_scanner())
    except KeyboardInterrupt:
        print("\n🛑 システムを安全に停止しました。")

# -*- coding: utf-8 -*-
import asyncio
import os
import traceback
import re
import requests
import random
from datetime import datetime
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

# ==========================================
# 【激アツ専用】ボートレース Discordレーダー (擬人化・ステルス版)
# ==========================================

WEBHOOK_URL = "https://discord.com/api/webhooks/1486188991526207560/Z9pnn5qhSS8DlGFqZadVS_OR2B7I0tVxqSYZhigcvkPndn-E9HC5IjTtZsBpOc0WlP15"

JCD_MAP = {
    "01": "桐生", "02": "戸田", "03": "江戸川", "04": "平和島", "05": "多摩川",
    "06": "浜名湖", "07": "蒲郡", "08": "常滑", "09": "津", "10": "三国",
    "11": "びわこ", "12": "住之江", "13": "尼崎", "14": "鳴門", "15": "丸亀",
    "16": "児島", "17": "宮島", "18": "徳山", "19": "下関", "20": "若松",
    "21": "芦屋", "22": "福岡", "23": "唐津", "24": "大村"
}

notified_races = set()

def send_discord_message_sync(message):
    payload = {"content": message}
    try:
        res = requests.post(WEBHOOK_URL, json=payload, timeout=5)
        if res.status_code in [200, 204]:
            print(f"✅ Discord通知完了: {message}")
        else:
            print(f"⚠️ Discord通知失敗: Status {res.status_code}")
    except Exception as e:
        print(f"⚠️ Discord通知通信エラー: {e}")

def send_discord_notification_sync(place_name, rno, bet_type, odds, remain_minutes):
    message = f"🔥【激アツ狙撃】{place_name}{rno}R | 買い目: {bet_type} | オッズ: {odds}倍\n※1号艇 A1/A2 条件合致！（ステルス人間モード稼働中）"
    send_discord_message_sync(message)

async def send_discord_notification(place_name, rno, bet_type, odds, remain_minutes):
    await asyncio.to_thread(send_discord_notification_sync, place_name, rno, bet_type, odds, remain_minutes)

async def send_discord_message(message):
    await asyncio.to_thread(send_discord_message_sync, message)

async def human_sleep():
    """人間らしい2〜3秒のランダム待機"""
    await asyncio.sleep(random.uniform(2.0, 3.5))

async def scan_venues(page):
    """出走表から本日の全未出走レースをマクロ抽出する"""
    upcoming_races = []
    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] ⚡️ 全場スキャン中（本日の全未出走レース対象）...")
    
    await page.goto("https://www.boatrace.jp/", wait_until="domcontentloaded")
    await human_sleep()
    await page.goto("https://www.boatrace.jp/owpc/pc/race/index", wait_until="domcontentloaded")
    await page.wait_for_selector('.table1')
    
    if "不正なURL" in await page.content():
        raise Exception("不正なURLエラーを検知しました")
        
    races_data = await page.evaluate('''() => {
        let results = [];
        let links = document.querySelectorAll('a[href*="rno="]');
        for (let a of links) {
            let td = a.closest('td');
            if (td && (td.classList.contains('is-finish') || td.classList.contains('is-close') || td.classList.contains('is-canceled'))) {
                continue;
            }
            results.push(a.href);
        }
        return results;
    }''')
    
    for href in races_data:
        m_jcd = re.search(r'jcd=(\d+)', href)
        m_rno = re.search(r'rno=(\d+)', href)
        if m_jcd and m_rno:
            upcoming_races.append({
                'jcd': m_jcd.group(1),
                'rno': m_rno.group(1),
                'deadline_text': '本日これから',
                'diff_min': int(m_rno.group(1)) 
            })
                
    unique_races = []
    seen = set()
    for r in upcoming_races:
        rid = f"{r['jcd']}_{r['rno']}"
        if rid not in seen:
            seen.add(rid)
            unique_races.append(r)
            
    unique_races.sort(key=lambda x: x['diff_min'])
    return unique_races

async def investigate_race(page, jcd, rno):
    """直接URLを叩かず、TOPからクリック遷移でオッズまで辿り着く（擬人化）"""
    await human_sleep()
    
    # 1. まず一覧ページへ (すでにいる場合も多いためgoto)
    await page.goto("https://www.boatrace.jp/owpc/pc/race/index", wait_until="domcontentloaded")
    await page.wait_for_selector('.table1')
    
    if "不正なURL" in await page.content():
        raise Exception("不正なURLエラーを検知しました")

    await human_sleep()
    
    # 2. 対象レースのリンクをクリックして出走表へ
    race_selector = f'a[href*="rno={rno}"][href*="jcd={jcd}"]'
    race_link = await page.query_selector(race_selector)
    if not race_link:
        return "不明", 0.0, 0.0

    await race_link.click()
    await page.wait_for_selector('.table1')
    
    if "不正なURL" in await page.content():
        raise Exception("不正なURLエラーを検知しました")

    await human_sleep()
    
    # 3. 1号艇のランクを取得
    row1 = await page.query_selector('tbody.is-fs12')
    rank = "不明"
    if row1:
        row1_text = await row1.inner_text()
        for r in ["A1", "A2", "B1", "B2"]:
            if r in row1_text:
                rank = r
                break
                
    if rank not in ["A1", "A2"]:
        return rank, 0.0, 0.0
        
    # 4. オッズページへ遷移（タブをクリック）
    odds_tab = await page.query_selector('a[href*="/owpc/pc/race/odds3t"]')
    if odds_tab:
        await odds_tab.click()
    else:
        # どうしても無い場合のみURLダイレクト（保険）
        await page.goto(f"https://www.boatrace.jp/owpc/pc/race/odds3t?rno={rno}&jcd={jcd}", wait_until="domcontentloaded")
        
    await page.wait_for_selector('.table1')
    
    if "不正なURL" in await page.content():
        raise Exception("不正なURLエラーを検知しました")
        
    await human_sleep()
    
    # 5. オッズ抽出
    odds_data = await page.evaluate('''() => {
        let res = { '1-2-3': 0.0, '1-3-2': 0.0 };
        let tds = document.querySelectorAll('td.oddsPoint, td.is-odds, .val');
        let values = [];
        for (let td of tds) {
            let txt = td.innerText.trim();
            if (txt && /^\d+(\.\d+)?$/.test(txt)) {
                values.push(parseFloat(txt));
            }
        }
        if (values.length >= 5) {
            res['1-2-3'] = values[0];
            res['1-3-2'] = values[4];
        }
        return res;
    }''')
    
    odds_123 = odds_data.get('1-2-3', 0.0) if odds_data else 0.0
    odds_132 = odds_data.get('1-3-2', 0.0) if odds_data else 0.0
    
    return rank, odds_123, odds_132

async def monitoring_loop(page):
    print("\n" + "="*60)
    print("📋 【人間ステルス・Discordレーダー稼働中】")
    print("🎯 条件: [1号艇がA1/A2級] ＋ [1-2-3 または 1-3-2 のオッズが7倍〜30倍]")
    print(f"🔔 フルスピードスキャンモード: 本日の全未出走レースを擬人化スキャン")
    print("="*60 + "\n")
    
    last_survival_report = datetime.now()
    
    while True:
        now = datetime.now()
        
        if now.hour >= 21:
            print("🛑 21時を過ぎました。本日のスキャンを終了します。")
            await send_discord_message("本日の業務終了")
            os._exit(0)

        if (now - last_survival_report).total_seconds() >= 3600:
            msg = f"[{now.strftime('%H:%M')}] 現在異常なし。ステルススキャン継続中⚡️"
            await send_discord_message(msg)
            last_survival_report = now

        try:
            upcoming_races = await scan_venues(page)
            
            if not upcoming_races:
                print("⏳ 現在対象となる未出走レースはありません。Topページに戻って再構築します...")
                await page.goto("https://www.boatrace.jp/", wait_until="domcontentloaded")
                await asyncio.sleep(5)
                continue
                
            for upcoming in upcoming_races:
                jcd = upcoming['jcd']
                rno = upcoming['rno']
                deadline = upcoming['deadline_text']
                race_id = f"{jcd}_{rno}"
                place_name = JCD_MAP.get(jcd, f"場{jcd}")
                
                if race_id in notified_races:
                    continue
                
                print(f"➡️ 調査中... {place_name} {rno}R (対象: {deadline})")
                
                # 直接アクセスを避け、クリックで遷移・待機を挟みながらデータ抽出
                rank, odds_123, odds_132 = await investigate_race(page, jcd, rno)
                
                if rank == "不明":
                    print(f"   => ❌ 【見送り】{place_name}{rno}R: 終了済み、またはリンク消失のためスキップ。")
                    continue
                
                if rank not in ["A1", "A2"]:
                    print(f"   => ❌ 【見送り】{place_name}{rno}R: 1号艇が {rank} 級につきスキップ。")
                    continue
                
                hit_123 = (7.0 <= odds_123 <= 30.0)
                hit_132 = (7.0 <= odds_132 <= 30.0)
                
                if hit_123 or hit_132:
                    print(f"\n🚀💥 【条件合致・即発射】{place_name}{rno}R が条件を満たしました！ (1-2-3: {odds_123}倍 / 1-3-2: {odds_132}倍)")
                    
                    if hit_123:
                        await send_discord_notification(place_name, rno, "1-2-3", odds_123, deadline)
                    if hit_132:
                        await send_discord_notification(place_name, rno, "1-3-2", odds_132, deadline)
                        
                    notified_races.add(race_id)
                else:
                    print(f"   => ❌ 【見送り】{place_name}{rno}R: 1号艇はA1/A2だが、オッズが指定範囲外（1-2-3: {odds_123}倍, 1-3-2: {odds_132}倍）のためスキップ。")

            await human_sleep()
            await page.goto("https://www.boatrace.jp/", wait_until="domcontentloaded")
            
        except PlaywrightTimeoutError as e:
            print(f"\n⚠️ 【自動復帰】通信タイムアウト発生: {e}")
            print("👉 サーバーアタックを避けるため10秒の冷却時間を置いてから再起動へ移行します...")
            return 
        except Exception as e:
            if "不正なURL" in str(e):
                print(f"\n❌ 【重度エラー】不正なURLを検知しました！（Botブロック）")
                print("👉 完全にCookieをリセットし、30秒待機してからシークレットモードで再起動します")
                await asyncio.sleep(30)
                return # ループを抜け、完全にブラウザ再起動
                
            print(f"\n⚠️ 予期せぬエラー: {e}")
            traceback.print_exc()
            await asyncio.sleep(3)

async def wait_for_shift():
    while True:
        now = datetime.now()
        shift_start = now.replace(hour=8, minute=30, second=0, microsecond=0)
        
        if now.hour >= 21:
            print(f"[{now.strftime('%H:%M:%S')}] 🛑 21時を過ぎました。本日の業務を終了します。")
            await send_discord_message("本日の業務終了")
            import os
            os._exit(0)
            
        if now >= shift_start:
            return
            
        print(f"[{now.strftime('%H:%M:%S')}] ⏳ スキャン開始まで待機中... (08:30開始)")
        await asyncio.sleep(60)

async def main():
    await send_discord_message("⚡️ステルス人間スキャン開始")
    
    while True:
        try:
            await wait_for_shift()
            
            async with async_playwright() as p:
                # ユーザーの目視確認 & 確実なシークレットモード(キャッシュ完全削除)
                browser = await p.chromium.launch(headless=False)
                # 毎回必ず新しいCookie・キャッシュなしのクリーンなコンテキストを作成
                context = await browser.new_context(user_agent="Mozilla/5.0")
                page = await context.new_page()
                page.set_default_timeout(30000)
                
                await monitoring_loop(page)
                
            print("🔄 ブラウザコンテキストを再起動し、Cookieを白紙に戻します...")
            print("⏳ アクセス過多を防ぐため、10秒の冷却時間を置きます...")
            await asyncio.sleep(10)
            
        except Exception as e:
            print(f"⚠️ ブラウザプロセス致命的エラー: {e}")
            print("👉 10秒の冷却時間を置いてから安全にシークレット復帰します")
            await asyncio.sleep(10)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n🛑 レーダーを安全に停止しました。")

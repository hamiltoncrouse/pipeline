import os
import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import time
import re

def fetch_real_trades():
    print("Scraping real congressional trades from capitoltrades.com...")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
    }
    
    trades = []
    # Cutoff: 90 days ago to ensure we get a large dataset of high-value trades
    cutoff_date = datetime.now() - timedelta(days=90)
    
    try:
        # MAX SCRAPING: Scrape up to 150 pages to get a massive dataset
        for page in range(1, 151):
            print(f"Scraping page {page}...")
            url = f"https://www.capitoltrades.com/trades?page={page}"
            
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            rows = soup.select('table tbody tr')
            
            if not rows:
                break
                
            for i, row in enumerate(rows):
                cols = row.find_all('td')
                if len(cols) < 8:
                    continue
                    
                # Extract Trade Details
                amount = cols[7].text.strip()
                
                # FILTER 1: Skip trades under $15k to find high-conviction moves while keeping volume high
                small_buckets = [
                    "1K–15K", 
                    "1K-15K", 
                    "Unknown", "N/A", ""
                ]
                if amount in small_buckets:
                    continue
                    
                # Extract Dates
                pub_date_raw = cols[2].text.strip()
                traded_date_raw = cols[3].text.strip()
                
                def parse_date(date_str):
                    try:
                        # Insert space between month and year if missing
                        date_str = re.sub(r'([a-zA-Z])(\d{4})', r'\1 \2', date_str)
                        dt = datetime.strptime(date_str, "%d %b %Y")
                        return dt
                    except:
                        return None

                trade_dt = parse_date(traded_date_raw)
                pub_dt = parse_date(pub_date_raw)
                
                if not trade_dt or not pub_dt:
                    continue
                    
                # FILTER 2: Skip trades older than 90 days
                if trade_dt < cutoff_date:
                    continue
                    
                # Extract Politician Info
                rep_name = cols[0].find('h2').text.strip() if cols[0].find('h2') else "Unknown"
                
                party = cols[0].select_one('.party').text.strip() if cols[0].select_one('.party') else "?"
                chamber = cols[0].select_one('.chamber').text.strip() if cols[0].select_one('.chamber') else "?"
                state = cols[0].select_one('.us-state-compact').text.strip() if cols[0].select_one('.us-state-compact') else "?"
                
                # Extract Asset Info
                asset_name = cols[1].find('h3').text.strip() if cols[1].find('h3') else "Unknown Asset"
                ticker = cols[1].select_one('.issuer-ticker').text.strip() if cols[1].select_one('.issuer-ticker') else "N/A"
                
                # FILTER 3: Skip non-publicly traded assets
                if ticker == "N/A":
                    continue
                
                trade_type = cols[6].text.strip().capitalize()
                party_letter = "D" if "Democrat" in party else "R" if "Republican" in party else "I"
                
                trades.append({
                    "representative": f"{'Sen.' if chamber == 'Senate' else 'Rep.'} {rep_name}",
                    "party": party_letter,
                    "district": state,
                    "ticker": ticker,
                    "asset_description": asset_name,
                    "type": "Purchase" if trade_type == "Buy" else "Sale" if trade_type == "Sell" else trade_type,
                    "amount": amount,
                    "transaction_date": trade_dt.strftime("%Y-%m-%d"),
                    "disclosure_date": pub_dt.strftime("%Y-%m-%d"),
                    "ptr_link": f"capitoltrades-p{page}-{i}"
                })
            
            # Be polite to the server
            time.sleep(1)
            
        print(f"Successfully scraped {len(trades)} high-value, recent trades!")
        return trades
        
    except Exception as e:
        print(f"Error scraping data: {e}")
        return trades # Return whatever we managed to scrape before the error

def main():
    trades = fetch_real_trades()
    
    if trades:
        os.makedirs('data', exist_ok=True)
        with open('data/all_transactions.json', 'w') as f:
            json.dump(trades, f, indent=2)
        print(f"Successfully saved {len(trades)} trades to data/all_transactions.json")
    else:
        print("No trades fetched. JSON file not updated.")

if __name__ == "__main__":
    main()

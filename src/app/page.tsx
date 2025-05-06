'use client';
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function USDTPriceDashboard() {
  const [prices, setPrices] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("coin");
  const [alerts, setAlerts] = useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("https://api.coingecko.com/api/v3/exchanges");
      const exchanges = await res.json();
      let allPrices = [];

      for (const exchange of exchanges.slice(0, 10)) {
        try {
          const tickersRes = await fetch(`https://api.coingecko.com/api/v3/exchanges/${exchange.id}`);
          const tickersData = await tickersRes.json();
          const usdtPairs = tickersData.tickers.filter(t => t.target === "USDT");

          usdtPairs.forEach(pair => {
            allPrices.push({
              exchange: exchange.name,
              coin: pair.base,
              price: pair.last,
            });
          });
        } catch (e) {
          console.error(`Error fetching data for ${exchange.id}`);
        }
      }
      setPrices(allPrices);
    }
    fetchData();
  }, []);

  const filteredPrices = prices
    .filter(p => p.coin.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === "coin") return a.coin.localeCompare(b.coin);
      if (sortKey === "exchange") return a.exchange.localeCompare(b.exchange);
      if (sortKey === "price") return b.price - a.price;
      return 0;
    });

  useEffect(() => {
    filteredPrices.forEach(item => {
      const alertPrice = alerts[item.coin];
      if (alertPrice && item.price >= alertPrice) {
        alert(`${item.coin} is above your alert price of $${alertPrice}`);
        setAlerts(prev => ({ ...prev, [item.coin]: null }));
      }
    });
  }, [filteredPrices]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">USDT Trading Pairs Across Exchanges</h1>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Filter by coin name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-1/3"
        />
        <select onChange={(e) => setSortKey(e.target.value)} className="p-2 rounded">
          <option value="coin">Sort by Coin</option>
          <option value="exchange">Sort by Exchange</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Price (USDT)</TableHead>
                <TableHead>Set Alert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.coin}</TableCell>
                  <TableCell>{item.exchange}</TableCell>
                  <TableCell>${item.price.toFixed(4)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      placeholder="Alert Price"
                      onBlur={(e) =>
                        setAlerts(prev => ({ ...prev, [item.coin]: parseFloat(e.target.value) }))
                      }
                      className="w-24"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
  

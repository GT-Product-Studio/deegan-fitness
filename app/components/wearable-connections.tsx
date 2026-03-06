"use client";

import { useState } from "react";
import { Watch, RefreshCw, Unlink, ExternalLink } from "lucide-react";

interface WearableConnection {
  id: string;
  provider: string;
  connected_at: string;
  last_sync_at: string | null;
  sync_status: string;
}

interface WearableConnectionsProps {
  connections: WearableConnection[];
}

const PROVIDERS = [
  {
    id: "polar",
    name: "Polar",
    icon: "❄️",
    description: "Sync exercises, HR data, and daily activity from Polar Flow.",
    available: true,
  },
  {
    id: "garmin",
    name: "Garmin",
    icon: "⌚",
    description: "Sync activities, heart rate, and fitness data from Garmin Connect.",
    available: true,
    note: "Requires approved developer access",
  },
];

export function WearableConnections({ connections }: WearableConnectionsProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const connectedProviders = new Map(
    connections.map((c) => [c.provider, c])
  );

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/wearables/sync", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setSyncResult(`Error: ${data.error}`);
      } else {
        setSyncResult(
          `Synced ${data.synced} activities, ${data.skipped} skipped`
        );
      }
    } catch {
      setSyncResult("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDisconnect(provider: string) {
    if (!confirm(`Disconnect ${provider}? Your synced activity data will be kept.`)) return;
    setDisconnecting(provider);
    try {
      await fetch("/api/wearables/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      window.location.reload();
    } catch {
      setDisconnecting(null);
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Watch className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-bold text-sm text-white">Wearable Connections</p>
          <p className="text-[10px] text-muted tracking-wider">
            Sync your watch data to track real stats
          </p>
        </div>
        {connections.length > 0 && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="ml-auto text-xs text-primary hover:text-primary-dark transition flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
        )}
      </div>

      {syncResult && (
        <div className="mb-4 text-xs px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
          {syncResult}
        </div>
      )}

      <div className="space-y-3">
        {PROVIDERS.map((provider) => {
          const connection = connectedProviders.get(provider.id);
          const isConnected = !!connection;

          return (
            <div
              key={provider.id}
              className={`border rounded-xl p-4 transition ${
                isConnected
                  ? "border-primary/30 bg-primary/5"
                  : "border-white/5 bg-card-elevated"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{provider.icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-white">
                      {provider.name}
                    </p>
                    {isConnected ? (
                      <p className="text-[10px] text-primary tracking-wider uppercase">
                        Connected
                        {connection.last_sync_at &&
                          ` · Last sync ${formatDate(connection.last_sync_at)}`}
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted tracking-wider">
                        {provider.description}
                      </p>
                    )}
                  </div>
                </div>

                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(provider.id)}
                    disabled={disconnecting === provider.id}
                    className="text-xs text-zone-redline/70 hover:text-zone-redline transition flex items-center gap-1"
                  >
                    <Unlink className="w-3 h-3" />
                    {disconnecting === provider.id ? "..." : "Disconnect"}
                  </button>
                ) : (
                  <a
                    href={`/api/wearables/connect?provider=${provider.id}`}
                    className="text-xs font-semibold text-primary hover:text-primary-dark transition flex items-center gap-1"
                  >
                    Connect <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {provider.note && !isConnected && (
                <p className="text-[10px] text-muted-dark mt-2 italic">
                  {provider.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

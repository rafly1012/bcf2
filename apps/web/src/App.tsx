"use client"

import { useEffect, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item"

// fungsi hitung jarak (meter)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3 // meter
  const toRad = (x: number) => (x * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function App() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  // ambil lokasi user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      })
    })
  }, [])

  // data checkpoint
  const checkpoints = [
    { id: 1, name: "Checkpoint 1 - Branch Office Larantuka", lat: -8.342104, lng: 122.986972 },
    { id: 2, name: "Checkpoint 2", lat: -8.651, lng: 115.221 },
    { id: 3, name: "Checkpoint 3", lat: -8.652, lng: 115.222 },
    { id: 4, name: "Checkpoint 4", lat: -8.653, lng: 115.223 },
    { id: 5, name: "Checkpoint 5", lat: -8.654, lng: 115.224 },
  ]

  return (
    <div className="flex min-h-svh items-center justify-center p-6 bg-muted/40">
      <div className="w-full max-w-md flex flex-col gap-6 text-sm">
        <div className="flex items-center justify-between">
          <img
            src="/img/danantara.png"
            alt="Logo Kiri"
            className="h-20 w-20 object-contain"
          />

          <div>
            <h1 className="text-lg font-bold text-center">
              Branch Office Larantuka
            </h1>
            <p className="text-center">Brilian Culture Fest 2026</p>
          </div>

          <img
            src="img/bri.png"
            alt="Logo Kanan"
            className="h-10 w-10 object-contain"
          />
        </div>

        {/* LIST CHECKPOINT */}
        {checkpoints.map((cp) => {
          const distance =
            location &&
            getDistance(location.lat, location.lng, cp.lat, cp.lng)

          const canClick = distance !== null && distance <= 100

          return (
            <Item
              key={cp.id}
              variant="outline"
              className="rounded-xl shadow-sm bg-background"
            >
              <ItemContent>
                <ItemTitle className="text-base font-semibold">
                  {cp.name}
                </ItemTitle>

                <ItemDescription className="mt-1 text-xs">
                  <div>{cp.lat}, {cp.lng}</div>
                  <div>
                    Jarak:{" "}
                    {distance
                      ? `${distance.toFixed(1)} meter`
                      : "Mengambil lokasi..."}
                  </div>
                </ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button
                  variant={canClick ? "default" : "secondary"}
                  size="sm"
                  disabled={!canClick}
                  className="min-w-[90px]"
                  onClick={() => alert(`${cp.name} berhasil dibuka`)}
                >
                  {canClick ? "Buka" : "Terlalu jauh"}
                </Button>
              </ItemActions>
            </Item>
          )
        })}
      <p className="text-center">Berkolaborasi Memberi Arti</p>
      </div>
    </div>
  )
}

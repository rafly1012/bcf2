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
  const R = 6371e3
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

// cek waktu aktif
function isWithinTime(start: string, end: string, now: Date) {
  return now >= new Date(start) && now <= new Date(end)
}

export function App() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [now, setNow] = useState(new Date())

  // update waktu tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // ambil lokasi user
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      },
      (err) => {
        console.error("Gagal ambil lokasi:", err)
      }
    )
  }, [])

  // formatter Intl
  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const fullFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // data checkpoint
  const checkpoints = [
    {
      id: 1,
      name: "Checkpoint - Branch Office Larantuka",
      lat: -8.342104,
      lng: 122.986972,
      formUrl: "https://forms.gle/gBYGFYfqsCueBco3A",
      startTime: "2026-08-14T09:00:00",
      endTime: "2026-08-14T12:00:00",
    },
    {
      id: 2,
      name: "Checkpoint 2 - Hotel Silvia",
      lat: -8.6342244,
      lng: 122.210118,
      formUrl: "https://forms.gle/xst5ZH4vEjhnPHDh9",
      startTime: "2026-08-14T13:00:00",
      endTime: "2026-08-14T15:00:00",
    },
    {
      id: 3,
      name: "Checkpoint 3",
      lat: -8.652,
      lng: 115.222,
      formUrl: "https://forms.gle/HTNCA6UY9wn1ZVZ28",
      startTime: "2026-08-14T10:00:00",
      endTime: "2026-08-14T18:00:00",
    },
  ]

  return (
    <div className="flex min-h-svh items-center justify-center p-6 bg-muted/40">
      <div className="w-full max-w-md flex flex-col gap-6 text-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <img src="/img/bri.png" className="h-15 w-15 object-contain" />
          <div>
            <h1 className="text-lg font-bold text-center">
              Branch Office Larantuka
            </h1>
            <p className="text-center">Brilian Culture Fest 2026</p>
          </div>
          <img src="/img/bcf.png" className="h-15 w-15 object-contain" />
        </div>

        {/* LIST CHECKPOINT */}
        {checkpoints.map((cp) => {
          const distance =
            location &&
            getDistance(location.lat, location.lng, cp.lat, cp.lng)

          const isTimeValid = isWithinTime(cp.startTime, cp.endTime, now)

          const canClick =
            distance !== null &&
            distance <= 100 &&
            isTimeValid

          const start = new Date(cp.startTime)
          const end = new Date(cp.endTime)

          const sameDay =
            start.toDateString() === end.toDateString()

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

                <ItemDescription className="mt-1 text-xs line-clamp-5">
                  <div>{cp.lat}, {cp.lng}</div>

                  <div>
                    Jarak:{" "}
                    {distance
                      ? `${distance.toFixed(1)} meter`
                      : "Mengambil lokasi..."}
                  </div>

                  <div>
                    Waktu:{" "}
                    {sameDay
                      ? `${dateFormatter.format(start)} ${timeFormatter.format(
                          start
                        )} - ${timeFormatter.format(end)}`
                      : `${fullFormatter.format(start)} - ${fullFormatter.format(
                          end
                        )}`}
                  </div>
                </ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button
                  variant={canClick ? "default" : "secondary"}
                  size="sm"
                  disabled={!canClick}
                  className="min-w-22.5"
                  onClick={() => {
                    if (canClick) {
                      window.open(cp.formUrl, "_blank")
                    }
                  }}
                >
                  {!isTimeValid
                    ? now < start
                      ? "Belum mulai"
                      : "Sudah lewat"
                    : distance && distance > 100
                    ? "Terlalu jauh"
                    : "Isi Form"}
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

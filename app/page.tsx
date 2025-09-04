"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [focusedCell, setFocusedCell] = useState<number | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set())
  const [selectionStart, setSelectionStart] = useState<number | null>(null)
  const [cellContent, setCellContent] = useState<{ [key: number]: any }>({})
  const [loadingCells, setLoadingCells] = useState<Set<number>>(new Set())
  const [loadingMessages, setLoadingMessages] = useState<{ [key: number]: string }>({})

  const quotes = [
    {
      text: "The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.",
      author: "Albert Einstein",
      tags: ["change", "deep-thoughts", "thinking", "world"],
    },
    {
      text: "It is our choices, Harry, that show what we truly are, far more than our abilities.",
      author: "J.K. Rowling",
      tags: ["abilities", "choices"],
    },
    {
      text: "There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle.",
      author: "Albert Einstein",
      tags: ["inspirational", "life", "live", "miracle", "miracles"],
    },
    {
      text: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
      author: "Jane Austen",
      tags: ["aliteracy", "books", "classic", "humor"],
    },
    {
      text: "Imperfection is beauty, madness is genius and it's better to be absolutely ridiculous than absolutely boring.",
      author: "Marilyn Monroe",
      tags: ["be-yourself", "inspirational"],
    },
    {
      text: "Try not to become a man of success. Rather become a man of value.",
      author: "Albert Einstein",
      tags: ["adulthood", "success", "value"],
    },
    {
      text: "It is better to be hated for what you are than to be loved for what you are not.",
      author: "André Gide",
      tags: ["life", "love"],
    },
    {
      text: "I have not failed. I've just found 10,000 ways that won't work.",
      author: "Thomas A. Edison",
      tags: ["edison", "failure", "inspirational", "paraphrased"],
    },
    {
      text: "A woman is like a tea bag; you never know how strong it is until it's in hot water.",
      author: "Eleanor Roosevelt",
      tags: ["misattributed-eleanor-roosevelt"],
    },
    {
      text: "A day without sunshine is like, you know, night.",
      author: "Steve Martin",
      tags: ["humor", "obvious", "simile"],
    },
  ]

  const getRandomQuote = () => {
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  const truncateQuote = (quoteObj: any) => {
    const words = quoteObj.text.split(" ")
    const firstWords = words.slice(0, Math.min(5, Math.max(3, words.length)))
    return `"${firstWords.join(" ")}..."`
  }

  const startLoadingSequence = async (cellIndex: number) => {
    const messages = [
      "Starting fetch...",
      "Logging in...",
      `Browsing to page ${Math.floor(Math.random() * 10) + 1}...`,
      "Selecting random quote...",
      "Selected.",
    ]

    setLoadingCells((prev) => new Set([...prev, cellIndex]))

    for (let i = 0; i < messages.length; i++) {
      setLoadingMessages((prev) => ({ ...prev, [cellIndex]: messages[i] }))
      const randomDelay = Math.floor(Math.random() * (2400 - 1200 + 1)) + 1200
      await new Promise((resolve) => setTimeout(resolve, randomDelay))
    }

    // Set the final quote
    setCellContent((prev) => ({
      ...prev,
      [cellIndex]: getRandomQuote(),
    }))

    // Clean up loading state
    setLoadingCells((prev) => {
      const newSet = new Set(prev)
      newSet.delete(cellIndex)
      return newSet
    })
    setLoadingMessages((prev) => {
      const newMessages = { ...prev }
      delete newMessages[cellIndex]
      return newMessages
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (focusedCell === null) {
        e.preventDefault()
        setFocusedCell(0)
        return
      }

      const currentRow = Math.floor(focusedCell / 3)
      const currentCol = focusedCell % 3

      const selectPath = (start: number, end: number) => {
        const newSet = new Set(selectedCells)

        newSet.add(end)

        setSelectedCells(newSet)
      }

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          if (currentRow > 0) {
            const newFocus = focusedCell - 3
            setFocusedCell(newFocus)
            if (e.shiftKey) {
              if (selectionStart === null) {
                setSelectionStart(focusedCell)
                setSelectedCells(new Set([focusedCell]))
              }
              selectPath(selectionStart!, newFocus)
            } else {
              setSelectionStart(null)
            }
          }
          break
        case "ArrowDown":
          e.preventDefault()
          if (currentRow < 99) {
            const newFocus = focusedCell + 3
            setFocusedCell(newFocus)
            if (e.shiftKey) {
              if (selectionStart === null) {
                setSelectionStart(focusedCell)
                setSelectedCells(new Set([focusedCell]))
              }
              selectPath(selectionStart!, newFocus)
            } else {
              setSelectionStart(null)
            }
          }
          break
        case "ArrowLeft":
          e.preventDefault()
          if (currentCol > 0) {
            const newFocus = focusedCell - 1
            setFocusedCell(newFocus)
            if (e.shiftKey) {
              if (selectionStart === null) {
                setSelectionStart(focusedCell)
                setSelectedCells(new Set([focusedCell]))
              }
              selectPath(selectionStart!, newFocus)
            } else {
              setSelectionStart(null)
            }
          }
          break
        case "ArrowRight":
          e.preventDefault()
          if (currentCol < 2) {
            const newFocus = focusedCell + 1
            setFocusedCell(newFocus)
            if (e.shiftKey) {
              if (selectionStart === null) {
                setSelectionStart(focusedCell)
                setSelectedCells(new Set([focusedCell]))
              }
              selectPath(selectionStart!, newFocus)
            } else {
              setSelectionStart(null)
            }
          }
          break
        case "x":
        case "X":
          e.preventDefault()
          setSelectedCells((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(focusedCell)) {
              newSet.delete(focusedCell)
            } else {
              newSet.add(focusedCell)
            }
            return newSet
          })
          setSelectionStart(null)
          break
        case " ":
          e.preventDefault()
          if (selectedCells.size > 0) {
            selectedCells.forEach((cellIndex) => {
              const currentContent = cellContent[cellIndex] || "Empty"
              if (currentContent === "Empty" && !loadingCells.has(cellIndex)) {
                startLoadingSequence(cellIndex)
              }
            })
          } else if (focusedCell !== null) {
            const currentContent = cellContent[focusedCell] || "Empty"
            if (currentContent === "Empty" && !loadingCells.has(focusedCell)) {
              startLoadingSequence(focusedCell)
            }
          }
          break
        case "Escape":
          e.preventDefault()
          setSelectedCells(new Set())
          setSelectionStart(null)
          break
        case "a":
        case "A":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            const allCells = new Set(Array.from({ length: 300 }, (_, i) => i))
            setSelectedCells(allCells)
            setSelectionStart(null)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedCell, selectionStart, selectedCells, cellContent, loadingCells])

  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="mx-auto w-fit">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Random Quote Fetcher</h1>

        <div className="flex gap-8 items-start">
          {/* Left section - Actions */}
          <div className="w-64 bg-card border border-border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-card-foreground">Actions</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-card-foreground">Arrow Keys:</span> focus cells
              </div>
              <div>
                <span className="font-medium text-card-foreground">X Key:</span> select cells
              </div>
              <div>
                <span className="font-medium text-card-foreground">Shift + Arrow Keys:</span> Bulk select cells
              </div>
              <div>
                <span className="font-medium text-card-foreground">Space:</span> fetch quote on focused or selected
                cells
              </div>
              <div>
                <span className="font-medium text-card-foreground">Esc:</span> clear selected cells
              </div>
              <div>
                <span className="font-medium text-card-foreground">Ctrl + A:</span> select all cells
              </div>
              <div className="mt-3 pt-2 border-t border-border">
                <p className="text-xs">
                  <span className="font-medium text-card-foreground">Note:</span> if there are cells selected, focused
                  cell will not fetch. Bulk fetch will be triggered on multiple selected cell. Each fetch is a random
                  quote.
                </p>
              </div>
            </div>
          </div>

          {/* Center section - Grid */}
          <div className="grid grid-cols-3 gap-2 flex-shrink-0">
            {Array.from({ length: 300 }, (_, i) => (
              <div
                key={i}
                className={`w-52 h-16 bg-card border border-border rounded-lg flex items-center justify-center text-card-foreground font-medium transition-colors ${
                  focusedCell === i ? "ring-2 ring-primary bg-accent text-accent-foreground" : ""
                } ${selectedCells.has(i) ? "bg-primary text-primary-foreground" : ""}`}
              >
                {loadingCells.has(i) ? (
                  <span className="text-sm text-muted-foreground animate-pulse">
                    {loadingMessages[i] || "Loading..."}
                  </span>
                ) : cellContent[i] ? (
                  <span className="italic text-sm px-2 text-center">{truncateQuote(cellContent[i])}</span>
                ) : (
                  "Empty"
                )}
              </div>
            ))}
          </div>

          {/* Right section - Details */}
          <div className="w-64 bg-white border border-border rounded-lg p-4 flex-shrink-0 self-start">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Details</h2>
              {focusedCell !== null && cellContent[focusedCell] && (
                <svg
                  className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              )}
            </div>

            {focusedCell !== null && cellContent[focusedCell] ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Full Quote:</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cellContent[focusedCell].text}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Author:</h3>
                  <p className="text-sm text-muted-foreground">{cellContent[focusedCell].author}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-1">Tags:</h3>
                  <div className="flex flex-wrap gap-1">
                    {cellContent[focusedCell].tags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {focusedCell !== null ? "Cell is empty" : "Press space to activate keyboard navigation"}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

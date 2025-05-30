"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

type SortingAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick"

interface ArrayElement {
  value: number
  id: number
  isComparing?: boolean
  isSwapping?: boolean
  isSorted?: boolean
  isPivot?: boolean
}

const algorithms = {
  bubble: "Bubble Sort",
  selection: "Selection Sort",
  insertion: "Insertion Sort",
  merge: "Merge Sort",
  quick: "Quick Sort",
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble")
  const [arraySize, setArraySize] = useState([30])
  const [speed, setSpeed] = useState([50])
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)
  const isPlayingRef = useRef(false)

  const generateRandomArray = useCallback(() => {
    const newArray: ArrayElement[] = []
    for (let i = 0; i < arraySize[0]; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 300) + 10,
        id: i,
        isComparing: false,
        isSwapping: false,
        isSorted: false,
        isPivot: false,
      })
    }
    setArray(newArray)
    setComparisons(0)
    setSwaps(0)
  }, [arraySize])

  useEffect(() => {
    generateRandomArray()
  }, [generateRandomArray])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const updateArrayState = (newArray: ArrayElement[]) => {
    setArray([...newArray])
  }

  // Bubble Sort
  const bubbleSort = async (arr: ArrayElement[]) => {
    const n = arr.length
    let compCount = 0
    let swapCount = 0

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isPlayingRef.current) return

        // Highlight comparing elements
        arr.forEach((el) => {
          el.isComparing = false
          el.isSwapping = false
        })
        arr[j].isComparing = true
        arr[j + 1].isComparing = true
        updateArrayState(arr)

        compCount++
        setComparisons(compCount)
        await sleep(101 - speed[0])

        if (arr[j].value > arr[j + 1].value) {
          // Highlight swapping
          arr[j].isSwapping = true
          arr[j + 1].isSwapping = true
          updateArrayState(arr)
          await sleep(101 - speed[0])

          // Perform swap
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
          swapCount++
          setSwaps(swapCount)
          updateArrayState(arr)
        }

        await sleep(50)
      }
      // Mark element as sorted
      arr[n - 1 - i].isSorted = true
      updateArrayState(arr)
    }

    // Mark first element as sorted
    if (arr.length > 0) {
      arr[0].isSorted = true
    }

    // Clear all highlighting
    arr.forEach((el) => {
      el.isComparing = false
      el.isSwapping = false
      el.isSorted = true
    })
    updateArrayState(arr)
  }

  // Selection Sort
  const selectionSort = async (arr: ArrayElement[]) => {
    const n = arr.length
    let compCount = 0
    let swapCount = 0

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i

      // Clear previous highlighting
      arr.forEach((el) => {
        el.isComparing = false
        el.isSwapping = false
        el.isPivot = false
      })

      arr[minIdx].isPivot = true
      updateArrayState(arr)

      for (let j = i + 1; j < n; j++) {
        if (!isPlayingRef.current) return

        arr[j].isComparing = true
        updateArrayState(arr)
        compCount++
        setComparisons(compCount)
        await sleep(101 - speed[0])

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx].isPivot = false
          minIdx = j
          arr[minIdx].isPivot = true
          updateArrayState(arr)
        }

        arr[j].isComparing = false
        updateArrayState(arr)
      }

      if (minIdx !== i) {
        arr[i].isSwapping = true
        arr[minIdx].isSwapping = true
        updateArrayState(arr)
        await sleep(101 - speed[0])

        const temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp
        swapCount++
        setSwaps(swapCount)
      }

      arr[i].isPivot = false
      arr[i].isSwapping = false
      arr[minIdx].isSwapping = false
      arr[i].isSorted = true
      updateArrayState(arr)
    }

    // Mark all as sorted
    arr.forEach((el) => {
      el.isSorted = true
      el.isComparing = false
      el.isSwapping = false
      el.isPivot = false
    })
    updateArrayState(arr)
  }

  // Insertion Sort
  const insertionSort = async (arr: ArrayElement[]) => {
    let compCount = 0
    let swapCount = 0

    for (let i = 1; i < arr.length; i++) {
      if (!isPlayingRef.current) return

      const key = arr[i]
      let j = i - 1

      // Highlight current element
      arr.forEach((el) => {
        el.isComparing = false
        el.isSwapping = false
      })
      arr[i].isPivot = true
      updateArrayState(arr)
      await sleep(101 - speed[0])

      while (j >= 0 && arr[j].value > key.value) {
        if (!isPlayingRef.current) return

        arr[j].isComparing = true
        updateArrayState(arr)
        compCount++
        setComparisons(compCount)
        await sleep(101 - speed[0])

        arr[j + 1] = arr[j]
        swapCount++
        setSwaps(swapCount)
        updateArrayState(arr)
        j--
      }

      arr[j + 1] = key
      arr.forEach((el) => {
        el.isComparing = false
        el.isPivot = false
      })

      // Mark sorted portion
      for (let k = 0; k <= i; k++) {
        arr[k].isSorted = true
      }
      updateArrayState(arr)
    }

    // Mark all as sorted
    arr.forEach((el) => {
      el.isSorted = true
      el.isComparing = false
      el.isSwapping = false
      el.isPivot = false
    })
    updateArrayState(arr)
  }

  // Quick Sort
  const quickSort = async (arr: ArrayElement[]) => {
    let compCount = 0
    let swapCount = 0

    const partition = async (low: number, high: number): Promise<number> => {
      const pivot = arr[high]
      pivot.isPivot = true
      updateArrayState(arr)

      let i = low - 1

      for (let j = low; j < high; j++) {
        if (!isPlayingRef.current) return -1

        arr[j].isComparing = true
        updateArrayState(arr)
        compCount++
        setComparisons(compCount)
        await sleep(101 - speed[0])

        if (arr[j].value < pivot.value) {
          i++
          if (i !== j) {
            arr[i].isSwapping = true
            arr[j].isSwapping = true
            updateArrayState(arr)
            await sleep(101 - speed[0])

            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            swapCount++
            setSwaps(swapCount)

            arr[i].isSwapping = false
            arr[j].isSwapping = false
          }
        }

        arr[j].isComparing = false
        updateArrayState(arr)
      }

      arr[i + 1].isSwapping = true
      arr[high].isSwapping = true
      updateArrayState(arr)
      await sleep(101 - speed[0])

      const temp = arr[i + 1]
      arr[i + 1] = arr[high]
      arr[high] = temp
      swapCount++
      setSwaps(swapCount)

      arr[i + 1].isSwapping = false
      arr[high].isSwapping = false
      arr[high].isPivot = false
      updateArrayState(arr)

      return i + 1
    }

    const quickSortHelper = async (low: number, high: number) => {
      if (low < high && isPlayingRef.current) {
        const pi = await partition(low, high)
        if (pi === -1) return

        await quickSortHelper(low, pi - 1)
        await quickSortHelper(pi + 1, high)
      }
    }

    await quickSortHelper(0, arr.length - 1)

    // Mark all as sorted
    arr.forEach((el) => {
      el.isSorted = true
      el.isPivot = false
      el.isComparing = false
      el.isSwapping = false
    })
    updateArrayState(arr)
  }

  // Merge Sort
  const mergeSort = async (arr: ArrayElement[]) => {
    let compCount = 0
    let swapCount = 0

    const merge = async (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1)
      const rightArr = arr.slice(mid + 1, right + 1)

      let i = 0,
        j = 0,
        k = left

      while (i < leftArr.length && j < rightArr.length) {
        if (!isPlayingRef.current) return

        // Highlight comparing elements
        arr[left + i].isComparing = true
        arr[mid + 1 + j].isComparing = true
        updateArrayState(arr)
        compCount++
        setComparisons(compCount)
        await sleep(101 - speed[0])

        if (leftArr[i].value <= rightArr[j].value) {
          arr[k] = leftArr[i]
          i++
        } else {
          arr[k] = rightArr[j]
          j++
        }

        arr[k].isSwapping = true
        updateArrayState(arr)
        swapCount++
        setSwaps(swapCount)
        await sleep(101 - speed[0])

        arr[k].isComparing = false
        arr[k].isSwapping = false
        updateArrayState(arr)
        k++
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i]
        arr[k].isSwapping = true
        updateArrayState(arr)
        await sleep(50)
        arr[k].isSwapping = false
        updateArrayState(arr)
        i++
        k++
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j]
        arr[k].isSwapping = true
        updateArrayState(arr)
        await sleep(50)
        arr[k].isSwapping = false
        updateArrayState(arr)
        j++
        k++
      }
    }

    const mergeSortHelper = async (left: number, right: number) => {
      if (left < right && isPlayingRef.current) {
        const mid = Math.floor((left + right) / 2)
        await mergeSortHelper(left, mid)
        await mergeSortHelper(mid + 1, right)
        await merge(left, mid, right)
      }
    }

    await mergeSortHelper(0, arr.length - 1)

    // Mark all as sorted
    arr.forEach((el) => {
      el.isSorted = true
      el.isComparing = false
      el.isSwapping = false
    })
    updateArrayState(arr)
  }

  const startSorting = async () => {
    if (isPlaying) {
      setIsPlaying(false)
      isPlayingRef.current = false
      return
    }

    setIsPlaying(true)
    isPlayingRef.current = true
    setComparisons(0)
    setSwaps(0)

    // Reset array state
    const sortArray = array.map((element) => ({
      ...element,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isPivot: false,
    }))
    
    try {
      switch (algorithm) {
        case "bubble":
          await bubbleSort(sortArray)
          break
        case "selection":
          await selectionSort(sortArray)
          break
        case "insertion":
          await insertionSort(sortArray)
          break
        case "merge":
          await mergeSort(sortArray)
          break
        case "quick":
          await quickSort(sortArray)
          break
      }
    } catch (error) {
      console.error("Sorting error:", error)
    }

    setIsPlaying(false)
    isPlayingRef.current = false
  }

  const resetArray = () => {
    setIsPlaying(false)
    isPlayingRef.current = false
    generateRandomArray()
  }

  const getBarColor = (element: ArrayElement) => {
    if (element.isSorted) return "bg-white shadow-lg"
    if (element.isPivot) return "bg-gradient-to-t from-gray-200 to-white border-2 border-gray-300"
    if (element.isSwapping) return "bg-gradient-to-t from-gray-700 to-gray-500 shadow-md"
    if (element.isComparing) return "bg-gradient-to-t from-gray-500 to-gray-300 border border-gray-400"
    return "bg-gradient-to-t from-gray-900 to-gray-700"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Sorting Visualizer</h1>
          <p className="text-gray-300">Watch algorithms sort data in real-time</p>
        </div>

        {/* Controls */}
        <Card className="bg-gradient-to-r from-gray-900 to-black border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Algorithm</label>
                <Select
                  value={algorithm}
                  onValueChange={(value: SortingAlgorithm) => setAlgorithm(value)}
                  disabled={isPlaying}
                >
                  <SelectTrigger className="bg-black border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-600">
                    {Object.entries(algorithms).map(([key, name]) => (
                      <SelectItem key={key} value={key} className="text-white hover:bg-gray-800">
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Array Size: {arraySize[0]}</label>
                <Slider
                  value={arraySize}
                  onValueChange={setArraySize}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                  disabled={isPlaying}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Speed: {speed[0]}%</label>
                <Slider value={speed} onValueChange={setSpeed} max={100} min={1} step={1} className="w-full" />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={startSorting}
                  className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold"
                  disabled={array.length === 0}
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? "Pause" : "Start"}
                </Button>
                <Button
                  onClick={resetArray}
                  className="bg-gray-700 text-white hover:bg-gray-600 border-gray-500"
                  disabled={isPlaying}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{algorithms[algorithm]}</div>
                <div className="text-sm text-gray-400">Current Algorithm</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-black to-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300">{comparisons}</div>
                <div className="text-sm text-gray-400">Comparisons</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300">{swaps}</div>
                <div className="text-sm text-gray-400">Swaps</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization */}
        <Card className="bg-gradient-to-b from-gray-900 via-black to-gray-900 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-end justify-center gap-1 h-96 overflow-hidden">
              {array.map((element, index) => (
                <div
                  key={`${element.id}-${index}`}
                  className={`transition-all duration-200 ${getBarColor(element)} rounded-t-sm`}
                  style={{
                    height: `${element.value}px`,
                    width: `${Math.max(800 / array.length - 1, 2)}px`,
                    minWidth: "2px",
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="bg-gradient-to-r from-black via-gray-900 to-black border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-gray-900 to-gray-700 rounded border border-gray-600"></div>
                <span className="text-sm text-gray-300">Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-gray-500 to-gray-300 rounded border border-gray-400"></div>
                <span className="text-sm text-gray-300">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-gray-700 to-gray-500 rounded border border-gray-600"></div>
                <span className="text-sm text-gray-300">Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-gray-200 to-white rounded border-2 border-gray-300"></div>
                <span className="text-sm text-gray-300">Pivot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white rounded border border-gray-600 shadow-lg"></div>
                <span className="text-sm text-gray-300">Sorted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

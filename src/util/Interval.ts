export type Interval = [number, number]

export const isEmpty = (i: Interval) => i[0] === i[1]

export const summarise = (i: Interval) => {
    if (i[1] - i[0] <= 0) {
        return `${i[0]}`
    }

    return `${i[0]} - ${i[1]}`
}

/**
 * Merges the given integer intervals into a minimal spanning set of intervals.
 * N.B. [x, y] and [y + 1, z] are merged into [x, z].
 */
export const mergeIntRanges = (intervals: Interval[]) => {
    if (intervals.length <= 1) {
        return intervals
    }

    // sort intervals in ascending order by their start values
    let sortedIntervals = intervals.sort((i1, i2) => i1[0] - i2[0])

    let stack = [sortedIntervals[0]]

    for (let i = 1; i < sortedIntervals.length; i++) {
        let top = stack[stack.length - 1]
        let interval = sortedIntervals[i]

        if (top[1] < interval[0] - 1) {
            // current interval does not overlap with next interval
            stack.push(interval)
        }
        else if (top[1] < interval[1]) {
            // current interval overlaps with next interval:
            // set current interval max to the max of the next interval
            // and put that amended interval on the stack instead
            top[1] = interval[1]
            stack.pop()
            stack.push(top)
        }
    }

    return stack
}

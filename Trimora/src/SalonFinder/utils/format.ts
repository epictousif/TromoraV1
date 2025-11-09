export function formatTime(time: string): string {
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minutes} ${ampm}`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatReviewCount(count: number): string {
  if (count === 0) return "No reviews"
  if (count === 1) return "1 review"
  if (count < 1000) return `${count} reviews`

  const k = Math.floor(count / 1000)
  const remainder = count % 1000

  if (remainder === 0) return `${k}k reviews`
  return `${k}.${Math.floor(remainder / 100)}k reviews`
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`
  }
  return `${distance.toFixed(1)}km away`
}

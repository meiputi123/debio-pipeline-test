/**
 * 
 * @param {date} date1
 * @param {date} date2
 * @returns {String}
 */
export const compareDate = (date1, date2) => {
  const diff = Math.floor((date1 - date2) / 1000)

  const formated = (time, format) => {
    return time > 1 ? `${time} ${format}s ago` : `${time} ${format} ago`
  }

  let resultTime = ""

  if (diff < 60) resultTime = formated(diff, "Second")
  if (diff >= 60) resultTime = formated(Math.floor(diff / 60), "Minute")
  if (diff >= 3600) resultTime = formated(Math.floor(diff / 3600), "Hour")
  if (diff >= 86400) resultTime = formated(Math.floor(diff / 86400), "Day")
  if (diff > 2419200) resultTime = date2.toDateString()

  return resultTime
}

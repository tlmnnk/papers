import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    return getDateTimeSince(value);
  }

}

function getDaysInMonth(month: number, year: number) {
  if (typeof year === 'undefined') {
    year = 1999
  }
  const currmon = new Date(year, month)
  const nextmon = new Date(year, month + 1)
  return Math.floor((nextmon.getTime() - currmon.getTime()) / (24 * 3600 * 1000))
}
export function getDateTimeSince(target: string) {
  const value = new Date(target);
  const now = new Date()
  let yd: number;
  let md: number;
  let dd: number;
  let hd: number;
  let nd: number;
  let sd: number;
  const out = []

  yd = now.getFullYear() - value.getFullYear()
  md = now.getMonth() - value.getMonth()
  dd = now.getDate() - value.getDate()
  hd = now.getHours() - value.getHours()
  nd = now.getMinutes() - value.getMinutes()
  sd = now.getSeconds() - value.getSeconds()

  if (md < 0) {
    yd--
    md += 12
  }
  if (dd < 0) {
    md--
    dd += getDaysInMonth(now.getMonth() - 1, now.getFullYear())
  }
  if (hd < 0) {
    dd--
    hd += 24
  }
  if (nd < 0) {
    hd--
    nd += 60
  }
  if (sd < 0) {
    nd--
    sd += 60
  }

  if (yd > 0) out.push(`${yd} лет`)
  if (md > 0) out.push(`${md} месяцев`)
  if (dd > 0) out.push(`${dd} дней`)
  if (hd > 0) out.push(`${hd} часов`)
  if (nd > 0) out.push(`${nd} минут`)
  if (sd > 0) out.push(`${sd} секунд`)
  return out.join(' ')
}

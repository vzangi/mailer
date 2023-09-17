
const monthes = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноябяря',
    'декабря',
]

const _ = (d) => d > 9 ? d : '0' + d

const parse = (date) => {
    const d = new Date(date)
    p = {}
    p.year = d.getFullYear()
    p.month = monthes[d.getMonth()]
    p.day = d.getDate()
    p.hour = _(d.getHours())
    p.minute = _(d.getMinutes())
    return p
}

const onlyTime = (dt) => `${dt.hour}:${dt.minute}`

const onlyDate = (dt) => `${dt.day} ${dt.month}`

const coolDate = (date) => {
    const current = parse(date)
    const today = parse(new Date())
    
    if (current.year != today.year) 
        return onlyDate(current) + ' ' + current.year

    if (current.month == today.month && current.day == today.day)
        return onlyTime(current)

    return onlyDate(current) + ' ' + onlyTime(current)
}


module.exports = {
    coolDate
}
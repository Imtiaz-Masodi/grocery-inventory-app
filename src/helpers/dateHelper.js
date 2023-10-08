function getDateAndTime(dateString, isHour12 = false) {
    let date = new Date(dateString)
        .toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hourCycle: isHour12 ? "h12" : "h23",
            timeZone: "Asia/Kolkata",
        })
        .replaceAll("-", " ");
    return date;
}

function getShortMonthDate(dateString) {
    let date = new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });
    return date;
}

export default {
    getDateAndTime,
    getShortMonthDate,
};

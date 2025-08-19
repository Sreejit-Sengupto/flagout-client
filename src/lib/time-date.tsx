export const timeAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
        [60, "second"],
        [60, "minute"],
        [24, "hour"],
        [7, "day"],
        [4.34524, "week"], // average weeks per month
        [12, "month"],
        [Number.POSITIVE_INFINITY, "year"],
    ];

    let count = seconds;
    let unit: Intl.RelativeTimeFormatUnit = "second";

    for (let i = 0; i < intervals.length; i++) {
        if (count < intervals[i][0]) break;
        count /= intervals[i][0];
        unit = intervals[i][1];
    }

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return rtf.format(-Math.floor(count), unit);
};

import dayjs from "dayjs";

export const formatDate = (date: string | Date | undefined | null) => {
    return dayjs(date).format('YYYY-MM-DD');
}

export const formatDateTime = (date: string | Date | undefined | null) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export const formatDateTimeNoSeconds = (date: string | Date | undefined | null) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm');
}
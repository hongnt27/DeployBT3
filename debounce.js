export const debounce = (fn, delay) => {
    delay = delay || 0;
    let timeId;
    console.log(timeId);
    return () => {
        if (timeId) {
            clearTimeout(timeId);
            timeId = null;
        }
        timeId = setTimeout(() => {
            fn();
        }, delay);
    }
}
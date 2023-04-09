export function truncate(str){
    return str.length > 10 ? str.substring(0, 7) + "..." : str;
}
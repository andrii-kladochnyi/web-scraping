export interface ISearchData{
    [key: string]: {
        id: number,
        query: string,
        count?: number
    }
}
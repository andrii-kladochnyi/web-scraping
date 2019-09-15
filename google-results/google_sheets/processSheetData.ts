import { ISearchData } from "../types";

export function processSheetData(values: [any][any]): ISearchData{
    return values.reduce((data: ISearchData, value) => {
        data[value[1]] = {
            id: value[0],
            query: value[2]
        }
        return data;
    },{});
}
import { Pool } from "pg";
import { ISearchData } from "../types";

export async function saveResults (pool: Pool, data: ISearchData): Promise<any> {
    let values: Array<string> = [];

    for(const key in data){
        const { count, id } = data[key];
        values.push(`('${key}', ${count}, CURRENT_TIMESTAMP, ${id})`)
    }

    if(values.length) {
        await pool.query(`INSERT INTO results (technology, count, date, tech_id)
            VALUES ${values.join(",")}
        `);
    }

} 
function processTitles(categories, titles){
    let result = {};

    for (const cat of categories){
        let regEx = new RegExp(`${cat.indexOf(".") == 0 ? "" : "\\b"}${escapeRegExp(cat)
            .replace(/^\./g,'^\\.').replace(/\s/g,'\\s?\\-?')}`, "gi");
        //console.log(regEx);
        for(const title in titles){
            //console.log(regEx.test(title))
            if(regEx.test(title)){
                if(result[cat]){
                    result[cat] += titles[title];
                } else {
                    result[cat] = titles[title];
                }
            }
        }
    }

    return result;
}

function escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& - result substitution
}

module.exports = processTitles;
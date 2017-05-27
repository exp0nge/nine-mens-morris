function setUpStringFormat() {
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ?
                    args[number] :
                    match;
            });
        };
    }
}

function getQueryString() {
    let ampher = window.location.search.slice(1, ).split("&");
    let query_string = {};
    for (let i = 0; i < ampher.length; i++) {
        let kv = ampher[i].split("=");
        query_string[kv[0]] = kv[1];
    }
    return query_string;
}

export { setUpStringFormat, getQueryString };
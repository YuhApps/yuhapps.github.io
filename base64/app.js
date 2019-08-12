const inp = document.querySelector("#inp")
const key = document.querySelector("#key")
const out = document.querySelector("#out")
const enc = document.querySelector("#enc")
const dec = document.querySelector("#dec")

enc.onclick = function() { out.value = encodeUnicode(inp.value, key.value) }
dec.onclick = function() { out.value = decodeUnicode(inp.value, key.value) }

function encodeUnicode(inp, key) {
    if (key == null) return data
    else if (key !== "") data = xorStrings(key, inp)
    return btoa(inp)
}

function decodeUnicode(inp, key) {
    if (key == null) return inp
    inp = base64Decode(inp)
    return key === "" ? inp : xorStrings(inp, key)
}

function xorStrings(inp, key) {
    let out = ''
    for (var i = 0; i < inp.length; i++){
        var c = inp.charCodeAt(i)
        var k = key.charCodeAt(i % key.length)
        out += String.fromCharCode(c ^ k)
    }
    return out
}
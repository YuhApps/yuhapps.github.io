const inp = document.querySelector("#inp")
const key = document.querySelector("#key")
const out = document.querySelector("#out")
const enc = document.querySelector("#enc")
const dec = document.querySelector("#dec")

enc.onclick = function(e) { out.value = encodeUnicode(key.value, inp.value) }
dec.onclick = function(e) { out.value = decodeUnicode(key.value, inp.value) }

function encodeUnicode(key, data) {
    if (key == null) return data
    else if (key !== "") data = xorStrings(key, data)
    return btoa(data)
}

function decodeUnicode(key, data) {
    if (key == null || key === '') return data
    try {
        data = atob(data)
        return  xorStrings(key, data)
    } catch (e) {
        return "Malformed input"
    }
}

function xorStrings(key, input) {
    let output = ''
    for (var i = 0; i < input.length; i++){
        var c = input.charCodeAt(i)
        var k = key.charCodeAt(i % key.length)
        output += String.fromCharCode(c ^ k)
    }
    return output
}
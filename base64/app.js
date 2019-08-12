const inp = document.querySelector("#inp")
const key = document.querySelector("#key")
const out = document.querySelector("#out")
const enc = document.querySelector("#enc")
const dec = document.querySelector("#dec")
const clr = document.querySelector("#clr")
const cpy = document.querySelector("#cpy")

inp.onkeyup = function() { autoIncreaseHeight(inp) }
key.onkeyup = function() { autoIncreaseHeight(key) }
out.onkeyup = function() { autoIncreaseHeight(out) }

enc.onclick = function() {
    out.value = encodeUnicode(inp.value, key.value)
    autoIncreaseHeight(out)
}
dec.onclick = function() {
    out.value = decodeUnicode(inp.value, key.value)
    autoIncreaseHeight(out)
}
clr.onclick = function() {
    out.value = ""
    autoIncreaseHeight(out)
}
cpy.onclick = function() {
    out.select()
    document.execCommand('copy')
}

function encodeUnicode(inp, key) {
    if (key == null) return inp
    else if (key !== "") inp = xorStrings(key, inp)
    return btoa(inp)
}

function decodeUnicode(inp, key) {
    if (key == null) return inp
    inp = atob(inp)
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

function autoIncreaseHeight(textarea) {
    textarea.style.height = "60px";
    textarea.style.height = (textarea.scrollHeight) + "px";
}
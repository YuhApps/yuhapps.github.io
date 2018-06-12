const input = document.querySelector("#input")
const output = document.querySelector("#output")
const defaultRegex = ["clickfrom", "pf_pd", "ref", "sku", "source", "spm", "utm"]
const buttons = document.querySelectorAll("button")
const button_0 = buttons[0]
const button_1 = buttons[1]
const button_2 = buttons[2]
const button_3 = buttons[3]
const qr = document.querySelector("#qr")

document.addEventListener("DOMContentLoaded", function(ev) {
    input.onkeyup = reset
    input.onpaste = reset
    button_0.onclick = removeTrackingParams
    button_1.onclick = shortenUrl
    button_2.onclick = removeTrackingParamsAndShortenUrl
    button_3.onclick = generateQR
    document.querySelectorAll("p")[2].innerHTML = (navigator.clipboard)
              ? "Your browser supports auto copy. New URL will be auto copied once you hit a button below."
              : "Your browser does not support auto copy. Auto copy is supported in " +
                "<a href='https://www.google.com/chrome' target='_blank'>Chrome</a> and Chromium-based browsers " +
                "for computer and Android."
})

function reset(e) {
    output.value = ""
    button_0.textContent = "CLEAN URL"
    button_0.classList.remove("btn-primary")
    qr.innerHTML = ""
}

function removeTrackingParams(e) {
    if (input.value.trim() == "") {
        alert("Please enter a URL")
        return
    }
    let url = removeTrackingParamsInternal()
    output.value = url
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
    } else {
        output.select()
    }
}

function removeTrackingParamsInternal() {
    let text = input.value.trim()
    let url = ""
    let indexOfQuestionMark = text.indexOf("?")
    if (indexOfQuestionMark > -1) {
        url = text.slice(0, indexOfQuestionMark)
        let trackingParams = text.slice(indexOfQuestionMark + 1, text.length).split("&")
        let finalParams = ""
        if (trackingParams.length > 0) {
            let removals = []
            defaultRegex.forEach(function(regex) {
                trackingParams.forEach(function(trackingParam) {
                    if (trackingParam.indexOf(regex) > -1) {
                        removals.push(trackingParam)
                    }
                })
            })
            removals.forEach(function(removal) {
                let i = trackingParams.indexOf(removal)
                if (i > -1) {
                    trackingParams.splice(i, 1)
                }
            })
            trackingParams.forEach(function(trackingParam, index) {
                finalParams += (index == 0 ? "?" : "&") + trackingParam
            })
        }
        url += finalParams
    } else {
        url = text
    }
    return url
}

function shortenUrl() {
    if (input.value.trim() == "") {
        alert("Please enter a URL")
        return
    }
    let url = encodeURI(input.value.trim())
    let reqStr = "https://is.gd/create.php?format=json&url=" + url
    output.setAttribute("placeholder", "Sending request, please wait...")
    sendHttpRequest(reqStr).then(processResultFomIsGd).catch((error) => alert(error))
//    sendHttpRequest(reqStr, processResultFomIsGd)
}

function removeTrackingParamsAndShortenUrl() {
    if (input.value.trim() == "") {
        alert("Please enter a URL")
        return
    }
    let url = encodeURI(removeTrackingParamsInternal())
    let reqStr = "https://is.gd/create.php?format=json&url=" + url
    output.setAttribute("placeholder", "Sending request, please wait...")
    sendHttpRequest(reqStr).then(processResultFomIsGd).catch((error) => alert(error))
//    sendHttpRequest(reqStr, processResultFomIsGd)
}

async function sendHttpRequest(reqStr, callback) {
  if (callback) {
    let request = new XMLHttpRequest()
    request.onload = function() {
        if (request.status == 200) {
            callback(this.responseText)
        } else {
            callback(this.statusText)
        }
    }
    request.onerror = function() {
        callback(this.statusText)
    }
    request.open("GET", reqStr, true)
    request.send()
  } else {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.onload = function() {
          if (request.status == 200) {
            resolve(this.responseText)
          } else {
            reject(this.statusText)
          }
        }
        request.onerror = function() {
          reject(this.statusText)
        }
        request.open("GET", reqStr, true)
        request.send()
    })
  }
}

function processResultFomIsGd(result) {
    let json = JSON.parse(result)
    let url  = json.shorturl
    if (url) {
        output.value = url
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url)
        } else {
          output.select()
        }
    } else {
        alert(json.errormessage + " (error code: " + json.errorcode + ")")
    }
    output.setAttribute("placeholder", "New URL will be here")
}

function generateQR() {
    if (input.value.trim() == "") {
        alert("Please enter a URL")
    } else if (qr.querySelectorAll("img").length == 0) {
        new QRCode(qr, output.value == "" ? input.value.trim() : output.value)
    }
}

/**
 * Not in use
 */
function isUrlValid() {
    // Thanks to https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    let pattern = new RegExp(
            '^(https?:\/\/)?'+ // protocol
            '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
            '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
            '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
            '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
            '(\#[-a-z\d_]*)?$','i'); // fragment locater
    if (!pattern.test(str)) {
      alert("Please enter a valid URL.");
      return false;
    } else {
      return true;
    }
}

const input = document.querySelector("#input")
const output = document.querySelector("#output")
const defaultRegex = ["clickfrom", "pf_pd", "ref", "pref", "sref", "sku", "source", "spm", "utm", "key", "xguid", "xuuid", "xsessid", "xcreo", "xed", "xtz"]
const buttons = document.querySelectorAll("button")
const qr = document.querySelector("#qr")

document.addEventListener("DOMContentLoaded", function(ev) {
    input.oninput = reset
    buttons[0].onclick = cleanUrl
    buttons[1].onclick = shortenUrl
    buttons[2].onclick = cleanAndShortenUrl
    buttons[3].onclick = generateQR
    document.querySelectorAll("p")[1].innerHTML = (navigator.clipboard)
              ? "Your browser supports auto copy. New URL will be auto copied once you hit a button below."
              : "Your browser does not support auto copy. Auto copy is supported in " +
                "<a href='https://www.google.com/chrome' target='_blank'>Chrome</a> and Chromium-based browsers " +
                "for computer and Android."
})

function reset(e) {
    output.value = ""
    qr.innerHTML = ""
}

function cleanUrl(e) {
    // https://disq.us/?url=https%3A%2F%2Fwww.omgubuntu.co.uk%2F2018%2F06%2Fnat-friedman-ama-microsoft-github-deal&key=Ym7FL2CHZEFbRuUM9nphQg
    let qurl = input.value.lastIndexOf("url=")
    if (qurl > -1) {
        input.value = decodeURIComponent(input.value.slice(qurl + 4, input.value.length))
    }
    removeTrackingParams(e)
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
        qr.innerHTML = "Text copied"
    } else {
        output.select()
    }
}

// TODO: Reduce lines of code by merging two if's below
function removeTrackingParamsInternal() {
    let text = input.value.trim()
    let url = ""
    let indexOfQuestionMark = text.indexOf("?")
    let indexOfAmp = text.indexOf("&")
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
    } else if (indexOfAmp > -1) {
        url = text.slice(0, indexOfAmp)
        let trackingParams = text.slice(indexOfAmp + 1, text.length).split("&")
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
    // sendHttpRequest(reqStr).then(processResultFomIsGd).catch((error) => alert(error))
   sendHttpRequest(reqStr, processResultFomIsGd)
}

function cleanAndShortenUrl() {
    if (input.value.trim() == "") {
        alert("Please enter a URL")
        return
    }
    let url = encodeURI(removeTrackingParamsInternal())
    let reqStr = "https://is.gd/create.php?format=json&url=" + url
    output.setAttribute("placeholder", "Sending request, please wait...")
    // sendHttpRequest(reqStr).then(processResultFomIsGd).catch((error) => alert(error))
    sendHttpRequest(reqStr, processResultFomIsGd)
}

function sendHttpRequest(reqStr, callback) {
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
            qr.innerHTML = "Text copied"
        } else {
            output.select()
        }
    } else {
        alert(json.errormessage + " (error code: " + json.errorcode + ")")
    }
    output.setAttribute("placeholder", "New URL will be here")
}

function generateQR() {
    let i = input.value.trim()
    let o = output.value
    qr.innerHTML = ""
    if (o == "") {
        if (i == "") {
            alert("Please enter a URL")
        } else {
            new QRCode(qr, i)
        }
    } else {
        new QRCode(qr, o)
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

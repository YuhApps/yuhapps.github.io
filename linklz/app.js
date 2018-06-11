const input = document.querySelector("#input")
const output = document.querySelector("#output")
const defaultRegex = ["clickfrom", "pf_pd", "ref", "sku", "source", "spm", "utm"]

document.addEventListener("DOMContentLoaded", function(ev) {
    input.onkeyup = function(e) { output.value = "" }
    input.onpaste = function(e) { output.value = "" }
})

function removeTrackingParams() {
    output.value = removeTrackingParamsInternal()
}

function removeTrackingParamsInternal() {
    let text = input.value
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
    let url = encodeURI(input.value)
    let reqStr = "https://is.gd/create.php?format=json&url=" + url
    // sendHttpRequest(reqStr).then((result) => { output.value = JSON.parse(result).shorturl; copyOutput() }).catch((error) => console.log(error))
    sendHttpRequest(reqStr, processResultFomIsGd)
}

function removeTrackingParamsAndShortenUrl() {
    let url = encodeURI(removeTrackingParamsInternal())
    let reqStr = "https://is.gd/create.php?format=json&url=" + url
    // sendHttpRequest(reqStr).then((result) => { output.value = JSON.parse(result).shorturl; copyOutput() }).catch((error) => console.log(error))
    sendHttpRequest(reqStr, processResultFomIsGd)
}

function sendHttpRequest(reqStr, callback) {
  if (callback) {
    let request = new XMLHttpRequest()
    request.onload = function() {
        if (request.status == 200) {
            callback(null, this.responseText)
        } else {
            callback(this.statusText, null)
        }
    }
    request.onerror = function() {
        callback(this.statusText, null)
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

function processResultFomIsGd(err, result) {
    let json = JSON.parse(result)
    let url  = json.shorturl
    if (url) {
      output.value = url
      output.select()
    } else {
      alert(json.errormessage} + "(error code: " + json.errorcode + ")")
  }
}

function showAlert(err) {
    alert(err)
}

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

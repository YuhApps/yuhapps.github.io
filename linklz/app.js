const input = document.querySelector("#input")
const output = document.querySelector("#output")
const defaultRegex = ["clickfrom", "pf_pd", "ref", "sku", "source", "spm", "utm"]

function removeTrackingParams() {
    output.value = removeTrackingParamsInternal()
    copyOutput()
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
            defaultRegex.forEach((regex) => {
                trackingParams.forEach((trackingParam) => {
                    if (trackingParam.indexOf(regex) > -1) {
                        removals.push(trackingParam)
                    }
                })
            })
            removals.forEach((removal) => {
                let i = trackingParams.indexOf(removal)
                if (i > -1) {
                    trackingParams.splice(i, 1)
                }
            })
            trackingParams.forEach((trackingParam, index) => {
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
    let reqStr = `https://is.gd/create.php?format=json&url=${url}`
    sendHttpRequest(reqStr).then((result) => { output.value = JSON.parse(result).shorturl; copyOutput() }).catch((error) => console.log(error))
}

function removeTrackingParamsAndShortenUrl() {
    let url = encodeURI(removeTrackingParamsInternal())
    let reqStr = `https://is.gd/create.php?format=json&url=${url}`
    sendHttpRequest(reqStr).then((result) => output.value = JSON.parse(result).shorturl).catch((error) => console.log(error))
}

function sendHttpRequest(reqStr) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.onload = function() {
          if (request.status == 200) {
            resolve(this.responseText)
          } else {
            reject(this.statusText)
          }
        };
        request.onerror = function() {
          reject(this.statusText)
        }
        request.open("GET", reqStr, true)
        request.send()
    })
}

function copyOutput() {
    output.select()
    document.execCommand("copy")
    window.getSelection().removeAllRanges()
}

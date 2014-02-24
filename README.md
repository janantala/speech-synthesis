# speech-synthesis v0.2.1 [![Build Status](https://travis-ci.org/janantala/speech-synthesis.png?branch=master)](https://travis-ci.org/janantala/speech-synthesis)

Speech Synthesis polyfill based on Google Translate service. Polyfill downloads audio from Google Translate server using [CORS](http://caniuse.com/#feat=cors) and plays it using [audio](http://caniuse.com/#feat=audio) element.

### Demo

Check out http://janantala.github.io/speech-synthesis/

### References

- [W3C: Web Speech API Specification](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html)
- [HTML5 rocks: Web apps that talk - Introduction to the Speech Synthesis API](http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API)
- Speech recognition is more tricky. [Control an AngularJS app using voice commands](https://github.com/angular-adaptive/adaptive-speech)


# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management. Add

```json
dependencies: {
    "speech-synthesis": "latest"
}
```

To your `bower.json` file. Then run

    bower install

This will copy the files into your `bower_components` folder, along with its dependencies. Load the script files in your application:

```html
<script type="text/javascript" src="bower_components/speech-synthesis/polyfill.min.js"></script>
```

And finally use speech synthesis:

```js
// Initialize polyfill
var fallbackSpeechSynthesis = window.speechSynthesis || window.speechSynthesisPolyfill;
var fallbackSpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.SpeechSynthesisUtterancePolyfill;

var u = new fallbackSpeechSynthesisUtterance('Hello World');
u.lang = 'en-US';
u.volume = 1.0;
u.rate = 1.0;
u.onend = function(event) { console.log('Finished in ' + event.elapsedTime + ' seconds.'); };
fallbackSpeechSynthesis.speak(u);
```

### CORS proxy server
CORS proxy server is required to download audio from google translate service into your web application. Default value is set to `http://www.corsproxy.com/` but we would recommend you to use your own server. To set up your own change `corsProxyServer` attribute in `SpeechSynthesisUtterance` instance.

```js
u.corsProxyServer = 'http://www.corsproxy.com/';
```


### Identify the polyfill usage
To identify the pollyfill usage you can use `isPolyfill` attributes.

```js
var u = new window.SpeechSynthesisUtterancePolyfill('Hello World');
u.isPolyfill; // true

window.speechSynthesisPolyfill.isPolyfill; // true
```

# Supported attributes and methods

### SpeechSynthesis Attributes
- pending
- speaking
- paused

### SpeechSynthesis Methods
- speak()
- cancel()
- pause()
- resume()
- <del>getVoices()</del>

### SpeechSynthesisUtterance Attributes
- text
- lang
- <del>voiceURI</del>
- volume
- rate
- <del>pitch</del>

### SpeechSynthesisUtterance Events
- onstart
- onend
- onerror
- onpause
- onresume
- <del>onmark</del>
- <del>onboundary</del>

### SpeechSynthesisEvent Attributes
- <del>charIndex</del>
- elapsedTime
- <del>name</del>

### <del>SpeechSynthesisVoice</del>
- <del>voiceURI</del>
- <del>name</del>
- <del>lang</del>
- <del>localService</del>
- <del>default</del>

*Voice depends on google translate service.*

### <del>SpeechSynthesisVoiceList</del>
- <del>length</del>
- <del>item</del>

# Contributing

Contributions are welcome. Please make a pull request and do not bump versions. Also include tests.

# License

The MIT License

Copyright (c) 2014 [Jan Antala](http://www.janantala.com)

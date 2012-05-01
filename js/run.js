window.onload = function() {
    Game.spawnEntity(Background);
    Game.spawnEntity(Director);
    Game.spawnEntity(Player);
    Game.spawnEntity(Instructions);
}

    // document.cancelFullScreen = document.webkitCancelFullScreen || document.mozCancelFullScreen;
    // var elem = document.querySelector(document.webkitCancelFullScreen ? "#canvas" : "#canvas-container");

    // function onFullScreenEnter() {
    //   elem.onwebkitfullscreenchange = onFullScreenExit;
    //   elem.onmozfullscreenchange = onFullScreenExit;
    // };

    // // Called whenever the browser exits fullscreen.
    // function onFullScreenExit() {
    //   console.log("Exited fullscreen!");
    // };

    // // Note: FF nightly needs about:config full-screen-api.enabled set to true.
    // function enterFullscreen() {
    //   console.log("enterFullscreen()");
    //   elem.onwebkitfullscreenchange = onFullScreenEnter;
    //   elem.onmozfullscreenchange = onFullScreenEnter;
    //   if (elem.webkitRequestFullScreen) {
    //     elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    //   } else {
    //     elem.mozRequestFullScreen();
    //   }
    //   document.getElementById('enter-exit-fs').onclick = exitFullscreen;
    // }

    // function exitFullscreen() {
    //   console.log("exitFullscreen()");
    //   document.cancelFullScreen();
    //   document.getElementById('enter-exit-fs').onclick = enterFullscreen;
    // }

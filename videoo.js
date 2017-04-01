//     function setVideoSize() {


//     var dd = document.getElementsByClassName('article-entry')[0];
//     var pl = window.getComputedStyle(dd,null).paddingLeft;
//     var padding = parseInt(pl);
//     var width = document.getElementsByClassName('article')[0].offsetWidth - padding * 2;

//     var video = document.getElementById('my-player');
//     var height = width * 0.5625;
//     video.style.height = height + 'px';
//     video.style.width = width + 'px';

//     var videoo = document.getElementById('my-player_html5_api');
//     videoo.style.width = width + 'px';
//     videoo.style.height = height + 'px';

// }
// setVideoSize();
// window.onresize = function() {

//     setVideoSize();

// }
    function setVideoSize() {

    var dd = document.getElementsByClassName('article-entry')[0];
    var pl = window.getComputedStyle(dd,null).paddingLeft;

    var padding = parseInt(pl);
    var width = dd.offsetWidth - padding * 2;
    var height = width * 0.5625;
    var videoo = document.getElementById('my-player_html5_api');
    videoo.style.width = width + 'px';
    videoo.style.height = height + 'px';
    var video = document.getElementById('my-player');

    video.style.height = height + 'px';
    video.style.width = width + 'px';



}

window.onload = function () {
            setVideoSize();

        };
window.onresize = function() {

    setVideoSize();

}

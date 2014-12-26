var SVGMorpheus = require('SVGMorpheus');
var $ = require('jquery')

var svg = new SVGMorpheus(document.getElementById('player-control'), {
  duration: 500,
  easing: 'cubic-out'
});

$('#btn-play').click(function(){
    svg.to('icon-pause');
})

$('#btn-pause').click(function(){
    svg.to('icon-play');
})
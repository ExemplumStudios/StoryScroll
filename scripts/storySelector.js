var currentStory;

d3.json('/data/impossibleCourage.json', function (data) {
    var currentStory = data;
    console.log(currentStory);

    function redraw() {
        var heightResponsive = window.innerHeight * 0.8;
        var widthResponsive = window.innerWidth * 0.5;

        d3.selectAll('svg').remove();
        d3.selectAll('#tooltipNode').remove();

        storyScroll(widthResponsive, heightResponsive, 70, currentStory);
    }

    redraw();

    window.addEventListener('resize', redraw);
})

//function redraw() {
//    var heightResponsive = window.innerHeight * 0.8;
//    var widthResponsive = window.innerWidth * 0.5;
//
//    d3.selectAll('svg').remove();
//    d3.selectAll('#tooltipNode').remove();
//
//    storyScroll(widthResponsive, heightResponsive, 70, currentStory);
//}
//
//redraw();
//
//window.addEventListener('resize', redraw);
